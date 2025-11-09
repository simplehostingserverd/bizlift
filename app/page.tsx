import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">BizLift</div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Find the Perfect Funding for Your Business
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          BizLift matches your small business with the best funding programs
          using AI-powered recommendations. Get access to grants, loans, and
          investment opportunities tailored to your needs.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg">Start Free Assessment</Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          How BizLift Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Complete Your Profile</CardTitle>
              <CardDescription>
                Tell us about your business, industry, and funding needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our simple onboarding process takes just 5 minutes. Provide
                details about your revenue, employees, location, and funding
                goals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Get Matched</CardTitle>
              <CardDescription>
                AI analyzes 100+ funding programs to find your best options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our funding engine scores every program based on your
                eligibility, giving you personalized recommendations with match
                scores and reasoning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Apply & Succeed</CardTitle>
              <CardDescription>
                Access application links and get support through the process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Premium members get application assistance, business plan
                reviews, and coaching to maximize your chances of approval.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Funding Types */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Access Multiple Funding Sources
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold mb-2">Government Grants</h3>
              <p className="text-sm text-gray-600">
                SBA, SBIR, state programs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl mb-2">🏦</div>
              <h3 className="font-semibold mb-2">Business Loans</h3>
              <p className="text-sm text-gray-600">
                Banks, credit unions, online lenders
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold mb-2">Venture Capital</h3>
              <p className="text-sm text-gray-600">
                Seed funding for high-growth startups
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Specialty Programs</h3>
              <p className="text-sm text-gray-600">
                Women, minority, rural-owned
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Fund Your Growth?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join hundreds of businesses that have found funding through BizLift
        </p>
        <Link href="/auth/register">
          <Button size="lg">Create Free Account</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 BizLift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
