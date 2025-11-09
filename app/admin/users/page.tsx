"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-gray-600">View and manage user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
          <CardDescription>Registered user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-2 font-semibold">Email</th>
                      <th className="pb-2 font-semibold">Role</th>
                      <th className="pb-2 font-semibold">Business</th>
                      <th className="pb-2 font-semibold">Subscription</th>
                      <th className="pb-2 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          {user.business ? (
                            <div>
                              <div className="font-medium">
                                {user.business.businessName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.business.industry}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">No profile</span>
                          )}
                        </td>
                        <td className="py-3">
                          {user.stripeCustomer?.subscriptions?.[0] ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {user.stripeCustomer.subscriptions[0].status}
                            </span>
                          ) : (
                            <span className="text-gray-400">Free</span>
                          )}
                        </td>
                        <td className="py-3 text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
