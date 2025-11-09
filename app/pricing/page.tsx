"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: string) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(priceId);

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
        setIsLoading(null);
      }
    } catch (error) {
      alert("An error occurred");
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            BizLift
          </Link>
          <div className="flex gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">
            Choose the plan that's right for your business
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect to get started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Business profile creation
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  3 funding program recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic match scoring
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Access to funding database
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/register" className="w-full">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-primary border-2 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>
            <CardHeader>
              <CardTitle>Premium Monthly</CardTitle>
              <CardDescription>For growing businesses</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29.99</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <strong>Unlimited funding matches</strong>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority customer support
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  One monthly funding coach session (30 min)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced analytics dashboard
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Application tracking & reminders
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Early access to new programs
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() =>
                  handleCheckout("price_premium_monthly", "subscription")
                }
                disabled={isLoading === "price_premium_monthly"}
              >
                {isLoading === "price_premium_monthly"
                  ? "Loading..."
                  : "Subscribe Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Annual Plan */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Premium Annual</CardTitle>
                  <CardDescription>Best value - save $59.98/year</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$299.99</span>
                    <span className="text-gray-600">/year</span>
                    <span className="ml-2 text-sm text-green-600 font-semibold">
                      Save 2 months!
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  All Premium Monthly features
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Quarterly business health reports
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  12 funding coach sessions/year
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Dedicated account manager
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom funding strategy document
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  2 months free ($59.98 value)
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() =>
                  handleCheckout("price_premium_annual", "subscription")
                }
                disabled={isLoading === "price_premium_annual"}
              >
                {isLoading === "price_premium_annual"
                  ? "Loading..."
                  : "Subscribe Annually"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* One-Time Purchases */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">One-Time Services</h2>
          <p className="text-gray-600">
            Additional support when you need it most
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Boost</CardTitle>
              <CardDescription>Accelerated start</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99.99</span>
                <span className="text-gray-600"> one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Hands-on onboarding assistance
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  60-min personalized strategy session
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Business profile optimization
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority funding search
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom recommendation report
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleCheckout("price_onboarding_boost", "payment")
                }
                disabled={isLoading === "price_onboarding_boost"}
              >
                {isLoading === "price_onboarding_boost"
                  ? "Loading..."
                  : "Purchase Now"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Support</CardTitle>
              <CardDescription>Professional assistance</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$149.99</span>
                <span className="text-gray-600"> one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Application review & editing (up to 3)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Document preparation help
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Business plan review
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Financial projections review
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Interview preparation
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  handleCheckout("price_application_support", "payment")
                }
                disabled={isLoading === "price_application_support"}
              >
                {isLoading === "price_application_support"
                  ? "Loading..."
                  : "Purchase Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 BizLift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
