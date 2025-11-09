import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getTopRecommendations } from "@/lib/fundingEngine";

// Get funding recommendations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's business profile
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!businessProfile) {
      return NextResponse.json(
        { error: "Please complete your business profile first" },
        { status: 400 }
      );
    }

    // Check if user has active subscription for unlimited recommendations
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
      include: {
        subscriptions: {
          where: {
            status: "active",
          },
        },
      },
    });

    const hasActiveSubscription = customer && customer.subscriptions.length > 0;

    // Get all active funding programs
    const fundingPrograms = await prisma.fundingProgram.findMany({
      where: { isActive: true },
    });

    // Calculate matches
    const matches = getTopRecommendations(
      businessProfile,
      fundingPrograms,
      hasActiveSubscription ? 50 : 3 // Free users get 3 recommendations
    );

    // Get existing recommendations from database
    const existingRecommendations = await prisma.recommendation.findMany({
      where: { userId: session.user.id },
      include: {
        fundingProgram: true,
      },
    });

    // Merge new matches with existing recommendations
    const recommendations = matches.map((match) => {
      const existing = existingRecommendations.find(
        (r) => r.fundingProgramId === match.program.id
      );

      return {
        id: existing?.id,
        program: match.program,
        matchScore: match.matchScore,
        reasons: match.reasons,
        status: existing?.status || "pending",
        createdAt: existing?.createdAt,
      };
    });

    return NextResponse.json({
      recommendations,
      hasActiveSubscription,
      limit: hasActiveSubscription ? null : 3,
    });
  } catch (error: any) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create or update recommendation status
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fundingProgramId, matchScore, reasons, status } = body;

    if (!fundingProgramId) {
      return NextResponse.json(
        { error: "Funding program ID is required" },
        { status: 400 }
      );
    }

    const recommendation = await prisma.recommendation.upsert({
      where: {
        userId_fundingProgramId: {
          userId: session.user.id,
          fundingProgramId,
        },
      },
      update: {
        status: status || "pending",
        matchScore: matchScore,
        reasons: reasons || [],
      },
      create: {
        userId: session.user.id,
        fundingProgramId,
        matchScore: matchScore || 0,
        reasons: reasons || [],
        status: status || "pending",
      },
    });

    return NextResponse.json({ recommendation });
  } catch (error: any) {
    console.error("Error updating recommendation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
