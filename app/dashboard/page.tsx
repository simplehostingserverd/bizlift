"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, recsRes] = await Promise.all([
          fetch("/api/onboarding"),
          fetch("/api/funding/recommendations"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.profile);
        }

        if (recsRes.ok) {
          const recsData = await recsRes.json();
          setRecommendations(recsData.recommendations || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">
          Complete Your Business Profile
        </h2>
        <p className="text-gray-600 mb-6">
          Get started by telling us about your business to receive personalized
          funding recommendations.
        </p>
        <Link href="/onboarding">
          <Button>Complete Profile</Button>
        </Link>
      </div>
    );
  }

  const topMatches = recommendations.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-600">
          Here's an overview of your funding opportunities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Matches</CardDescription>
            <CardTitle className="text-3xl">
              {recommendations.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              Funding programs matched to your business
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Funding Needed</CardDescription>
            <CardTitle className="text-3xl">
              ${profile.fundingNeed.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Your target funding amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Business Age</CardDescription>
            <CardTitle className="text-3xl">{profile.yearsActive} yrs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Years in business</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>{profile.businessName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Industry:</span> {profile.industry}
            </div>
            <div>
              <span className="font-semibold">Location:</span> {profile.location}
            </div>
            <div>
              <span className="font-semibold">Annual Revenue:</span> $
              {profile.annualRevenue.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Employees:</span> {profile.employees}
            </div>
            <div>
              <span className="font-semibold">Legal Structure:</span>{" "}
              {profile.legalStructure}
            </div>
            {profile.creditScore && (
              <div>
                <span className="font-semibold">Credit Score:</span>{" "}
                {profile.creditScore}
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      {topMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Funding Matches</CardTitle>
            <CardDescription>
              Your best opportunities based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMatches.map((rec: any) => (
                <div
                  key={rec.program.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{rec.program.name}</h3>
                      <p className="text-sm text-gray-600">
                        {rec.program.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {rec.matchScore}%
                      </div>
                      <p className="text-xs text-gray-500">Match Score</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {rec.program.type}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      ${rec.program.minAmount.toLocaleString()} - $
                      {rec.program.maxAmount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {rec.program.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/recommendations">
                <Button>View All Recommendations</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA */}
      {recommendations.length === 3 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary">
          <CardHeader>
            <CardTitle>Unlock More Opportunities</CardTitle>
            <CardDescription>
              Get unlimited funding matches with Premium
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Free users see 3 recommendations. Upgrade to Premium for unlimited
              matches, priority support, and coaching sessions.
            </p>
            <Link href="/pricing">
              <Button>Upgrade to Premium</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
