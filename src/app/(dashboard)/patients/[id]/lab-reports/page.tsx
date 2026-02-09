"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LabReportTable } from "@/components/dashboard/LabReportTable";
import { labReportsApi, patientsApi, type LabReport, type Patient } from "@/lib/api";
import {
  ArrowLeft,
  FileText,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";

export default function LabReportsPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, reportsData] = await Promise.all([
          patientsApi.get(patientId),
          labReportsApi.list(patientId, { limit: 50 }),
        ]);
        setPatient(patientData);
        setReports(reportsData);
        // Expand first report by default
        if (reportsData.length > 0) {
          setExpandedReports(new Set([reportsData[0].id]));
        }
      } catch (error) {
        console.error("Failed to fetch lab reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const toggleReport = (reportId: string) => {
    setExpandedReports((prev) => {
      const next = new Set(prev);
      if (next.has(reportId)) {
        next.delete(reportId);
      } else {
        next.add(reportId);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get unique categories from all reports
  const allCategories = Array.from(
    new Set(reports.flatMap((r) => r.tests.map((t) => t.category)))
  ).sort();

  // Filter reports by category if selected
  const filteredReports = categoryFilter === "all"
    ? reports
    : reports
        .map((r) => ({
          ...r,
          tests: r.tests.filter((t) => t.category === categoryFilter),
        }))
        .filter((r) => r.tests.length > 0);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="bg-white rounded-2xl p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Lab Reports
          </h1>
          <p className="text-gray-500 mt-1">
            {patient?.first_name} {patient?.last_name} • {reports.length} report
            {reports.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Category Filter */}
        {allCategories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No lab reports found
          </h3>
          <p className="text-gray-500">
            {categoryFilter !== "all"
              ? "No reports match the selected category."
              : "No lab reports have been uploaded for this patient."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isExpanded = expandedReports.has(report.id);
            const abnormalCount = report.tests.filter(
              (t) => t.flag && t.flag !== "normal"
            ).length;

            return (
              <Card key={report.id} className="overflow-hidden">
                <button
                  onClick={() => toggleReport(report.id)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {formatDate(report.report_date)}
                          </span>
                          {abnormalCount > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-accent-100 text-accent-700 rounded-full font-medium">
                              {abnormalCount} flagged
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          {report.lab_name && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              {report.lab_name}
                            </span>
                          )}
                          {report.ordering_doctor && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {report.ordering_doctor}
                            </span>
                          )}
                          <span>{report.tests.length} tests</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.file_url && (
                        <a
                          href={report.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          View PDF
                        </a>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4">
                    {report.summary && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <strong className="text-gray-900">Summary:</strong>{" "}
                        {report.summary}
                      </div>
                    )}
                    <LabReportTable tests={report.tests} showCategory />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
