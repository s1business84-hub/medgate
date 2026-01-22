"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Download, X } from "lucide-react";
import { showToast } from "@/lib/toast";

// Import storage functions
import {
  getApplications,
  getStudents,
  getDocuments,
  getPayments,
} from "@/lib/storage";

import {
  getExposureLogs,
  getSupervisorConfirmations,
  getCompletionAttestations,
  getIncidentFlags,
  getEhsConfirmations,
} from "@/lib/auditStore";

export type AuditDataType =
  | "applications"
  | "students"
  | "documents"
  | "payments"
  | "exposureLogs"
  | "supervisorConfirmations"
  | "completionAttestations"
  | "incidentFlags"
  | "ehsConfirmations"
  | "all";

interface AuditExcelButtonProps {
  /** Which data types to include in export/import */
  dataTypes?: AuditDataType[];
  /** Filter function for applications (e.g., by hospital or student) */
  filterApplications?: (apps: any[]) => any[];
  /** Filter function for students */
  filterStudents?: (students: any[]) => any[];
  /** Callback when data is imported */
  onImport?: (data: Record<string, any[]>) => void;
  /** Custom class name */
  className?: string;
  /** Button variant */
  variant?: "default" | "outline" | "ghost";
  /** Button size */
  size?: "default" | "sm" | "lg";
}

export function AuditExcelButton({
  dataTypes = ["all"],
  filterApplications,
  filterStudents,
  onImport,
  className = "",
  variant = "outline",
  size = "default",
}: AuditExcelButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shouldInclude = (type: AuditDataType) =>
    dataTypes.includes("all") || dataTypes.includes(type);

  const collectAuditData = () => {
    const data: Record<string, any[]> = {};

    if (shouldInclude("applications")) {
      let apps = getApplications();
      if (filterApplications) apps = filterApplications(apps);
      data.applications = apps;
    }

    if (shouldInclude("students")) {
      let students = getStudents();
      if (filterStudents) students = filterStudents(students);
      data.students = students;
    }

    if (shouldInclude("documents")) {
      data.documents = getDocuments();
    }

    if (shouldInclude("payments")) {
      data.payments = getPayments();
    }

    if (shouldInclude("exposureLogs")) {
      data.exposureLogs = getExposureLogs();
    }

    if (shouldInclude("supervisorConfirmations")) {
      data.supervisorConfirmations = getSupervisorConfirmations();
    }

    if (shouldInclude("completionAttestations")) {
      data.completionAttestations = getCompletionAttestations();
    }

    if (shouldInclude("incidentFlags")) {
      data.incidentFlags = getIncidentFlags();
    }

    if (shouldInclude("ehsConfirmations")) {
      data.ehsConfirmations = getEhsConfirmations();
    }

    return data;
  };

  const handleExport = () => {
    setExporting(true);
    try {
      const data = collectAuditData();
      const workbook = XLSX.utils.book_new();

      // Create a sheet for each data type
      Object.entries(data).forEach(([sheetName, records]) => {
        if (records.length > 0) {
          // Flatten nested objects for Excel compatibility
          const flattenedRecords = records.map((record) => {
            const flat: Record<string, any> = {};
            Object.entries(record).forEach(([key, value]) => {
              if (typeof value === "object" && value !== null) {
                // Flatten nested objects
                Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                  flat[`${key}_${nestedKey}`] = nestedValue;
                });
              } else {
                flat[key] = value;
              }
            });
            return flat;
          });

          const worksheet = XLSX.utils.json_to_sheet(flattenedRecords);

          // Auto-size columns
          const maxWidth = 50;
          const colWidths: { wch: number }[] = [];
          if (flattenedRecords.length > 0) {
            Object.keys(flattenedRecords[0]).forEach((key, idx) => {
              let maxLen = key.length;
              flattenedRecords.forEach((row) => {
                const cellValue = String(row[key] || "");
                maxLen = Math.max(maxLen, cellValue.length);
              });
              colWidths[idx] = { wch: Math.min(maxLen + 2, maxWidth) };
            });
            worksheet["!cols"] = colWidths;
          }

          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31)); // Excel sheet name limit
        }
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `audit_export_${timestamp}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);
      showToast(`Exported audit data to ${filename}`);
    } catch (error) {
      console.error("Export error:", error);
      showToast("Failed to export audit data");
    } finally {
      setExporting(false);
      setIsOpen(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const importedData: Record<string, any[]> = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Unflatten nested objects (reverse the export flattening)
        const unflattenedData = jsonData.map((row: any) => {
          const unflattened: Record<string, any> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (key.includes("_")) {
              const parts = key.split("_");
              const parentKey = parts[0];
              const childKey = parts.slice(1).join("_");
              if (!unflattened[parentKey]) {
                unflattened[parentKey] = {};
              }
              unflattened[parentKey][childKey] = value;
            } else {
              unflattened[key] = value;
            }
          });
          return unflattened;
        });

        importedData[sheetName] = unflattenedData;
      });

      // Call the onImport callback with the imported data
      if (onImport) {
        onImport(importedData);
        showToast(`Imported data from ${file.name}`);
      } else {
        // Default behavior: log to console and show summary
        console.log("Imported audit data:", importedData);
        const summary = Object.entries(importedData)
          .map(([name, records]) => `${name}: ${records.length} records`)
          .join(", ");
        showToast(`Imported: ${summary}`);
      }
    } catch (error) {
      console.error("Import error:", error);
      showToast("Failed to import file. Please ensure it's a valid Excel file.");
    } finally {
      setImporting(false);
      setIsOpen(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        className={`gap-2 ${className}`}
      >
        <FileSpreadsheet className="w-4 h-4" />
        Audit
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium text-slate-200">Audit Actions</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-2 space-y-1">
              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-medium">Export to Excel</div>
                  <div className="text-xs text-slate-400">Download audit data</div>
                </div>
              </button>

              {/* Import Button */}
              <button
                onClick={handleImportClick}
                disabled={importing}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-medium">Import from Excel</div>
                  <div className="text-xs text-slate-400">Upload audit data</div>
                </div>
              </button>
            </div>

            <div className="p-2 border-t border-white/10">
              <p className="px-2 text-xs text-slate-400">
                Exports/imports applications, students, logs, and confirmations.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default AuditExcelButton;
