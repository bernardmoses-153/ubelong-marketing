"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DriftRingBadge, DriftBadge } from "@/components/dashboard/DriftBadge";
import { patientsApi, type Patient, type PatientSummary } from "@/lib/api";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplet,
  FileText,
  ClipboardList,
  Utensils,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const [patientData, summaryData] = await Promise.all([
          patientsApi.get(patientId),
          patientsApi.getSummary(patientId).catch(() => null),
        ]);
        setPatient(patientData);
        setSummary(summaryData);
      } catch (err) {
        setError("Failed to load patient details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-danger-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {error || "Patient not found"}
          </h3>
          <Link href="/patients">
            <Button variant="secondary" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to patients
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const driftScore = patient.drift_score ?? Math.floor(Math.random() * 100);

  const quickLinks = [
    {
      href: `/patients/${patientId}/lab-reports`,
      label: "Lab Reports",
      icon: FileText,
      description: "View test results and trends",
      color: "primary",
    },
    {
      href: `/patients/${patientId}/soap-notes`,
      label: "SOAP Notes",
      icon: ClipboardList,
      description: "Clinical consultation notes",
      color: "purple",
    },
    {
      href: `/patients/${patientId}/care-plan`,
      label: "Care Plan",
      icon: Utensils,
      description: "Meals, medications, exercise",
      color: "success",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back Button */}
      <Link
        href="/patients"
        className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to patients
      </Link>

      {/* Patient Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            {patient.profile_image_name ? (
              <img
                src={patient.profile_image_name}
                alt={`${patient.first_name} ${patient.last_name}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.first_name} {patient.last_name}
              </h1>
              {patient.blood_group && (
                <span className="text-sm px-2 py-1 bg-danger-50 text-danger-600 rounded-lg font-medium flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5" />
                  {patient.blood_group}
                </span>
              )}
              <DriftBadge score={driftScore} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {patient.age} years, {patient.gender}
              </span>
              {patient.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {patient.city}
                </span>
              )}
            </div>
          </div>

          {/* Drift Score Ring */}
          <div className="flex flex-col items-center">
            <DriftRingBadge score={driftScore} size={80} strokeWidth={6} />
            <span className="text-sm text-gray-500 mt-2">Drift Score</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patient.phone && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            </div>
          )}
          {patient.email && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium truncate">{patient.email}</p>
              </div>
            </div>
          )}
          {patient.emergency_contact && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-danger-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Emergency Contact</p>
                <p className="font-medium">{patient.emergency_contact}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {summary.active_conditions_count}
            </p>
            <p className="text-sm text-gray-500">Active Conditions</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {summary.active_medications_count}
            </p>
            <p className="text-sm text-gray-500">Medications</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {summary.upcoming_appointments_count}
            </p>
            <p className="text-sm text-gray-500">Appointments</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {summary.has_health_profile ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-500">Health Profile</p>
          </Card>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="p-5 hover:shadow-lg transition-all hover:border-primary-200 cursor-pointer group h-full">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${link.color}-100`}
                >
                  <link.icon className={`w-6 h-6 text-${link.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {link.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors mt-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
