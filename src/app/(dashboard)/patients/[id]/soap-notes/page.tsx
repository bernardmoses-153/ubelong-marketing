"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SOAPNoteCard } from "@/components/dashboard/SOAPNoteCard";
import { SOAPNoteForm } from "@/components/dashboard/SOAPNoteForm";
import { soapNotesApi, patientsApi, type SOAPNote, type Patient } from "@/lib/api";
import { ArrowLeft, Plus, ClipboardList } from "lucide-react";

export default function SOAPNotesPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<SOAPNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const [patientData, notesData] = await Promise.all([
        patientsApi.get(patientId),
        soapNotesApi.list(patientId, { limit: 50 }),
      ]);
      setPatient(patientData);
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to fetch SOAP notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const handleNoteCreated = () => {
    setShowForm(false);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            SOAP Notes
          </h1>
          <p className="text-gray-500 mt-1">
            {patient?.first_name} {patient?.last_name} • {notes.length} note
            {notes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New SOAP Note
          </Button>
        )}
      </div>

      {/* New Note Form */}
      {showForm && (
        <SOAPNoteForm
          patientId={patientId}
          onSuccess={handleNoteCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Notes List */}
      {notes.length === 0 && !showForm ? (
        <Card className="p-8 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No SOAP notes yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first clinical note for this patient.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New SOAP Note
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note, index) => (
            <SOAPNoteCard
              key={note.id}
              note={note}
              defaultExpanded={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
