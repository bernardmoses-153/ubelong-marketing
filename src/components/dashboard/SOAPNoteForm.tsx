"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { soapNotesApi, type CreateSOAPNoteRequest } from "@/lib/api";
import { AlertCircle, Save, X } from "lucide-react";

const soapNoteSchema = z.object({
  encounter_date: z.string().min(1, "Encounter date is required"),
  subjective: z.string().min(1, "Subjective section is required"),
  objective: z.string().min(1, "Objective section is required"),
  assessment: z.string().min(1, "Assessment section is required"),
  plan: z.string().min(1, "Plan section is required"),
});

type SOAPNoteFormData = z.infer<typeof soapNoteSchema>;

interface SOAPNoteFormProps {
  patientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SOAPNoteForm({ patientId, onSuccess, onCancel }: SOAPNoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SOAPNoteFormData>({
    resolver: zodResolver(soapNoteSchema),
    defaultValues: {
      encounter_date: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = async (data: SOAPNoteFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await soapNotesApi.create(patientId, {
        ...data,
        encounter_date: new Date(data.encounter_date).toISOString(),
      });
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create SOAP note";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    {
      key: "subjective" as const,
      label: "Subjective",
      placeholder: "Patient's reported symptoms, concerns, history, and chief complaint...",
      description: "What the patient tells you",
    },
    {
      key: "objective" as const,
      label: "Objective",
      placeholder: "Vital signs, physical examination findings, lab results, imaging...",
      description: "What you observe or measure",
    },
    {
      key: "assessment" as const,
      label: "Assessment",
      placeholder: "Diagnosis, differential diagnoses, clinical impression...",
      description: "Your clinical conclusion",
    },
    {
      key: "plan" as const,
      label: "Plan",
      placeholder: "Treatment plan, medications, referrals, follow-up instructions...",
      description: "Next steps for care",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New SOAP Note</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          {/* Encounter Date */}
          <div className="space-y-2">
            <label htmlFor="encounter_date" className="text-sm font-medium text-gray-700">
              Encounter Date & Time
            </label>
            <input
              type="datetime-local"
              id="encounter_date"
              {...register("encounter_date")}
              className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            {errors.encounter_date && (
              <p className="text-sm text-danger-500">{errors.encounter_date.message}</p>
            )}
          </div>

          {/* SOAP Sections */}
          {sections.map((section) => (
            <div key={section.key} className="space-y-2">
              <label htmlFor={section.key} className="text-sm font-medium text-gray-700">
                {section.label}
                <span className="text-gray-400 font-normal ml-2">
                  ({section.description})
                </span>
              </label>
              <textarea
                id={section.key}
                {...register(section.key)}
                placeholder={section.placeholder}
                rows={4}
                className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
              {errors[section.key] && (
                <p className="text-sm text-danger-500">{errors[section.key]?.message}</p>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Note
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
