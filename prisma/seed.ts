import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (in development)
  if (process.env.NODE_ENV !== "production") {
    console.log("🗑️  Cleaning existing data...");
    await prisma.recommendation.deleteMany();
    await prisma.purchase.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.businessProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.fundingProgram.deleteMany();
    await prisma.settings.deleteMany();
  }

  // Create admin user
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@bizlift.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log(`✅ Admin user created: ${adminUser.email}`);

  // Create demo client user with business profile
  console.log("👤 Creating demo client user...");
  const demoPassword = await bcrypt.hash("Demo123!", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@example.com",
      password: demoPassword,
      role: "client",
      business: {
        create: {
          businessName: "TechStart Solutions",
          industry: "Technology",
          location: "California",
          annualRevenue: 500000,
          employees: 12,
          yearsActive: 3,
          fundingNeed: 250000,
          legalStructure: "LLC",
          creditScore: 720,
          hasCollateral: true,
          description:
            "A growing software development company specializing in custom business solutions for small to medium enterprises.",
        },
      },
    },
  });
  console.log(`✅ Demo client created: ${demoUser.email}`);

  // Load and seed funding programs
  console.log("💰 Seeding funding programs...");
  const fundingProgramsPath = path.join(
    process.cwd(),
    "public",
    "fundingPrograms.json"
  );
  const fundingProgramsData = JSON.parse(
    fs.readFileSync(fundingProgramsPath, "utf-8")
  );

  let programCount = 0;
  for (const program of fundingProgramsData) {
    await prisma.fundingProgram.create({
      data: {
        name: program.name,
        provider: program.provider,
        type: program.type,
        minAmount: program.minAmount,
        maxAmount: program.maxAmount,
        industries: program.industries,
        minRevenue: program.minRevenue,
        maxRevenue: program.maxRevenue,
        minEmployees: program.minEmployees,
        maxEmployees: program.maxEmployees,
        minYearsActive: program.minYearsActive,
        location: program.location,
        creditScoreMin: program.creditScoreMin,
        requiresCollateral: program.requiresCollateral,
        interestRate: program.interestRate,
        repaymentTerms: program.repaymentTerms,
        eligibility: program.eligibility,
        applicationUrl: program.applicationUrl,
        description: program.description,
        tags: program.tags,
        isActive: true,
      },
    });
    programCount++;
  }
  console.log(`✅ Created ${programCount} funding programs`);

  // Create sample recommendations for demo user
  console.log("📊 Creating sample recommendations...");
  const fundingPrograms = await prisma.fundingProgram.findMany({
    take: 5,
    where: {
      industries: {
        has: "Technology",
      },
    },
  });

  for (const program of fundingPrograms) {
    // Calculate a sample match score based on simple criteria
    let matchScore = 70; // base score

    if (program.minRevenue && 500000 >= program.minRevenue) matchScore += 10;
    if (program.creditScoreMin && 720 >= program.creditScoreMin) matchScore += 10;
    if (program.minYearsActive && 3 >= program.minYearsActive) matchScore += 5;

    const reasons = [];
    if (program.industries.includes("Technology")) {
      reasons.push("Industry match: Technology sector");
    }
    if (program.minRevenue && 500000 >= program.minRevenue) {
      reasons.push("Revenue requirement met");
    }
    if (program.creditScoreMin && 720 >= program.creditScoreMin) {
      reasons.push("Credit score exceeds minimum");
    }

    await prisma.recommendation.create({
      data: {
        userId: demoUser.id,
        fundingProgramId: program.id,
        matchScore: Math.min(matchScore, 100),
        reasons,
        status: "pending",
      },
    });
  }
  console.log(`✅ Created ${fundingPrograms.length} recommendations`);

  // Optional: Create sample Stripe customer for demo user
  // Note: This creates a placeholder. In production, actual Stripe customers
  // are created via the API when users subscribe
  console.log("💳 Creating sample Stripe customer record...");
  await prisma.customer.create({
    data: {
      stripeCustomerId: "cus_sample_demo_customer",
      userId: demoUser.id,
      email: demoUser.email,
    },
  });
  console.log("✅ Sample Stripe customer record created");

  // Create default settings
  console.log("⚙️  Creating default settings...");
  await prisma.settings.create({
    data: {
      id: "default",
      appUrl: null,
      stripeSuccessUrl: null,
      stripeCancelUrl: null,
      stripeBillingReturnUrl: null,
    },
  });
  console.log("✅ Default settings created");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📝 Login credentials:");
  console.log("Admin: admin@bizlift.com / Admin123!");
  console.log("Demo Client: demo@example.com / Demo123!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
