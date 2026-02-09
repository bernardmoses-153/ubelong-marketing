"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DriftRingBadge } from "./DriftBadge";
import { type Patient } from "@/lib/api";
import { User, Phone, MapPin, Calendar, ChevronRight } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const driftScore = patient.drift_score ?? Math.floor(Math.random() * 100); // TODO: Use real drift score

  return (
    <Link href={`/dashboard/patients/${patient.id}`}>
      <Card className="p-4 hover:shadow-lg transition-all hover:border-primary-200 cursor-pointer group">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            {patient.profile_image_name ? (
              <img
                src={patient.profile_image_name}
                alt={`${patient.first_name} ${patient.last_name}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {patient.first_name} {patient.last_name}
              </h3>
              {patient.blood_group && (
                <span className="text-xs px-1.5 py-0.5 bg-danger-50 text-danger-600 rounded font-medium">
                  {patient.blood_group}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {patient.age}y, {patient.gender}
              </span>
              {patient.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {patient.city}
                </span>
              )}
            </div>
          </div>

          {/* Drift Score */}
          <DriftRingBadge score={driftScore} size={48} strokeWidth={4} />

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
        </div>

        {/* Contact */}
        {patient.phone && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
            <Phone className="w-4 h-4" />
            <span>{patient.phone}</span>
          </div>
        )}
      </Card>
    </Link>
  );
}
