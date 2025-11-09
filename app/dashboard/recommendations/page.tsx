"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/funding/recommendations");
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
          setHasActiveSubscription(data.hasActiveSubscription);
          setLimit(data.limit);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  const filteredRecs =
    filter === "all"
      ? recommendations
      : recommendations.filter((r) => r.program.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Funding Recommendations</h1>
        <p className="text-gray-600">
          Personalized funding programs matched to your business
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({recommendations.length})
        </Button>
        <Button
          variant={filter === "Grant" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Grant")}
        >
          Grants
        </Button>
        <Button
          variant={filter === "Loan" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Loan")}
        >
          Loans
        </Button>
        <Button
          variant={filter === "Equity" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Equity")}
        >
          Equity
        </Button>
      </div>

      {/* Upgrade Notice */}
      {!hasActiveSubscription && limit && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg">Free Plan Limit</CardTitle>
            <CardDescription>
              You're viewing {limit} of {recommendations.length} available matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">
              Upgrade to Premium to see all funding opportunities and get
              priority support.
            </p>
            <Link href="/pricing">
              <Button size="sm">Upgrade to Premium</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recommendations List */}
      {filteredRecs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No recommendations found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecs.map((rec: any) => (
            <Card key={rec.program.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="mb-1">{rec.program.name}</CardTitle>
                    <CardDescription>{rec.program.provider}</CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-primary">
                      {rec.matchScore}%
                    </div>
                    <p className="text-xs text-gray-500">Match</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {rec.program.type}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      ${rec.program.minAmount.toLocaleString()} - $
                      {rec.program.maxAmount.toLocaleString()}
                    </span>
                    {rec.program.interestRate && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {rec.program.interestRate}% interest
                      </span>
                    )}
                    {rec.program.location && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {rec.program.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700">
                    {rec.program.description}
                  </p>

                  {/* Match Reasons */}
                  {rec.reasons && rec.reasons.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Why this matches:
                      </h4>
                      <ul className="space-y-1">
                        {rec.reasons.map((reason: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Eligibility */}
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Eligibility:</h4>
                    <p className="text-sm text-gray-600">
                      {rec.program.eligibility}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <a
                      href={rec.program.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>Apply Now</Button>
                    </a>
                    <Button variant="outline">Save for Later</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
