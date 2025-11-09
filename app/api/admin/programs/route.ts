import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const fundingProgramSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  type: z.string().min(1),
  minAmount: z.number().min(0),
  maxAmount: z.number().min(0),
  industries: z.array(z.string()),
  minRevenue: z.number().min(0).nullable().optional(),
  maxRevenue: z.number().min(0).nullable().optional(),
  minEmployees: z.number().int().min(0).nullable().optional(),
  maxEmployees: z.number().int().min(0).nullable().optional(),
  minYearsActive: z.number().int().min(0).nullable().optional(),
  location: z.string().nullable().optional(),
  creditScoreMin: z.number().int().min(300).max(850).nullable().optional(),
  requiresCollateral: z.boolean(),
  interestRate: z.number().min(0).nullable().optional(),
  repaymentTerms: z.string().nullable().optional(),
  eligibility: z.string().min(1),
  applicationUrl: z.string().url(),
  description: z.string().min(1),
  tags: z.array(z.string()),
  isActive: z.boolean().optional(),
});

// Admin: Get all programs
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const programs = await prisma.fundingProgram.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ programs, count: programs.length });
  } catch (error: any) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Admin: Create new program
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    const validationResult = fundingProgramSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const program = await prisma.fundingProgram.create({
      data: {
        ...validationResult.data,
        isActive: validationResult.data.isActive ?? true,
      },
    });

    return NextResponse.json({ program }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
