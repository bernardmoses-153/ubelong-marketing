"use client";

import { type LabTest, type LabFlag } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface LabReportTableProps {
  tests: LabTest[];
  showCategory?: boolean;
}

const flagColors: Record<LabFlag, { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  normal: { bg: "bg-success-50", text: "text-success-700", icon: CheckCircle },
  low: { bg: "bg-accent-50", text: "text-accent-700", icon: AlertTriangle },
  high: { bg: "bg-accent-50", text: "text-accent-700", icon: AlertTriangle },
  critical_low: { bg: "bg-danger-50", text: "text-danger-700", icon: AlertCircle },
  critical_high: { bg: "bg-danger-50", text: "text-danger-700", icon: AlertCircle },
};

const flagLabels: Record<LabFlag, string> = {
  normal: "Normal",
  low: "Low",
  high: "High",
  critical_low: "Critical Low",
  critical_high: "Critical High",
};

const categoryLabels: Record<string, string> = {
  hematology: "Hematology",
  biochemistry: "Biochemistry",
  immunology: "Immunology",
  microbiology: "Microbiology",
  endocrinology: "Endocrinology",
  lipid_profile: "Lipid Profile",
  liver_function: "Liver Function",
  kidney_function: "Kidney Function",
  thyroid_function: "Thyroid Function",
  urine_analysis: "Urine Analysis",
  other: "Other",
};

export function FlaggedValueBadge({ flag }: { flag: LabFlag | null }) {
  if (!flag || flag === "normal") return null;

  const { bg, text, icon: Icon } = flagColors[flag];

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", bg, text)}>
      <Icon className="w-3 h-3" />
      {flagLabels[flag]}
    </span>
  );
}

export function LabReportTable({ tests, showCategory = true }: LabReportTableProps) {
  if (tests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No test results available.
      </div>
    );
  }

  // Group by category if showing categories
  const groupedTests = showCategory
    ? tests.reduce((acc, test) => {
        const category = test.category || "other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(test);
        return acc;
      }, {} as Record<string, LabTest[]>)
    : { all: tests };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTests).map(([category, categoryTests]) => (
        <div key={category}>
          {showCategory && category !== "all" && (
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              {categoryLabels[category] || category}
            </h4>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Test Name
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Value
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Reference Range
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryTests.map((test) => {
                  const isAbnormal = test.flag && test.flag !== "normal";
                  return (
                    <tr
                      key={test.id}
                      className={cn(
                        "border-b border-gray-50 hover:bg-gray-50 transition-colors",
                        isAbnormal && "bg-amber-50/50"
                      )}
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">
                          {test.test_name}
                        </span>
                        {test.notes && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {test.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={cn(
                            "font-semibold",
                            isAbnormal ? "text-danger-600" : "text-gray-900"
                          )}
                        >
                          {test.value}
                        </span>
                        <span className="text-gray-500 ml-1">{test.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500">
                        {test.reference_min !== null && test.reference_max !== null
                          ? `${test.reference_min} - ${test.reference_max} ${test.unit}`
                          : test.reference_min !== null
                          ? `≥ ${test.reference_min} ${test.unit}`
                          : test.reference_max !== null
                          ? `≤ ${test.reference_max} ${test.unit}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {test.flag ? (
                          test.flag === "normal" ? (
                            <CheckCircle className="w-5 h-5 text-success-500 inline" />
                          ) : (
                            <FlaggedValueBadge flag={test.flag} />
                          )
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
