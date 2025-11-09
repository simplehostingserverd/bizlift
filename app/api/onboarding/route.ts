import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const businessProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().min(1, "Location is required"),
  annualRevenue: z.number().min(0, "Annual revenue must be positive"),
  employees: z.number().int().min(0, "Number of employees must be positive"),
  yearsActive: z.number().int().min(0, "Years active must be positive"),
  fundingNeed: z.number().min(0, "Funding need must be positive"),
  legalStructure: z.enum(["LLC", "Corporation", "Sole Proprietorship", "Partnership"]),
  creditScore: z.number().int().min(300).max(850).optional(),
  hasCollateral: z.boolean(),
  description: z.string().optional(),
});

// Create or update business profile
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validationResult = businessProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if profile already exists
    const existingProfile = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.businessProfile.update({
        where: { userId: session.user.id },
        data,
      });
    } else {
      // Create new profile
      profile = await prisma.businessProfile.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({
      message: existingProfile ? "Profile updated successfully" : "Profile created successfully",
      profile,
    });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get business profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
