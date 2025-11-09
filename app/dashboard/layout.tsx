"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              BizLift
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session?.user?.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/recommendations"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Funding Matches
              </Link>
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Business Profile
              </Link>
              <Link
                href="/dashboard/billing"
                className="block px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Billing
              </Link>
              {isAdmin && (
                <>
                  <div className="pt-4 mt-4 border-t">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
                      Admin
                    </p>
                    <Link
                      href="/admin"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      href="/admin/programs"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                      Manage Programs
                    </Link>
                    <Link
                      href="/admin/users"
                      className="block px-4 py-2 rounded-md hover:bg-gray-100"
                    >
                      Manage Users
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
