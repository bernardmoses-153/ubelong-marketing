"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { type SOAPNote } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Bot,
  CheckCircle,
} from "lucide-react";

interface SOAPNoteCardProps {
  note: SOAPNote;
  defaultExpanded?: boolean;
}

export function SOAPNoteCard({ note, defaultExpanded = false }: SOAPNoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sections = [
    { key: "subjective", label: "Subjective", description: "Patient's reported symptoms, concerns, and history" },
    { key: "objective", label: "Objective", description: "Clinician observations and measurements" },
    { key: "assessment", label: "Assessment", description: "Diagnosis or clinical impression" },
    { key: "plan", label: "Plan", description: "Treatment plan and next steps" },
  ] as const;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                note.is_ai_generated ? "bg-purple-100" : "bg-primary-100"
              )}
            >
              {note.is_ai_generated ? (
                <Bot className="w-6 h-6 text-purple-600" />
              ) : (
                <User className="w-6 h-6 text-primary-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {formatDate(note.encounter_date)}
                </span>
                {note.is_ai_generated && (
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                    AI Generated
                  </span>
                )}
                {note.reviewed_at && (
                  <span className="text-xs px-2 py-0.5 bg-success-100 text-success-700 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Reviewed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                {note.author_name && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {note.author_name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {formatDate(note.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {sections.map((section) => (
            <div key={section.key} className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {section.label}
              </h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {note[section.key] || (
                  <span className="text-gray-400 italic">Not documented</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
