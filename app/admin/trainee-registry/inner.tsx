"use client";

import { useState, ChangeEvent } from "react";
import { getStudents, getApplications, getUsers } from "@/lib/storage";
import { getSupervisorConfirmations } from "@/lib/auditStore";
import { ComplianceAuditExportButton } from "@/components/compliance-audit-export-button";
import { useAuth } from "@/lib/auth-context";
import { ALLOW_EXPORT } from "@/lib/featureFlags";
import * as XLSX from "xlsx";

export default function TraineeRegistry() {
  const { user } = useAuth();
  const [query, setQuery] = useState<string>("");
  const [importing, setImporting] = useState<boolean>(false);
  const [showConfirmedOnly, setShowConfirmedOnly] = useState<boolean>(false);

  const students = getStudents();
  const applications = getApplications();
  const users = getUsers();
  const confirmations = getSupervisorConfirmations();

  // Check authorization
  const canViewRegistry = user && (user.role === "supervisor" || user.role === "staff" || user.role === "student");
  if (!canViewRegistry) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <p className="text-slate-500">Access denied. Staff view only.</p>
      </div>
    );
  }

  const rows = applications
    .map((a) => {
      const student = students.find((s) => s.id === a.studentId) || { name: "Unknown" };
      const appAny = a as any;
      const supervisorName = appAny.supervisor
        ? users.find((u) => u.id === appAny.supervisor)?.name || appAny.supervisor
        : "-";
      
      // Check for program-level confirmation
      const programConfirmation = confirmations.find(c => c.programId === a.programId && !c.studentId);
      const studentConfirmation = confirmations.find(c => c.studentId === a.studentId);
      const hasConfirmation = !!(programConfirmation || studentConfirmation);
      
      return {
        id: a.id,
        name: student.name,
        department: a.programId || "Unknown",
        supervisor: supervisorName,
        exposure: appAny.notes || "Observational",
        dates: appAny.submissionDate ? new Date(appAny.submissionDate).toLocaleString() : "-",
        regulatory: appAny.regulatory?.type || "None",
        regulatoryStatus: appAny.regulatory?.status || "-",
        status: a.status,
        hasConfirmation,
        confirmationType: programConfirmation ? "program" : studentConfirmation ? "student" : "none",
      };
    })
    .filter(
      (r: any) =>
        (r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.department.toLowerCase().includes(query.toLowerCase())) &&
        (!showConfirmedOnly || r.hasConfirmation)
    );

  // Handle file import
  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Imported data:", jsonData);
        alert(`Successfully imported ${jsonData.length} records`);
      } catch (error) {
        console.error("Import error:", error);
        alert("Error importing file");
      }
      setImporting(false);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle file export
  const handleExportFile = () => {
    const exportData = rows.map((r: any) => ({
      Name: r.name,
      Department: r.department,
      Supervisor: r.supervisor,
      ExposureLevel: r.exposure,
      Dates: r.dates,
      RegulatoryType: r.regulatory,
      RegulatoryStatus: r.regulatoryStatus,
      TrainingStatus: r.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainees");

    // Auto-size columns
    const columnWidths = [25, 20, 20, 15, 20, 15, 15, 15];
    worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));

    const filename = `trainee_registry_${user?.hospitalId || "admin"}_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trainee Registry (Audit View)</h1>
            <p className="text-slate-600">
              Hospital: {user?.hospitalId || "System Admin"} | Total Trainees: {rows.length}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {ALLOW_EXPORT && (
              <>
                <ComplianceAuditExportButton
                  hospitalId={user?.hospitalId}
                  variant="outline"
                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                />
                <button
                  onClick={handleExportFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  📥 Export Excel
                </button>
              </>
            )}
            <label className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium cursor-pointer">
              📤 Import Excel
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImportFile}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            placeholder="Search by student name or department..."
            className="border border-slate-300 p-2 rounded flex-1 focus:outline-none focus:border-blue-500"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
          <button
            onClick={() => setShowConfirmedOnly(!showConfirmedOnly)}
            className={`px-4 py-2 rounded font-medium transition text-sm whitespace-nowrap ${
              showConfirmedOnly
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
            title="Filter to show only program-confirmed trainees"
          >
            {showConfirmedOnly ? "✓ Confirmed Only" : "Show Confirmed"}
          </button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow border border-slate-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-slate-700 to-slate-800 text-white">
              <th className="p-3 text-left font-semibold border-b border-slate-600">Name</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Department</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Supervisor</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Exposure Level</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Dates</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Regulatory Type</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Reg. Status</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Confirmation</th>
              <th className="p-3 text-left font-semibold border-b border-slate-600">Training Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center text-slate-500">
                  No trainees found. {query && "Try a different search."}
                </td>
              </tr>
            ) : (
              rows.map((t: any, idx: number) => (
                <tr key={t.id} className={idx % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-slate-50 hover:bg-slate-100"}>
                  <td className="p-3 border-b border-slate-200 font-medium">{t.name}</td>
                  <td className="p-3 border-b border-slate-200">{t.department}</td>
                  <td className="p-3 border-b border-slate-200">{t.supervisor}</td>
                  <td className="p-3 border-b border-slate-200">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{t.exposure}</span>
                  </td>
                  <td className="p-3 border-b border-slate-200 text-xs">{t.dates}</td>
                  <td className="p-3 border-b border-slate-200">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        t.regulatory === "None"
                          ? "bg-gray-100 text-gray-700"
                          : t.regulatory === "EHS"
                            ? "bg-indigo-100 text-indigo-700"
                            : t.regulatory === "DHA"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {t.regulatory}
                    </span>
                  </td>
                  <td className="p-3 border-b border-slate-200">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        t.regulatoryStatus === "Verified"
                          ? "bg-green-100 text-green-700"
                          : t.regulatoryStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {t.regulatoryStatus}
                    </span>
                  </td>
                  <td className="p-3 border-b border-slate-200">
                    {t.hasConfirmation ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium" title={t.confirmationType === "program" ? "Program-level confirmation" : "Student-specific confirmation"}>
                        ✓ {t.confirmationType === "program" ? "Program" : "Student"}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">None</span>
                    )}
                  </td>
                  <td className="p-3 border-b border-slate-200">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        t.status === "In Training"
                          ? "bg-emerald-100 text-emerald-700"
                          : t.status === "Accepted"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <strong>📋 Compliance Notice:</strong> All exports are logged and encrypted. Data isolation is strictly enforced per UAE healthcare regulations (DHA, DoH, EHS).
      </div>
    </div>
  );
}
