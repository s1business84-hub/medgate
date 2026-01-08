"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, Upload, FileText, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import UI_COPY from "@/lib/uiCopy"

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  programName: string
  hospitalName: string
  programId?: string
  hospitalId?: string
}

export function ApplicationModal({ isOpen, onClose, programName, hospitalName, programId, hospitalId }: ApplicationModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    yearOfStudy: "",
    university: "",
    gpa: "",
    experience: "",
    motivation: "",
    documents: [] as File[],
    regulatoryType: "None",
    regulatoryReference: "",
    allocationSource: "Student" as "Student" | "EHS" | "Hospital",
    allocatedHospitalInput: "",
    allocationEhsReference: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const existingStudentsRaw = window.localStorage.getItem("medgate_students")
      const existingStudents = existingStudentsRaw ? JSON.parse(existingStudentsRaw) : []
      let student = existingStudents.find((s: any) => s.email === formData.email)
      if (!student) {
        const newId = `stu_${Date.now()}_${Math.random().toString(16).slice(2)}`
        student = {
          id: newId,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          nationality: "",
          complianceStatus: "Incomplete",
          createdAt: new Date().toISOString(),
        }
        existingStudents.push(student)
        window.localStorage.setItem("medgate_students", JSON.stringify(existingStudents))
      }

      const regulatoryTypeVal = formData.regulatoryType as "None" | "EHS" | "DHA" | "DoH"
      const regulatory = {
        type: regulatoryTypeVal,
        reference: formData.regulatoryReference || undefined,
        status: regulatoryTypeVal !== "None" ? ("Pending" as const) : undefined,
      }

      if ((regulatory.type === "DHA" || regulatory.type === "DoH") && !regulatory.reference) {
        ;(await import("@/lib/toast")).showToast("Regulatory reference required for selected regulator before submission.")
        setIsSubmitting(false)
        return
      }

      const { createApplication, setApplicationAllocation } = await import("@/lib/storage")
      const allocationPayload = formData.allocationSource !== "Student"
        ? {
            source: formData.allocationSource,
            assignedHospitalId: formData.allocatedHospitalInput || hospitalId || undefined,
            ehsReference: formData.allocationEhsReference || undefined,
          }
        : undefined

      const created = createApplication({
        studentId: student.id,
        programId: programId || "",
        hospitalId: hospitalId || "",
        regulatory,
        ...(allocationPayload ? { allocation: allocationPayload } : {}),
      })

      if (allocationPayload && created) {
        setApplicationAllocation(created.id, allocationPayload as any)
      }

      setIsSubmitted(true)
    } catch (err: any) {
      ;(await import("@/lib/toast")).showToast(err?.message || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }

    setTimeout(() => {
      onClose()
      setStep(1)
      setIsSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        yearOfStudy: "",
        university: "",
        gpa: "",
        experience: "",
        motivation: "",
        documents: [],
        regulatoryType: "None",
        regulatoryReference: "",
        allocationSource: "Student",
        allocatedHospitalInput: "",
        allocationEhsReference: "",
      })
    }, 3000)
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone)
      case 2:
        return !!(formData.yearOfStudy && formData.university)
      case 3:
        return formData.motivation.length > 50
      default:
        return false
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg sm:max-w-2xl max-h-[88vh] sm:max-h-[90vh] overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{programName}</h2>
                <p className="text-sm text-gray-600 mt-1">{hospitalName}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3].map(stepNumber => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        stepNumber <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-10 sm:w-12 h-0.5 mx-2 transition-colors ${stepNumber < step ? "bg-blue-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-between gap-2 mt-2 text-[11px] text-gray-600">
                <span>Personal Info</span>
                <span>Academic Details</span>
                <span>Documents & Motivation</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto space-y-6">
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{UI_COPY.student.applicationSubmittedTitle}</h3>
                  <p className="text-gray-600">We&apos;ll review your application and get back to you within 3-5 business days.</p>
                  {(formData as any).allocationSource && (formData as any).allocationSource !== "Student" && (
                    <div className="mt-4 text-sm text-gray-700 space-y-1">
                      <div>
                        <strong>Allocation:</strong> {(formData as any).allocationSource}
                      </div>
                      {(formData as any).allocatedHospitalInput && <div>Assigned hospital: {(formData as any).allocatedHospitalInput}</div>}
                      {(formData as any).allocationEhsReference && <div>EHS reference: {(formData as any).allocationEhsReference}</div>}
                      {(formData as any).allocationSource === "EHS" && (
                        <div className="text-amber-600">Hospital confirmation may be required before starting training.</div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center mb-2">
                          <User className="w-5 h-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">First Name *</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="form-input pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="form-input pl-10"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center mb-2">
                          <FileText className="w-5 h-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Year of Study *</label>
                            <select
                              name="yearOfStudy"
                              value={formData.yearOfStudy}
                              onChange={handleInputChange}
                              className="form-select"
                              required
                            >
                              <option value="">Select year</option>
                              <option value="1">Year 1</option>
                              <option value="2">Year 2</option>
                              <option value="3">Year 3</option>
                              <option value="4">Year 4</option>
                              <option value="5">Year 5</option>
                              <option value="6">Year 6</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">GPA (Optional)</label>
                            <input
                              type="text"
                              name="gpa"
                              value={formData.gpa}
                              onChange={handleInputChange}
                              placeholder="e.g., 3.8"
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">University/Institution *</label>
                          <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleInputChange}
                            placeholder="Enter your university name"
                            className="form-input"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Relevant Experience (Optional)</label>
                          <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="Describe any relevant clinical experience, volunteering, or research..."
                            className="form-input resize-none"
                            rows={3}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center mb-2">
                          <Upload className="w-5 h-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Documents & Motivation</h3>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Why do you want to join this program? *</label>
                          <textarea
                            name="motivation"
                            value={formData.motivation}
                            onChange={handleInputChange}
                            placeholder="Tell us about your interest in this program and what you hope to gain from the experience..."
                            className="form-input resize-none"
                            rows={4}
                            required
                          />
                          <p className="text-xs text-gray-500">Minimum 50 characters. {formData.motivation.length}/50</p>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Allocation</label>
                            <div className="flex items-center gap-3 flex-wrap">
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="radio"
                                  name="allocationSource"
                                  value="Student"
                                  checked={formData.allocationSource === "Student"}
                                  onChange={e => setFormData(prev => ({ ...prev, allocationSource: (e.target as HTMLInputElement).value as any }))}
                                />
                                <span>I&apos;m applying myself</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  data-testid="app-modal-allocation-ehs"
                                  type="radio"
                                  name="allocationSource"
                                  value="EHS"
                                  checked={formData.allocationSource === "EHS"}
                                  onChange={e => setFormData(prev => ({ ...prev, allocationSource: (e.target as HTMLInputElement).value as any }))}
                                />
                                <span>Allocated via EHS</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="radio"
                                  name="allocationSource"
                                  value="Hospital"
                                  checked={formData.allocationSource === "Hospital"}
                                  onChange={e => setFormData(prev => ({ ...prev, allocationSource: (e.target as HTMLInputElement).value as any }))}
                                />
                                <span>Nominated by hospital</span>
                              </label>
                            </div>
                          </div>

                          {formData.allocationSource !== "Student" && (
                            <div className="space-y-3">
                              <input
                                data-testid="app-modal-allocated-hospital"
                                name="allocatedHospitalInput"
                                value={formData.allocatedHospitalInput}
                                onChange={e => setFormData(prev => ({ ...prev, allocatedHospitalInput: e.target.value }))}
                                placeholder="Assigned hospital (name or id)"
                                className="form-input"
                              />
                              {formData.allocationSource === "EHS" && (
                                <input
                                  data-testid="app-modal-ehs-reference"
                                  name="allocationEhsReference"
                                  value={formData.allocationEhsReference}
                                  onChange={e => setFormData(prev => ({ ...prev, allocationEhsReference: e.target.value }))}
                                  placeholder="EHS reference (if provided)"
                                  className="form-input"
                                />
                              )}
                            </div>
                          )}

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Regulatory (if applicable)</label>
                            <div className="flex gap-3 flex-wrap">
                              <select
                                name="regulatoryType"
                                value={formData.regulatoryType}
                                onChange={e => setFormData(prev => ({ ...prev, regulatoryType: (e.target as HTMLSelectElement).value }))}
                                className="form-select w-48"
                              >
                                <option value="None">None</option>
                                <option value="EHS">EHS</option>
                                <option value="DHA">DHA</option>
                                <option value="DoH">DoH</option>
                              </select>
                              <input
                                name="regulatoryReference"
                                value={formData.regulatoryReference}
                                onChange={e => setFormData(prev => ({ ...prev, regulatoryReference: e.target.value }))}
                                placeholder="Reference (if any)"
                                className="form-input flex-1"
                              />
                            </div>
                            <p className="text-xs text-gray-500">If DHA/DoH selected, a reference is required and hospital must verify.</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">Upload Documents (Optional)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={handleFileChange}
                              className="hidden"
                              id="document-upload"
                            />
                            <label htmlFor="document-upload" className="cursor-pointer flex flex-col items-center justify-center py-4">
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 text-center">Click to upload CV, transcripts, or other documents</p>
                              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (max 10MB each)</p>
                            </label>
                          </div>

                          {formData.documents.length > 0 && (
                            <div className="space-y-2">
                              {formData.documents.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                  </div>
                                  <button type="button" onClick={() => removeDocument(index)} className="text-red-500 hover:text-red-700">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              )}
            </div>

            {!isSubmitted && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  data-testid="app-modal-cancel"
                  type="button"
                  variant="outline"
                  onClick={step === 1 ? onClose : prevStep}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {step === 1 ? "Cancel" : "Previous"}
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm text-gray-500">Step {step} of 3</span>
                  {step < 3 ? (
                    <Button
                      data-testid="app-modal-next"
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid() || isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      data-testid="app-modal-submit"
                      onClick={handleSubmit}
                      disabled={!isStepValid() || isSubmitting}
                      className="bg-green-600 hover:bg-green-700 min-w-30 w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        UI_COPY.student.submitApplicationButton
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
