"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GraduationCap, 
  Eye, 
  Briefcase, 
  Award, 
  Star, 
  TrendingUp,
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  DollarSign,
  Heart,
  ArrowRight
} from "lucide-react"
import { MedicalSpecialty, CareerStage, CareerMilestone } from "@/lib/types"
import { medicalSpecialties, careerStageInfo, calculateSpecialtyMatch } from "@/lib/careerPathData"

interface CareerStrategizerProps {
  studentId: string
  currentStage?: CareerStage
  completedDepartments?: string[]
  completedSessions?: number
  skillsAcquired?: string[]
  yearOfStudy?: number
  departmentPerformance?: {
    department: string
    averageRating: number
    trend: "improving" | "stable" | "declining"
    strengths: string[]
  }[]
}

const stageIcons: Record<CareerStage, any> = {
  medical_school: GraduationCap,
  observership: Eye,
  internship: Briefcase,
  residency: Award,
  fellowship: Star,
  consultant: TrendingUp
}

const stageColors: Record<CareerStage, string> = {
  medical_school: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  observership: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  internship: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  residency: "bg-green-500/20 text-green-300 border-green-500/30",
  fellowship: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  consultant: "bg-orange-500/20 text-orange-300 border-orange-500/30"
}

export function CareerStrategizer({
  studentId,
  currentStage = "observership",
  completedDepartments = [],
  completedSessions = 0,
  skillsAcquired = [],
  yearOfStudy,
  departmentPerformance = []
}: CareerStrategizerProps) {
  const [viewMode, setViewMode] = useState<"overview" | "specialties" | "timeline">("overview")

  // Calculate recommendations (derived state, no need for effect)
  const recommendations = medicalSpecialties.map(specialty => ({
    specialty,
    score: calculateSpecialtyMatch(specialty, {
      departments: completedDepartments,
      skillsAcquired,
      yearOfStudy,
      completedSessions
    })
  })).sort((a, b) => b.score - a.score)

  // Use derived state for selected specialty
  const [selectedSpecialty, setSelectedSpecialty] = useState<MedicalSpecialty | null>(
    recommendations.length > 0 ? recommendations[0].specialty : null
  )

  const aiStrategy = useMemo(() => {
    const bullets: string[] = []
    const topRec = recommendations[0]
    const topDept = departmentPerformance[0]
    const nextDept = departmentPerformance.find(d => d.department !== topDept?.department)

    if (topRec) {
      bullets.push(
        `Primary focus: ${topRec.specialty.name} (${topRec.score}% match) aligns with your completed departments.`
      )
    }

    if (topDept) {
      bullets.push(
        `Highest performance in ${topDept.department} (avg ${topDept.averageRating.toFixed(1)}, trend ${topDept.trend}).`
      )
    }

    if (skillsAcquired.length) {
      bullets.push(`Leverage strengths: ${skillsAcquired.slice(0, 3).join(", ")}.`)
    }

    if (nextDept) {
      bullets.push(`Diversify next with ${nextDept.department} to broaden your profile.`)
    }

    if (completedSessions < 3) {
      bullets.push("Complete one more session to solidify your ratings and trend trajectory.")
    }

    return {
      headline: topRec ? `AI suggests: ${topRec.specialty.name}` : "AI Strategy Pathway",
      bullets,
      topDept,
    }
  }, [recommendations, departmentPerformance, skillsAcquired, completedSessions])

  const getProgressPercentage = () => {
    const stages: CareerStage[] = ["medical_school", "observership", "internship", "residency", "fellowship", "consultant"]
    const currentIndex = stages.indexOf(currentStage)
    return ((currentIndex + 1) / stages.length) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-linear-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Career Path Strategizer</h2>
            <p className="text-slate-300">
              Discover your medical career trajectory based on your experience and interests
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "overview"
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode("specialties")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "specialties"
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Specialties
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "timeline"
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* Current Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Your Current Stage: {careerStageInfo[currentStage].title}</span>
            <span className="text-purple-300 font-semibold">{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-purple-500 to-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">{completedSessions}</div>
            <div className="text-sm text-slate-400">Sessions Completed</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">{completedDepartments.length}</div>
            <div className="text-sm text-slate-400">Departments Explored</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">{skillsAcquired.length}</div>
            <div className="text-sm text-slate-400">Skills Acquired</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewMode === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Career Timeline */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Medical Career Progression</h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-purple-500 via-blue-500 to-green-500" />

                <div className="space-y-6">
                  {(Object.keys(careerStageInfo) as CareerStage[]).map((stage, index) => {
                    const Icon = stageIcons[stage]
                    const info = careerStageInfo[stage]
                    const isPast = (Object.keys(careerStageInfo) as CareerStage[]).indexOf(currentStage) >= index
                    const isCurrent = currentStage === stage

                    return (
                      <div key={stage} className="relative flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                            isPast
                              ? "bg-linear-to-br from-purple-500 to-blue-500 border-white/20"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          {isPast ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className="w-6 h-6 text-slate-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 pb-6 ${isCurrent ? "ring-2 ring-purple-500/50 rounded-lg p-4 bg-purple-500/10" : ""}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-white">{info.title}</h4>
                            <span className="text-sm text-slate-400 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {info.duration}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{info.description}</p>
                          {isCurrent && (
                            <div className="mt-3 flex items-center gap-2 text-sm">
                              <div className="px-3 py-1 bg-purple-500 text-white rounded-full font-medium">
                                Current Stage
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* AI Strategy Pathway */}
            <div className="rounded-2xl border border-white/10 bg-linear-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">AI Strategy Pathway</h3>
                  <p className="text-slate-300 text-sm">Guidance synthesized from your performance metrics and observership mix.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-slate-200">GPT-style insight</div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400 mb-2">Primary Focus</p>
                  <h4 className="text-lg font-semibold text-white">{aiStrategy.headline}</h4>
                  {aiStrategy.topDept ? (
                    <p className="text-sm text-slate-300 mt-2">
                      Strongest department: {aiStrategy.topDept.department} ({aiStrategy.topDept.averageRating.toFixed(1)} avg, {aiStrategy.topDept.trend} trend)
                    </p>
                  ) : (
                    <p className="text-sm text-slate-300 mt-2">Build more performance data to unlock targeted guidance.</p>
                  )}
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400 mb-3">Next best moves</p>
                  <ul className="space-y-2 list-disc list-inside text-slate-200 text-sm">
                    {aiStrategy.bullets.length ? (
                      aiStrategy.bullets.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))
                    ) : (
                      <li>Complete an observership to receive AI-guided next steps.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Top Recommendations */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Top Specialty Recommendations</h3>
              <div className="grid gap-4">
                {recommendations.slice(0, 3).map(({ specialty, score }) => (
                  <motion.div
                    key={specialty.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedSpecialty(specialty)
                      setViewMode("specialties")
                    }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{specialty.name}</h4>
                        <p className="text-sm text-slate-400">{specialty.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-300">{score}%</div>
                        <div className="text-xs text-slate-400">Match</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{specialty.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {specialty.averageTrainingYears} years
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <DollarSign className="w-3 h-3" />
                        {specialty.averageSalaryRange}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Heart className="w-3 h-3" />
                        {specialty.workLifeBalance}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "specialties" && (
          <motion.div
            key="specialties"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Specialty List */}
            <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 max-h-200 overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">All Specialties</h3>
              <div className="space-y-2">
                {recommendations.map(({ specialty, score }) => (
                  <button
                    key={specialty.id}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedSpecialty?.id === specialty.id
                        ? "bg-purple-500/20 border-2 border-purple-500"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-sm">{specialty.name}</span>
                      <span className="text-xs text-purple-300 font-semibold">{score}%</span>
                    </div>
                    <div className="text-xs text-slate-400">{specialty.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty Detail */}
            {selectedSpecialty && (
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 max-h-200 overflow-y-auto">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedSpecialty.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                          {selectedSpecialty.category}
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                          {selectedSpecialty.growthOutlook} Growth
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedSpecialty.description}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Training Duration
                    </div>
                    <div className="text-xl font-bold text-white">{selectedSpecialty.averageTrainingYears} years</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <DollarSign className="w-4 h-4" />
                      Salary Range
                    </div>
                    <div className="text-xl font-bold text-white">{selectedSpecialty.averageSalaryRange}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Heart className="w-4 h-4" />
                      Work-Life Balance
                    </div>
                    <div className="text-xl font-bold text-white">{selectedSpecialty.workLifeBalance}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <TrendingUp className="w-4 h-4" />
                      Job Outlook
                    </div>
                    <div className="text-xl font-bold text-white">{selectedSpecialty.growthOutlook}</div>
                  </div>
                </div>

                {/* Career Path */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Career Progression Path</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedSpecialty.typicalCareerPath.map((stage, index) => (
                      <div key={stage} className="flex items-center gap-2">
                        <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${stageColors[stage]}`}>
                          {careerStageInfo[stage].title}
                        </div>
                        {index < selectedSpecialty.typicalCareerPath.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subspecialties */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Common Subspecialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialty.commonSubspecialties.map(sub => (
                      <span
                        key={sub}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Required Certifications */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Required Certifications</h3>
                  <ul className="space-y-2">
                    {selectedSpecialty.requiredCertifications.map(cert => (
                      <li key={cert} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Departments */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Related Hospital Departments</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialty.relatedDepartments.map(dept => {
                      const isCompleted = completedDepartments.some(cd => 
                        cd.toLowerCase().includes(dept.toLowerCase()) || 
                        dept.toLowerCase().includes(cd.toLowerCase())
                      )
                      return (
                        <span
                          key={dept}
                          className={`px-3 py-1.5 rounded-lg text-sm border ${
                            isCompleted
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-white/5 text-slate-300 border-white/10"
                          }`}
                        >
                          {dept}
                          {isCompleted && " ✓"}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {viewMode === "timeline" && selectedSpecialty && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Your Path to {selectedSpecialty.name}
            </h3>
            
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-purple-500 via-blue-500 to-green-500" />

              <div className="space-y-8">
                {selectedSpecialty.typicalCareerPath.map((stage, index) => {
                  const Icon = stageIcons[stage]
                  const info = careerStageInfo[stage]
                  const stageIndex = (Object.keys(careerStageInfo) as CareerStage[]).indexOf(stage)
                  const currentIndex = (Object.keys(careerStageInfo) as CareerStage[]).indexOf(currentStage)
                  const isPast = currentIndex >= stageIndex
                  const isCurrent = currentStage === stage

                  return (
                    <div key={stage} className="relative flex items-start gap-4">
                      <div
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                          isPast
                            ? "bg-linear-to-br from-purple-500 to-blue-500 border-white/20"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        {isPast ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className={`flex-1 ${isCurrent ? "ring-2 ring-purple-500/50 rounded-lg p-4 bg-purple-500/10" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-white">{info.title}</h4>
                          <span className="text-sm text-slate-400">{info.duration}</span>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{info.description}</p>
                        
                        {isCurrent && (
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                              You are here
                            </div>
                            <ChevronRight className="w-4 h-4 text-purple-300" />
                            <span className="text-sm text-slate-400">
                              Next: {selectedSpecialty.typicalCareerPath[index + 1] 
                                ? careerStageInfo[selectedSpecialty.typicalCareerPath[index + 1]].title
                                : "Complete Training"}
                            </span>
                          </div>
                        )}

                        {stage === "observership" && completedSessions > 0 && (
                          <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                            <div className="text-sm text-green-300">
                              ✓ You've completed {completedSessions} session{completedSessions > 1 ? "s" : ""} in {completedDepartments.join(", ")}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 p-6 bg-linear-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30">
              <h4 className="text-lg font-semibold text-white mb-3">Estimated Total Timeline</h4>
              <div className="text-3xl font-bold text-purple-300 mb-2">
                {selectedSpecialty.averageTrainingYears} years
              </div>
              <p className="text-slate-300 text-sm">
                From current stage ({careerStageInfo[currentStage].title}) to board-certified {selectedSpecialty.name} specialist
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
