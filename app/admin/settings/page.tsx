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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Settings {
  appUrl: string;
  stripeSuccessUrl: string;
  stripeCancelUrl: string;
  stripeBillingReturnUrl: string;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    appUrl: "",
    stripeSuccessUrl: "",
    stripeCancelUrl: "",
    stripeBillingReturnUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.error || "Failed to save settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving settings" });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Settings</h1>
        <p className="text-gray-600">Configure application URLs and Stripe redirect URLs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application URLs</CardTitle>
          <CardDescription>
            Configure URLs for the application and payment flows. Leave blank to use environment variables or defaults.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appUrl">Application URL</Label>
              <Input
                id="appUrl"
                type="url"
                placeholder="http://localhost:3000 or https://yourdomain.com"
                value={settings.appUrl}
                onChange={(e) => setSettings({ ...settings, appUrl: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Base URL of your application (e.g., http://localhost:3000)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripeSuccessUrl">Stripe Success URL</Label>
              <Input
                id="stripeSuccessUrl"
                type="url"
                placeholder="https://yourdomain.com/checkout/success?session_id={CHECKOUT_SESSION_ID}"
                value={settings.stripeSuccessUrl}
                onChange={(e) => setSettings({ ...settings, stripeSuccessUrl: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Redirect URL after successful payment (use {"{CHECKOUT_SESSION_ID}"} placeholder)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripeCancelUrl">Stripe Cancel URL</Label>
              <Input
                id="stripeCancelUrl"
                type="url"
                placeholder="https://yourdomain.com/checkout/cancel"
                value={settings.stripeCancelUrl}
                onChange={(e) => setSettings({ ...settings, stripeCancelUrl: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Redirect URL when payment is cancelled
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripeBillingReturnUrl">Stripe Billing Portal Return URL</Label>
              <Input
                id="stripeBillingReturnUrl"
                type="url"
                placeholder="https://yourdomain.com/dashboard/billing"
                value={settings.stripeBillingReturnUrl}
                onChange={(e) => setSettings({ ...settings, stripeBillingReturnUrl: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Return URL from Stripe billing portal
              </p>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSettings({
                    appUrl: "",
                    stripeSuccessUrl: "",
                    stripeCancelUrl: "",
                    stripeBillingReturnUrl: "",
                  });
                }}
              >
                Clear All
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Values</CardTitle>
          <CardDescription>
            These are the default values used when settings are not configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">App URL:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
            </div>
            <div>
              <span className="font-semibold">Success URL:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {"{appUrl}"}/checkout/success?session_id={"{CHECKOUT_SESSION_ID}"}
              </code>
            </div>
            <div>
              <span className="font-semibold">Cancel URL:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{"{appUrl}"}/checkout/cancel</code>
            </div>
            <div>
              <span className="font-semibold">Billing Return URL:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{"{appUrl}"}/dashboard/billing</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
