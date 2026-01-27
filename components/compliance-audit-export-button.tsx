/**
 * COMPLIANCE-ENFORCED AUDIT BUTTON
 * 
 * This component replaces the basic AuditExcelButton with strict compliance enforcement:
 * - All hospital data is isolated (no cross-hospital leakage)
 * - All regulatory data is compartmentalized (EHS, DHA, DoH separate)
 * - All student data is private (students only see their own)
 * - All exports are logged for compliance audits
 * - UAE healthcare regulations strictly enforced
 */

"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, X } from "lucide-react";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth-context";
import {
  AuditAccessControl,
  ComplianceAuditExport,
  AuditCompliance,
  HospitalDataIsolation,
  StudentDataPrivacy,
  RegulatoryDataIsolation,
} from "@/lib/auditCompliance";

interface ComplianceAuditExportButtonProps {
  /** Hospital ID (required for hospital users) */
  hospitalId?: string;
  /** Custom class name */
  className?: string;
  /** Button variant */
  variant?: "default" | "outline" | "ghost";
  /** Button size */
  size?: "default" | "sm" | "lg";
}

export function ComplianceAuditExportButton({
  hospitalId,
  className = "",
  variant = "outline",
  size = "default",
}: ComplianceAuditExportButtonProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authorization
  if (!AuditAccessControl.canUserExportAudit(user)) {
    return null; // Not authorized
  }

  const handleExport = async () => {
    setExporting(true);
    try {
      // CRITICAL: Verify authorization
      let exportData: Record<string, any> = {};
      let exportType = "unknown";

      if (user?.role === "student") {
        // Student can only export their own data
        exportData = StudentDataPrivacy.getStudentAuditData(user.id);
        exportType = "student_self";
      } else if (user?.role === "supervisor" || user?.role === "staff") {
        // Staff user must have hospitalId
        const userHospitalId = AuditAccessControl.getUserHospitalId(user);
        if (!userHospitalId) {
          showToast("Error: No hospital assignment found");
          return;
        }

        if (!AuditAccessControl.isHospitalAdmin(user, userHospitalId)) {
          showToast("Error: Unauthorized hospital access");
          return;
        }

        // STRICT ISOLATION: Export only this hospital's data
        exportData = ComplianceAuditExport.buildHospitalExport(userHospitalId);
        exportType = "hospital_full";
      } else {
        showToast("Error: Unauthorized export");
        AuditCompliance.logAccessDenied(user?.id || "unknown", "Invalid user role");
        return;
      }

      // Build Excel workbook
      const workbook = XLSX.utils.book_new();

      Object.entries(exportData).forEach(([sheetName, records]) => {
        if (Array.isArray(records) && records.length > 0) {
          // Flatten nested objects for Excel
          const flattenedRecords = records.map((record) => {
            const flat: Record<string, any> = {};
            Object.entries(record).forEach(([key, value]) => {
              if (typeof value === "object" && value !== null) {
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

          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
        }
      });

      // Generate filename with timestamp and compliance info
      const timestamp = new Date().toISOString().slice(0, 10);
      const hosInfo = user?.hospitalId ? `_${user.hospitalId}` : "";
      const filename = `compliance_audit_${exportType}${hosInfo}_${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
      showToast(`✅ Compliance audit exported: ${filename}`);

      // Log the export for compliance audit trail
      const recordCount = Object.values(exportData).reduce(
        (sum, records) => sum + (Array.isArray(records) ? records.length : 0),
        0
      );
      AuditCompliance.logAuditExport(user?.id || "unknown", user?.role || "unknown", exportType, recordCount, {
        hospitalId: user?.hospitalId || "none",
        timestamp,
      });
    } catch (error) {
      console.error("Compliance audit export error:", error);
      showToast("❌ Export failed - compliance verification error");
      AuditCompliance.logAccessDenied(user?.id || "unknown", "Export error");
    } finally {
      setExporting(false);
      setIsOpen(false);
    }
  };

  // CRITICAL SECURITY: Add data isolation badge to UI
  const getIsolationLevel = () => {
    if (user?.role === "student") {
      return "🔒 Personal Data Only";
    } else if (user?.hospitalId) {
      return `🏥 Hospital: ${user.hospitalId}`;
    }
    return "⚠️ No Access";
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
        Compliance Audit
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-white/10 bg-linear-to-r from-slate-800 to-slate-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-200">Compliance Audit Export</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-slate-300 py-1 px-2 bg-slate-700/40 rounded">
                {getIsolationLevel()}
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Data Isolation Notice */}
              <div className="rounded-lg bg-blue-900/30 border border-blue-500/20 p-2 text-xs">
                <div className="font-semibold text-blue-300 mb-1">🔐 Data Isolation Active</div>
                <div className="text-blue-200/80">
                  {user?.role === "student"
                    ? "Your export includes only your personal data (applications, logs, attestations). No cross-student data sharing."
                    : "Hospital data is strictly isolated. No cross-hospital data leakage. All regulatory data compartmentalized (EHS, DHA, DoH separate)."}
                </div>
              </div>

              {/* Compliance Standards Notice */}
              <div className="rounded-lg bg-amber-900/20 border border-amber-500/20 p-2 text-xs">
                <div className="font-semibold text-amber-300 mb-1">📋 Compliance Standards</div>
                <div className="text-amber-200/80 space-y-1">
                  <div>• UAE Healthcare Regulations (DHA, DoH, EHS)</div>
                  <div>• GDPR (EU citizens' data)</div>
                  <div>• HIPAA (US-related data)</div>
                  <div>• All exports logged for audit trail</div>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm text-slate-200 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors disabled:opacity-50 font-semibold"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <div>
                  <div>Export Compliance Audit</div>
                  <div className="text-xs text-slate-400">Data isolation enforced</div>
                </div>
              </button>

              {/* Legal Disclaimer */}
              <div className="rounded-lg bg-slate-800/40 p-2 text-xs text-slate-400 border border-slate-700">
                <strong>Important:</strong> All exports are logged. Data must comply with UAE healthcare regulations. Unauthorized data access is prohibited and logged.
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hidden file input for future import functionality */}
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" />
    </div>
  );
}
