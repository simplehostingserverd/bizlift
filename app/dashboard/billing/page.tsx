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

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBillingPortal = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          return_url: window.location.origin + "/dashboard/billing",
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open billing portal");
        setIsLoading(false);
      }
    } catch (error) {
      alert("An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">Free Plan</h3>
              <p className="text-gray-600">Basic funding recommendations</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">What's included:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">3 funding recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Business profile creation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Basic match scoring</span>
                </li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <Link href="/pricing">
                <Button>Upgrade to Premium</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manage Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
          <CardDescription>
            Update payment methods, view invoices, and manage your billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Use the Stripe Customer Portal to manage your subscription, update
            payment methods, and view billing history.
          </p>
          <Button onClick={handleBillingPortal} disabled={isLoading}>
            {isLoading ? "Opening..." : "Open Billing Portal"}
          </Button>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-1">Premium Monthly</h3>
              <p className="text-2xl font-bold mb-2">$29.99/mo</p>
              <ul className="space-y-1 text-sm mb-4">
                <li>Unlimited funding matches</li>
                <li>Priority support</li>
                <li>Monthly coaching session</li>
              </ul>
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded inline-block mb-2">
                BEST VALUE
              </div>
              <h3 className="font-semibold mb-1">Premium Annual</h3>
              <p className="text-2xl font-bold mb-2">$299.99/yr</p>
              <ul className="space-y-1 text-sm mb-4">
                <li>All Premium features</li>
                <li>Save 2 months ($59.98)</li>
                <li>Dedicated account manager</li>
              </ul>
              <Link href="/pricing">
                <Button size="sm" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
