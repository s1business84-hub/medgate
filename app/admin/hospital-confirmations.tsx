"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getApplications, setApplicationRegulatory, createNotification, logAudit } from "@/lib/storage"
import { addEhsConfirmation } from "@/lib/auditStore"

export default function HospitalConfirmationsAdmin() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = () => {
    const all = getApplications()
    // Include both EHS allocations and applications requiring regulatory verification (DHA/DoH)
    const ehsAllocated = all.filter(a => a.allocation?.source === 'EHS' || (a.regulatory && (a.regulatory.type === 'DHA' || a.regulatory.type === 'DoH') && a.regulatory.status === 'Pending'))
    setApplications(ehsAllocated)
  }

  useEffect(() => {
    load()
  }, [])

  const verify = (appId: string) => {
    setLoading(true)
    try {
      const app = setApplicationRegulatory(appId, { type: 'EHS', reference: (getApplications().find(a => a.id === appId)?.allocation?.ehsReference) || undefined, status: 'Verified' })
      if (app) {
        // If this was a regulatory verification (DHA/DoH) mark accordingly, otherwise treat as EHS allocation verification
        createNotification({ userId: app.studentId, type: 'update', title: app.regulatory?.type && (app.regulatory.type === 'DHA' || app.regulatory.type === 'DoH') ? 'Regulatory Clearance Verified' : 'Allocation Verified', message: `Your application ${app.id} has been verified by the hospital.`, relatedApplicationId: app.id })
        logAudit({ userId: 'hospital_admin', action: app.regulatory?.type && (app.regulatory.type === 'DHA' || app.regulatory.type === 'DoH') ? 'verify_regulatory_clearance' : 'verify_ehs_allocation', details: `Verified ${app.regulatory?.type || 'allocation'} for application ${app.id}` })
        // Record structured EHS confirmation in audit store
        try {
          const target = getApplications().find(a => a.id === app.id)
          addEhsConfirmation({ applicationId: app.id, studentId: app.studentId, programId: app.programId, hospitalId: target?.hospitalId || app.allocation?.assignedHospitalId, ehsReference: app.regulatory?.reference, verifiedBy: 'hospital_admin' })
        } catch (err) {
          // non-fatal
          console.error('Failed to record EHS confirmation in auditStore', err)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      load()
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Hospital — EHS Allocations</h1>

      {applications.length === 0 ? (
        <p className="text-sm text-gray-600">No EHS allocations awaiting verification.</p>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="p-4 border rounded-md flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Application: {app.id}</div>
                <div className="text-xs text-gray-600">Student: {app.studentId} — Program: {app.programId}</div>
                <div className="text-xs text-gray-600">EHS ref: {app.allocation?.ehsReference || '(none)'} — Assigned hospital: {app.allocation?.assignedHospitalId || app.hospitalId || '(none)'}</div>
                {app.regulatory && (app.regulatory.type === 'DHA' || app.regulatory.type === 'DoH') && (
                  <div className="text-xs text-yellow-600">Regulatory: {app.regulatory.type} — {app.regulatory.status || 'Pending'}</div>
                )}
              </div>
              <div>
                <Button data-testid={`mark-verified-${app.id}`} onClick={() => verify(app.id)} disabled={loading || app.regulatory?.status === 'Verified'}>
                  {app.regulatory?.status === 'Verified' ? 'Verified' : 'Mark Verified'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
