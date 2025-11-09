"use client";

import { useEffect, useState } from "react";
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

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/onboarding");
        if (res.ok) {
          const data = await res.json();
          const profile = data.profile;
          setFormData({
            businessName: profile.businessName,
            industry: profile.industry,
            location: profile.location,
            annualRevenue: profile.annualRevenue.toString(),
            employees: profile.employees.toString(),
            yearsActive: profile.yearsActive.toString(),
            fundingNeed: profile.fundingNeed.toString(),
            legalStructure: profile.legalStructure,
            creditScore: profile.creditScore?.toString() || "",
            hasCollateral: profile.hasCollateral,
            description: profile.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

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
    setSuccess(false);
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
        setError(data.error || "Failed to update profile");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Business Profile</h1>
        <p className="text-gray-600">Update your business information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Keep your information up to date for accurate funding recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                Profile updated successfully!
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select an industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (State) *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalStructure">Legal Structure *</Label>
                <select
                  id="legalStructure"
                  name="legalStructure"
                  value={formData.legalStructure}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select legal structure</option>
                  {legalStructures.map((structure) => (
                    <option key={structure} value={structure}>
                      {structure}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue ($) *</Label>
                <Input
                  id="annualRevenue"
                  name="annualRevenue"
                  type="number"
                  step="0.01"
                  value={formData.annualRevenue}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees *</Label>
                <Input
                  id="employees"
                  name="employees"
                  type="number"
                  value={formData.employees}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsActive">Years in Business *</Label>
                <Input
                  id="yearsActive"
                  name="yearsActive"
                  type="number"
                  value={formData.yearsActive}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingNeed">Funding Needed ($) *</Label>
                <Input
                  id="fundingNeed"
                  name="fundingNeed"
                  type="number"
                  step="0.01"
                  value={formData.fundingNeed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score (Optional)</Label>
                <Input
                  id="creditScore"
                  name="creditScore"
                  type="number"
                  min="300"
                  max="850"
                  value={formData.creditScore}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                I have collateral available
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description (Optional)</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
