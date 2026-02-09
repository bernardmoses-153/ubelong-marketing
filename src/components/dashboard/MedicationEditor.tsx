"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  medicationsApi,
  type Medication,
  type MedicationFrequency,
  type UpdateMedicationRequest,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Pill, Edit2, Save, X, Clock, User, Calendar, Check } from "lucide-react";

const frequencyLabels: Record<MedicationFrequency, string> = {
  once_daily: "Once daily",
  twice_daily: "Twice daily",
  thrice_daily: "Three times daily",
  four_times_daily: "Four times daily",
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
  as_needed: "As needed",
};

interface MedicationItemProps {
  medication: Medication;
  patientId: string;
  onUpdate: () => void;
}

function MedicationItem({ medication, patientId, onUpdate }: MedicationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateMedicationRequest>({
    name: medication.name,
    generic_name: medication.generic_name || "",
    dosage: medication.dosage,
    frequency: medication.frequency,
    instructions: medication.instructions || "",
    side_effects: medication.side_effects || "",
    is_active: medication.is_active,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await medicationsApi.update(patientId, medication.id, formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update medication:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-primary-50 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-primary-700">Edit Medication</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <span className="animate-spin">...</span> : <Save className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-500">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500">Generic Name</label>
            <Input
              value={formData.generic_name}
              onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Dosage</label>
            <Input
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value as MedicationFrequency })
              }
              className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {Object.entries(frequencyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500">Instructions</label>
            <Input
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g., Take with food"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500">Side Effects to Watch</label>
            <Input
              value={formData.side_effects}
              onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id={`active-${medication.id}`}
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor={`active-${medication.id}`} className="text-sm text-gray-700">
              Active medication
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 rounded-xl flex items-start gap-3 group hover:bg-gray-100 transition-colors",
        medication.is_active ? "bg-gray-50" : "bg-gray-50/50 opacity-60"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
          medication.is_active ? "bg-primary-100" : "bg-gray-200"
        )}
      >
        <Pill
          className={cn("w-5 h-5", medication.is_active ? "text-primary-500" : "text-gray-400")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{medication.name}</p>
          {!medication.is_active && (
            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
              Inactive
            </span>
          )}
        </div>
        {medication.generic_name && (
          <p className="text-sm text-gray-500">{medication.generic_name}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <strong>{medication.dosage}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {frequencyLabels[medication.frequency]}
          </span>
        </div>
        {medication.instructions && (
          <p className="text-sm text-gray-600 mt-2 italic">{medication.instructions}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
          {medication.prescribing_doctor && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {medication.prescribing_doctor}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Started {formatDate(medication.start_date)}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface MedicationEditorProps {
  medications: Medication[];
  patientId: string;
  onUpdate: () => void;
}

export function MedicationEditor({ medications, patientId, onUpdate }: MedicationEditorProps) {
  if (medications.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">No medications prescribed</p>
      </Card>
    );
  }

  const activeMeds = medications.filter((m) => m.is_active);
  const inactiveMeds = medications.filter((m) => !m.is_active);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Medications
        </CardTitle>
        <p className="text-sm text-gray-500">
          {activeMeds.length} active, {inactiveMeds.length} inactive
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeMeds.map((medication) => (
          <MedicationItem
            key={medication.id}
            medication={medication}
            patientId={patientId}
            onUpdate={onUpdate}
          />
        ))}
        {inactiveMeds.length > 0 && (
          <>
            <div className="border-t border-gray-100 pt-3 mt-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Inactive Medications
              </p>
            </div>
            {inactiveMeds.map((medication) => (
              <MedicationItem
                key={medication.id}
                medication={medication}
                patientId={patientId}
                onUpdate={onUpdate}
              />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
