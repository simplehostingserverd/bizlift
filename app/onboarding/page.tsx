"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const industries = [
  "Technology",
  "Retail",
  "Healthcare",
  "Manufacturing",
  "Services",
  "Food & Beverage",
];

const legalStructures = [
  "LLC",
  "Corporation",
  "Sole Proprietorship",
  "Partnership",
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    location: "",
    annualRevenue: "",
    employees: "",
    yearsActive: "",
    fundingNeed: "",
    legalStructure: "",
    creditScore: "",
    hasCollateral: false,
    description: "",
  });

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        businessName: formData.businessName,
        industry: formData.industry,
        location: formData.location,
        annualRevenue: parseFloat(formData.annualRevenue),
        employees: parseInt(formData.employees),
        yearsActive: parseInt(formData.yearsActive),
        fundingNeed: parseFloat(formData.fundingNeed),
        legalStructure: formData.legalStructure,
        creditScore: formData.creditScore ? parseInt(formData.creditScore) : undefined,
        hasCollateral: formData.hasCollateral,
        description: formData.description || undefined,
      };

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save profile");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to BizLift!</CardTitle>
            <CardDescription>
              Tell us about your business so we can find the best funding
              opportunities for you. This takes about 5 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select an industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (State) *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., California, Texas"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Annual Revenue */}
              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue ($) *</Label>
                <Input
                  id="annualRevenue"
                  name="annualRevenue"
                  type="number"
                  step="0.01"
                  placeholder="500000"
                  value={formData.annualRevenue}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Number of Employees */}
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees *</Label>
                <Input
                  id="employees"
                  name="employees"
                  type="number"
                  placeholder="10"
                  value={formData.employees}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Years Active */}
              <div className="space-y-2">
                <Label htmlFor="yearsActive">Years in Business *</Label>
                <Input
                  id="yearsActive"
                  name="yearsActive"
                  type="number"
                  placeholder="3"
                  value={formData.yearsActive}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Funding Need */}
              <div className="space-y-2">
                <Label htmlFor="fundingNeed">Funding Needed ($) *</Label>
                <Input
                  id="fundingNeed"
                  name="fundingNeed"
                  type="number"
                  step="0.01"
                  placeholder="250000"
                  value={formData.fundingNeed}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Legal Structure */}
              <div className="space-y-2">
                <Label htmlFor="legalStructure">Legal Structure *</Label>
                <select
                  id="legalStructure"
                  name="legalStructure"
                  value={formData.legalStructure}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select legal structure</option>
                  {legalStructures.map((structure) => (
                    <option key={structure} value={structure}>
                      {structure}
                    </option>
                  ))}
                </select>
              </div>

              {/* Credit Score (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score (Optional)</Label>
                <Input
                  id="creditScore"
                  name="creditScore"
                  type="number"
                  min="300"
                  max="850"
                  placeholder="720"
                  value={formData.creditScore}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">Range: 300-850</p>
              </div>

              {/* Has Collateral */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasCollateral"
                  name="hasCollateral"
                  checked={formData.hasCollateral}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="hasCollateral" className="font-normal">
                  I have collateral available (property, equipment, etc.)
                </Label>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Business Description (Optional)
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your business and what you do..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Profile & Find Funding"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
