"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/admin/programs");
        if (res.ok) {
          const data = await res.json();
          setPrograms(data.programs || []);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleToggleActive = async (programId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/programs/${programId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === programId ? { ...p, isActive: !isActive } : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling program:", error);
    }
  };

  if (isLoading) {
    return <div>Loading programs...</div>;
  }

  const filteredPrograms =
    filter === "all"
      ? programs
      : filter === "active"
      ? programs.filter((p) => p.isActive)
      : programs.filter((p) => !p.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Programs</h1>
          <p className="text-gray-600">Add and manage funding programs</p>
        </div>
        <Button>Add New Program</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({programs.length})
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
        >
          Active ({programs.filter((p) => p.isActive).length})
        </Button>
        <Button
          variant={filter === "inactive" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("inactive")}
        >
          Inactive ({programs.filter((p) => !p.isActive).length})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredPrograms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No programs found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPrograms.map((program) => (
            <Card key={program.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{program.name}</CardTitle>
                    <CardDescription>{program.provider}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        program.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {program.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {program.type}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">{program.description}</p>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Amount Range:</span>
                      <br />${program.minAmount.toLocaleString()} - $
                      {program.maxAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold">Industries:</span>
                      <br />
                      {program.industries.join(", ")}
                    </div>
                    <div>
                      <span className="font-semibold">Location:</span>
                      <br />
                      {program.location || "N/A"}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant={program.isActive ? "outline" : "default"}
                      onClick={() =>
                        handleToggleActive(program.id, program.isActive)
                      }
                    >
                      {program.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
