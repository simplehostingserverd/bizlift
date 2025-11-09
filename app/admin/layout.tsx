"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
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

  if (session?.user?.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              BizLift Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  User Dashboard
                </Button>
              </Link>
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
            </nav>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
