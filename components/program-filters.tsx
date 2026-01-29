"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { motionTokens } from "@/lib/motion";

interface FilterOptions {
  programType: string[]
  specialty: string[]
  location: string[]
  eligibleLevel: string[]
  duration: string[]
  clinicalInvolvement: string[]
}

interface ProgramFiltersProps {
  onFilterChange?: (filters: FilterOptions) => void
}

const filterConfig = {
  programType: {
    label: "Program Type",
    options: [
      "Observership",
      "Elective"
    ]
  },
  specialty: {
    label: "Clinical Specialty",
    options: [
      "Internal Medicine",
      "Surgery",
      "Pediatrics",
      "Obstetrics & Gynecology",
      "Orthopedics",
      "Emergency Medicine",
      "Radiology",
      "Anesthesiology",
      "Psychiatry",
      "Family Medicine",
      "Dermatology",
      "Cardiology",
      "Neurology",
      "General Surgery",
      "Other / Multiple"
    ]
  },
  location: {
    label: "Location",
    options: [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "Fujairah",
      "Umm Al Quwain"
    ]
  },
  eligibleLevel: {
    label: "Eligible Applicant Level",
    options: [
      "Preclinical medical student",
      "Clinical year medical student",
      "Final year medical student",
      "Varies by institution"
    ]
  },
  duration: {
    label: "Program Duration",
    options: [
      "1 to 2 weeks",
      "3 to 4 weeks",
      "6 to 8 weeks",
      "Custom / Varies by institution"
    ]
  },
  clinicalInvolvement: {
    label: "Clinical Involvement",
    options: [
      "Observational only",
      "Limited supervised exposure (subject to eligibility)",
      "Defined by institution"
    ]
  }
}

export function ProgramFilters({ onFilterChange }: ProgramFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    programType: [],
    specialty: [],
    location: [],
    eligibleLevel: [],
    duration: [],
    clinicalInvolvement: []
  })
  const reduce = useReducedMotion()

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category]
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      
      const newFilters = { ...prev, [category]: updated }
      onFilterChange?.(newFilters)
      return newFilters
    })
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      programType: [],
      specialty: [],
      location: [],
      eligibleLevel: [],
      duration: [],
      clinicalInvolvement: []
    }
    setSelectedFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  const activeFilterCount = Object.values(selectedFilters).flat().length

  return (
    <motion.div
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: motionTokens.distance.y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.page, ease: motionTokens.ease.standard }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg p-4 sm:p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100">Filter Programs</h3>
            <p className="text-xs sm:text-sm text-slate-300">Organize by program characteristics</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 transition duration-150 ease-out text-sm font-medium active:scale-[0.98]"
        >
          {isOpen ? 'Hide' : 'Show'} Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-cyan-500 text-white text-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Grid */}
      <Drawer open={isOpen} className="space-y-6">
        {/* Clear All */}
        {activeFilterCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={clearAllFilters}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          </div>
        )}

        {/* Filter Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(filterConfig).map(([key, config]) => (
            <div key={key} className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200">{config.label}</h4>
              <div className="space-y-2">
                {config.options.map((option) => {
                  const isSelected = selectedFilters[key as keyof FilterOptions].includes(option)
                  return (
                    <button
                      key={option}
                      onClick={() => toggleFilter(key as keyof FilterOptions, option)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition duration-150 ease-out text-sm ${
                        isSelected
                          ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-400/30">
          <p className="text-sm text-slate-200">
            <strong>Note:</strong> Filters help you explore programs. Final eligibility is determined by each institution during their review process.
          </p>
        </div>

        {/* Filter Button - Shows when filters selected */}
        {activeFilterCount > 0 && (
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.ui, ease: motionTokens.ease.standard }}
            className="flex gap-3 pt-4 border-t border-white/10"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold transition duration-150 ease-out shadow-lg"
            >
              Apply Filters ({activeFilterCount})
            </button>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 transition duration-150 ease-out font-medium"
            >
              Reset
            </button>
          </motion.div>
        )}
      </Drawer>
    </motion.div>
  )
}
