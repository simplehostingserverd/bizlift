import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all funding programs (with optional filtering)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const industry = searchParams.get("industry");
    const location = searchParams.get("location");

    const where: any = { isActive: true };

    if (type) {
      where.type = type;
    }

    if (industry) {
      where.industries = {
        has: industry,
      };
    }

    if (location) {
      where.OR = [
        { location: location },
        { location: "National" },
        { location: null },
      ];
    }

    const programs = await prisma.fundingProgram.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ programs, count: programs.length });
  } catch (error: any) {
    console.error("Error fetching funding programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
