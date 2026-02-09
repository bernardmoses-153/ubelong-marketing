"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MealPlanEditor } from "@/components/dashboard/MealPlanEditor";
import { MedicationEditor } from "@/components/dashboard/MedicationEditor";
import { ExercisePlanEditor } from "@/components/dashboard/ExercisePlanEditor";
import {
  patientsApi,
  mealPlansApi,
  medicationsApi,
  exercisePlansApi,
  type Patient,
  type MealPlan,
  type Medication,
  type ExercisePlan,
} from "@/lib/api";
import { ArrowLeft, Utensils, Pill, Dumbbell, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "meals" | "medications" | "exercise";

const tabs: { key: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "meals", label: "Meal Plan", icon: Utensils },
  { key: "medications", label: "Medications", icon: Pill },
  { key: "exercise", label: "Exercise", icon: Dumbbell },
];

export default function CarePlanPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [exercisePlan, setExercisePlan] = useState<ExercisePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("meals");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [patientData, mealPlanData, medicationsData, exercisePlanData] = await Promise.all([
        patientsApi.get(patientId),
        mealPlansApi.getCurrent(patientId).catch(() => null),
        medicationsApi.list(patientId, { limit: 100 }),
        exercisePlansApi.getCurrent(patientId).catch(() => null),
      ]);
      setPatient(patientData);
      setMealPlan(mealPlanData);
      setMedications(medicationsData);
      setExercisePlan(exercisePlanData);
    } catch (error) {
      console.error("Failed to fetch care plan:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-full max-w-md" />
          <div className="bg-white rounded-2xl p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back Button */}
      <Link
        href={`/patients/${patientId}`}
        className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to {patient?.first_name} {patient?.last_name}
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Care Plan</h1>
          <p className="text-gray-500 mt-1">
            {patient?.first_name} {patient?.last_name}
          </p>
        </div>
        <Button variant="secondary" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.key
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.key === "medications" && medications.length > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-xs rounded-full",
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {medications.filter((m) => m.is_active).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "meals" && (
          <MealPlanEditor
            mealPlan={mealPlan}
            patientId={patientId}
            onUpdate={fetchData}
          />
        )}
        {activeTab === "medications" && (
          <MedicationEditor
            medications={medications}
            patientId={patientId}
            onUpdate={fetchData}
          />
        )}
        {activeTab === "exercise" && (
          <ExercisePlanEditor
            exercisePlan={exercisePlan}
            patientId={patientId}
            onUpdate={fetchData}
          />
        )}
      </div>
    </div>
  );
}
