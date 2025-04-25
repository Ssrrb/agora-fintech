"use client";

import { Header } from "@/components/header";
import { UserButton } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Activity, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      {/* Top navigation */}
      <Header />

      {/* Main content wrapper */}
      <div className="container mx-auto px-4 py-10">
        {/* Page title + profile button */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Stat cards */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-6 flex items-center">
              <DollarSign className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold">$123,400</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-6 flex items-center">
              <Activity className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold">1,230</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-6 flex items-center">
              <Users className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm text-gray-500">New Sign‑ups</p>
                <p className="text-2xl font-bold">99</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
