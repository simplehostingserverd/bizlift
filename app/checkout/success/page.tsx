"use client";

import { useEffect } from "react";
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

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Refresh the page data after successful checkout
    router.refresh();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your subscription is now active
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Thank you for subscribing to BizLift Premium. You now have access to
            all premium features including unlimited funding matches and priority
            support.
          </p>
          <div className="space-y-2">
            <Link href="/dashboard" className="block">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link href="/dashboard/recommendations" className="block">
              <Button variant="outline" className="w-full">
                View Funding Matches
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
