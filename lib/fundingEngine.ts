import { FundingProgram, BusinessProfile } from "@prisma/client";

export interface FundingMatch {
  program: FundingProgram;
  matchScore: number;
  reasons: string[];
  dealBreakers: string[];
}

/**
 * Core funding matching engine that scores businesses against funding programs
 * Returns an array of matches sorted by score (highest first)
 */
export function calculateFundingMatches(
  business: BusinessProfile,
  programs: FundingProgram[]
): FundingMatch[] {
  const matches: FundingMatch[] = [];

  for (const program of programs) {
    if (!program.isActive) continue;

    const match = scoreProgramMatch(business, program);

    // Only include programs that aren't disqualified by deal breakers
    if (match.dealBreakers.length === 0 && match.matchScore >= 40) {
      matches.push(match);
    }
  }

  // Sort by match score (highest first)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Scores a single program against a business profile
 */
function scoreProgramMatch(
  business: BusinessProfile,
  program: FundingProgram
): FundingMatch {
  let score = 0;
  const reasons: string[] = [];
  const dealBreakers: string[] = [];

  // Industry match (critical - 25 points)
  if (program.industries.includes(business.industry)) {
    score += 25;
    reasons.push(`Industry match: ${business.industry}`);
  } else {
    dealBreakers.push(`Industry not eligible (requires: ${program.industries.join(", ")})`);
  }

  // Revenue requirements (20 points)
  if (program.minRevenue !== null && business.annualRevenue < program.minRevenue) {
    dealBreakers.push(
      `Annual revenue too low (minimum: $${program.minRevenue.toLocaleString()})`
    );
  } else if (program.minRevenue !== null && business.annualRevenue >= program.minRevenue) {
    score += 10;
    reasons.push("Revenue requirement met");
  }

  if (program.maxRevenue !== null && business.annualRevenue > program.maxRevenue) {
    dealBreakers.push(
      `Annual revenue too high (maximum: $${program.maxRevenue.toLocaleString()})`
    );
  } else if (program.maxRevenue !== null) {
    score += 10;
    reasons.push("Revenue within eligible range");
  }

  // Employee count (10 points)
  if (program.minEmployees !== null && business.employees < program.minEmployees) {
    dealBreakers.push(`Not enough employees (minimum: ${program.minEmployees})`);
  } else if (program.minEmployees !== null && business.employees >= program.minEmployees) {
    score += 5;
    reasons.push("Employee count meets minimum");
  }

  if (program.maxEmployees !== null && business.employees > program.maxEmployees) {
    dealBreakers.push(`Too many employees (maximum: ${program.maxEmployees})`);
  } else if (program.maxEmployees !== null) {
    score += 5;
    reasons.push("Employee count within range");
  }

  // Years in business (10 points)
  if (program.minYearsActive !== null && business.yearsActive < program.minYearsActive) {
    dealBreakers.push(
      `Business not established long enough (minimum: ${program.minYearsActive} years)`
    );
  } else if (program.minYearsActive !== null && business.yearsActive >= program.minYearsActive) {
    score += 10;
    reasons.push(`Business established for ${business.yearsActive} years`);
  }

  // Credit score (15 points)
  if (program.creditScoreMin !== null && business.creditScore) {
    if (business.creditScore < program.creditScoreMin) {
      dealBreakers.push(
        `Credit score too low (minimum: ${program.creditScoreMin})`
      );
    } else {
      score += 15;
      const difference = business.creditScore - program.creditScoreMin;
      if (difference >= 50) {
        score += 5; // Bonus for strong credit
        reasons.push("Excellent credit score exceeds minimum");
      } else {
        reasons.push("Credit score meets minimum requirement");
      }
    }
  }

  // Collateral (10 points)
  if (program.requiresCollateral && !business.hasCollateral) {
    dealBreakers.push("Collateral required but not available");
  } else if (program.requiresCollateral && business.hasCollateral) {
    score += 10;
    reasons.push("Collateral available as required");
  } else if (!program.requiresCollateral) {
    score += 5;
    reasons.push("No collateral required");
  }

  // Location match (10 points)
  if (program.location === "National" || program.location === null) {
    score += 10;
    reasons.push("Available nationwide");
  } else if (program.location?.toLowerCase().includes(business.location.toLowerCase())) {
    score += 10;
    reasons.push(`Location match: ${business.location}`);
  } else if (program.location) {
    dealBreakers.push(`Location restricted to: ${program.location}`);
  }

  // Funding amount fit (10 points)
  const fundingNeed = business.fundingNeed;
  if (fundingNeed >= program.minAmount && fundingNeed <= program.maxAmount) {
    score += 10;
    reasons.push(
      `Funding need ($${fundingNeed.toLocaleString()}) within program range`
    );
  } else if (fundingNeed < program.minAmount) {
    dealBreakers.push(
      `Funding need too low (minimum: $${program.minAmount.toLocaleString()})`
    );
  } else if (fundingNeed > program.maxAmount) {
    dealBreakers.push(
      `Funding need too high (maximum: $${program.maxAmount.toLocaleString()})`
    );
  }

  // Bonus points for favorable terms
  if (program.type === "Grant") {
    score += 5;
    reasons.push("Grant - no repayment required");
  }

  if (program.interestRate !== null && program.interestRate < 7) {
    score += 3;
    reasons.push(`Low interest rate: ${program.interestRate}%`);
  }

  // Cap at 100
  score = Math.min(score, 100);

  return {
    program,
    matchScore: score,
    reasons,
    dealBreakers,
  };
}

/**
 * Get top N funding recommendations for a business
 */
export function getTopRecommendations(
  business: BusinessProfile,
  programs: FundingProgram[],
  limit: number = 10
): FundingMatch[] {
  const matches = calculateFundingMatches(business, programs);
  return matches.slice(0, limit);
}

/**
 * Filter programs by type
 */
export function filterByType(
  programs: FundingProgram[],
  type: string
): FundingProgram[] {
  return programs.filter((p) => p.type === type);
}

/**
 * Get programs suitable for startups (0-2 years)
 */
export function getStartupFriendlyPrograms(
  programs: FundingProgram[]
): FundingProgram[] {
  return programs.filter(
    (p) =>
      p.isActive &&
      (p.minYearsActive === null || p.minYearsActive <= 1) &&
      (p.minRevenue === null || p.minRevenue <= 100000)
  );
}
