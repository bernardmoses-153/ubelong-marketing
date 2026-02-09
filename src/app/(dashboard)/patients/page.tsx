"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { patientsApi, type Patient } from "@/lib/api";
import { Search, Users, Filter, X } from "lucide-react";

type FilterType = "all" | "drift" | "critical" | "on-track";

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All Patients" },
  { value: "critical", label: "Critical (< 40)" },
  { value: "drift", label: "Drifting (< 60)" },
  { value: "on-track", label: "On Track (≥ 80)" },
];

export default function PatientsPage() {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") as FilterType) || "all";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientsApi.list({ limit: 100 });
        // Add mock drift scores for demo
        const patientsWithDrift = data.map((p) => ({
          ...p,
          drift_score: p.drift_score ?? Math.floor(Math.random() * 100),
        }));
        setPatients(patientsWithDrift);
        setFilteredPatients(patientsWithDrift);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = patients;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.first_name.toLowerCase().includes(query) ||
          p.last_name.toLowerCase().includes(query) ||
          p.phone?.includes(query) ||
          p.city?.toLowerCase().includes(query)
      );
    }

    // Apply drift filter
    if (filter !== "all") {
      result = result.filter((p) => {
        const score = p.drift_score ?? 50;
        switch (filter) {
          case "critical":
            return score < 40;
          case "drift":
            return score < 60;
          case "on-track":
            return score >= 80;
          default:
            return true;
        }
      });
    }

    setFilteredPatients(result);
  }, [patients, searchQuery, filter]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Patients
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search patients by name, phone, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className="whitespace-nowrap"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 animate-pulse border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No patients found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery || filter !== "all"
              ? "Try adjusting your search or filters."
              : "No patients have been assigned to you yet."}
          </p>
          {(searchQuery || filter !== "all") && (
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}
