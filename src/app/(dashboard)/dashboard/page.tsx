"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DriftBadge } from "@/components/dashboard/DriftBadge";
import { patientsApi, type Patient } from "@/lib/api";
import { getFullName } from "@/lib/auth";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Activity,
  ChevronRight,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientsApi.list({ limit: 10 });
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Calculate stats
  const totalPatients = patients.length;
  const patientsWithDrift = patients.filter((p) => (p.drift_score ?? 0) < 60).length;
  const criticalPatients = patients.filter((p) => (p.drift_score ?? 0) < 40).length;
  const averageDrift = patients.length
    ? Math.round(patients.reduce((acc, p) => acc + (p.drift_score ?? 50), 0) / patients.length)
    : 0;

  const stats = [
    {
      label: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "primary",
      href: "/patients",
    },
    {
      label: "Needs Attention",
      value: patientsWithDrift,
      icon: AlertTriangle,
      color: "accent",
      href: "/patients?filter=drift",
    },
    {
      label: "Critical",
      value: criticalPatients,
      icon: Activity,
      color: "danger",
      href: "/patients?filter=critical",
    },
    {
      label: "Avg Drift Score",
      value: averageDrift,
      icon: TrendingUp,
      color: "success",
      href: "/patients",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Welcome back, Dr. {user?.last_name || getFullName(user)}
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your patients today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-4 hover:shadow-lg transition-all hover:border-primary-200 cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-100`}
                >
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Patients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Patients</CardTitle>
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No patients assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patients.slice(0, 5).map((patient) => (
                <Link
                  key={patient.id}
                  href={`/patients/${patient.id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {patient.age}y, {patient.gender} • {patient.city}
                    </p>
                  </div>
                  <DriftBadge
                    score={patient.drift_score ?? Math.floor(Math.random() * 100)}
                    size="sm"
                    showLabel={false}
                  />
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/patients">
              <Button variant="secondary" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                View All Patients
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-0">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Contact support for any questions about the portal.
          </p>
          <Button variant="secondary" size="sm">
            Contact Support
          </Button>
        </Card>
      </div>
    </div>
  );
}
