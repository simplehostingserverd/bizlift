"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrograms: 0,
    activePrograms: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const fetchStats = async () => {
      try {
        const [usersRes, programsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/programs"),
        ]);

        if (usersRes.ok && programsRes.ok) {
          const usersData = await usersRes.json();
          const programsData = await programsRes.json();

          setStats({
            totalUsers: usersData.count || 0,
            totalPrograms: programsData.count || 0,
            activePrograms:
              programsData.programs?.filter((p: any) => p.isActive).length || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, session, router]);

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Registered user accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Programs</CardDescription>
            <CardTitle className="text-3xl">{stats.activePrograms}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Currently available programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Programs</CardDescription>
            <CardTitle className="text-3xl">{stats.totalPrograms}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">All programs in database</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/admin/programs"
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold mb-1">Manage Programs</h3>
              <p className="text-sm text-gray-600">
                Add, edit, or deactivate funding programs
              </p>
            </a>
            <a
              href="/admin/users"
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">
                View and manage user accounts
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
