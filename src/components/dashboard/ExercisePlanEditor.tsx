"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  exercisePlansApi,
  type ExercisePlan,
  type DailyWorkout,
  type Exercise,
  type ExerciseCategory,
  type ExerciseIntensity,
  type UpdateExerciseRequest,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Heart,
  Wind,
  Flame,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
  Check,
  Calendar,
  Clock,
  Play,
} from "lucide-react";

const categoryIcons: Record<ExerciseCategory, React.ComponentType<{ className?: string }>> = {
  upper_body: Dumbbell,
  lower_body: Dumbbell,
  core: Flame,
  full_body: Dumbbell,
  cardio: Heart,
  stretching: Wind,
  breathing: Wind,
};

const categoryLabels: Record<ExerciseCategory, string> = {
  upper_body: "Upper Body",
  lower_body: "Lower Body",
  core: "Core",
  full_body: "Full Body",
  cardio: "Cardio",
  stretching: "Stretching",
  breathing: "Breathing",
};

const intensityColors: Record<ExerciseIntensity, { bg: string; text: string }> = {
  low: { bg: "bg-success-100", text: "text-success-700" },
  moderate: { bg: "bg-accent-100", text: "text-accent-700" },
  high: { bg: "bg-danger-100", text: "text-danger-700" },
};

interface ExerciseItemProps {
  exercise: Exercise;
  patientId: string;
  onUpdate: () => void;
}

function ExerciseItem({ exercise, patientId, onUpdate }: ExerciseItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateExerciseRequest>({
    name: exercise.name,
    category: exercise.category,
    intensity: exercise.intensity,
    duration_minutes: exercise.duration_minutes || undefined,
    sets: exercise.sets || undefined,
    reps: exercise.reps || undefined,
    rest_seconds: exercise.rest_seconds || undefined,
    instructions: exercise.instructions || "",
  });

  const Icon = categoryIcons[exercise.category] || Dumbbell;
  const intensityStyle = intensityColors[exercise.intensity];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await exercisePlansApi.updateExercise(patientId, exercise.id, formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update exercise:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-primary-50 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-primary-700">Edit Exercise</span>
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
          <div>
            <label className="text-xs text-gray-500">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as ExerciseCategory })
              }
              className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Intensity</label>
            <select
              value={formData.intensity}
              onChange={(e) =>
                setFormData({ ...formData, intensity: e.target.value as ExerciseIntensity })
              }
              className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Duration (min)</label>
            <Input
              type="number"
              value={formData.duration_minutes || ""}
              onChange={(e) =>
                setFormData({ ...formData, duration_minutes: Number(e.target.value) || undefined })
              }
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Rest (sec)</label>
            <Input
              type="number"
              value={formData.rest_seconds || ""}
              onChange={(e) =>
                setFormData({ ...formData, rest_seconds: Number(e.target.value) || undefined })
              }
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Sets</label>
            <Input
              type="number"
              value={formData.sets || ""}
              onChange={(e) =>
                setFormData({ ...formData, sets: Number(e.target.value) || undefined })
              }
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Reps</label>
            <Input
              type="number"
              value={formData.reps || ""}
              onChange={(e) =>
                setFormData({ ...formData, reps: Number(e.target.value) || undefined })
              }
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500">Instructions</label>
            <Input
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl flex items-start gap-3 group hover:bg-gray-100 transition-colors">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{exercise.name}</p>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
              intensityStyle.bg,
              intensityStyle.text
            )}
          >
            {exercise.intensity}
          </span>
          {exercise.is_completed && <Check className="w-4 h-4 text-success-500" />}
        </div>
        <p className="text-sm text-gray-500">{categoryLabels[exercise.category]}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          {exercise.duration_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {exercise.duration_minutes} min
            </span>
          )}
          {exercise.sets && exercise.reps && (
            <span>
              {exercise.sets} × {exercise.reps}
            </span>
          )}
          {exercise.rest_seconds && <span>Rest: {exercise.rest_seconds}s</span>}
          {exercise.calories_burned && <span>{exercise.calories_burned} cal</span>}
        </div>
        {exercise.instructions && (
          <p className="text-sm text-gray-600 mt-2 italic">{exercise.instructions}</p>
        )}
      </div>
      <div className="flex gap-1">
        {exercise.video_url && (
          <a
            href={exercise.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Play className="w-4 h-4 text-primary-500" />
          </a>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface ExercisePlanEditorProps {
  exercisePlan: ExercisePlan | null;
  patientId: string;
  onUpdate: () => void;
}

export function ExercisePlanEditor({
  exercisePlan,
  patientId,
  onUpdate,
}: ExercisePlanEditorProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(
    exercisePlan?.daily_workouts?.[0]?.id || null
  );

  if (!exercisePlan) {
    return (
      <Card className="p-6 text-center">
        <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">No active exercise plan</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              {exercisePlan.title || "Exercise Plan"}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(exercisePlan.start_date)} - {formatDate(exercisePlan.end_date)}
            </p>
          </div>
          {exercisePlan.is_active && (
            <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full font-medium">
              Active
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {exercisePlan.daily_workouts.map((day) => {
          const isExpanded = expandedDay === day.id;

          return (
            <div key={day.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-success-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Day {day.day_number} - {formatDate(day.workout_date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {day.exercises.length} exercises •{" "}
                      {day.total_duration_minutes || "—"} min •{" "}
                      <span className="capitalize">{day.workout_type.replace("_", " ")}</span>
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-3">
                  {day.exercises.map((exercise) => (
                    <ExerciseItem
                      key={exercise.id}
                      exercise={exercise}
                      patientId={patientId}
                      onUpdate={onUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
