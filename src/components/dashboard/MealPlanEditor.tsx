"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  mealPlansApi,
  type MealPlan,
  type DailyMealPlan,
  type Meal,
  type MealType,
  type UpdateMealRequest,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Coffee,
  Sun,
  Utensils,
  Cookie,
  Moon,
  Star,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
  Check,
  Calendar,
} from "lucide-react";

const mealTypeIcons: Record<MealType, React.ComponentType<{ className?: string }>> = {
  breakfast: Coffee,
  morning_snack: Cookie,
  lunch: Sun,
  afternoon_snack: Cookie,
  dinner: Moon,
  evening_snack: Star,
};

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Breakfast",
  morning_snack: "Morning Snack",
  lunch: "Lunch",
  afternoon_snack: "Afternoon Snack",
  dinner: "Dinner",
  evening_snack: "Evening Snack",
};

interface MealEditorProps {
  meal: Meal;
  patientId: string;
  planId: string;
  onUpdate: () => void;
}

function MealEditor({ meal, patientId, planId, onUpdate }: MealEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateMealRequest>({
    name: meal.name,
    description: meal.description || "",
    calories: meal.calories || undefined,
    protein_g: meal.protein_g || undefined,
    carbs_g: meal.carbs_g || undefined,
    fat_g: meal.fat_g || undefined,
    health_notes: meal.health_notes || "",
  });

  const Icon = mealTypeIcons[meal.meal_type] || Utensils;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await mealPlansApi.updateMeal(patientId, planId, meal.id, formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update meal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-primary-50 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-primary-700">
            Edit {mealTypeLabels[meal.meal_type]}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <span className="animate-spin">...</span>
              ) : (
                <Save className="w-4 h-4" />
              )}
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
            <label className="text-xs text-gray-500">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Calories</label>
            <Input
              type="number"
              value={formData.calories || ""}
              onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) || undefined })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Protein (g)</label>
            <Input
              type="number"
              value={formData.protein_g || ""}
              onChange={(e) => setFormData({ ...formData, protein_g: Number(e.target.value) || undefined })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Carbs (g)</label>
            <Input
              type="number"
              value={formData.carbs_g || ""}
              onChange={(e) => setFormData({ ...formData, carbs_g: Number(e.target.value) || undefined })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Fat (g)</label>
            <Input
              type="number"
              value={formData.fat_g || ""}
              onChange={(e) => setFormData({ ...formData, fat_g: Number(e.target.value) || undefined })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500">Health Notes</label>
            <Input
              value={formData.health_notes}
              onChange={(e) => setFormData({ ...formData, health_notes: e.target.value })}
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
          <span className="text-xs font-medium text-gray-500 uppercase">
            {mealTypeLabels[meal.meal_type]}
          </span>
          {meal.is_completed && (
            <Check className="w-4 h-4 text-success-500" />
          )}
        </div>
        <p className="font-medium text-gray-900">{meal.name}</p>
        {meal.description && (
          <p className="text-sm text-gray-500 mt-0.5">{meal.description}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          {meal.calories && <span>{meal.calories} cal</span>}
          {meal.protein_g && <span>P: {meal.protein_g}g</span>}
          {meal.carbs_g && <span>C: {meal.carbs_g}g</span>}
          {meal.fat_g && <span>F: {meal.fat_g}g</span>}
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

interface MealPlanEditorProps {
  mealPlan: MealPlan | null;
  patientId: string;
  onUpdate: () => void;
}

export function MealPlanEditor({ mealPlan, patientId, onUpdate }: MealPlanEditorProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(
    mealPlan?.daily_plans?.[0]?.id || null
  );

  if (!mealPlan) {
    return (
      <Card className="p-6 text-center">
        <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">No active meal plan</p>
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
            <CardTitle>{mealPlan.title || "Meal Plan"}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(mealPlan.start_date)} - {formatDate(mealPlan.end_date)}
            </p>
          </div>
          {mealPlan.is_active && (
            <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full font-medium">
              Active
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mealPlan.daily_plans.map((day) => {
          const isExpanded = expandedDay === day.id;

          return (
            <div key={day.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Day {day.day_number} - {formatDate(day.plan_date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {day.meals.length} meals • {day.total_calories || "—"} cal
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
                  {day.meals.map((meal) => (
                    <MealEditor
                      key={meal.id}
                      meal={meal}
                      patientId={patientId}
                      planId={mealPlan.id}
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
