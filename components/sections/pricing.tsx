"use client"

import { motion } from "framer-motion"
import { Check, Star, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"

// Dynamic pricing data with real-time updates
const basePlans = [
  {
    name: "Free",
    basePrice: 0,
    description: "Perfect for exploring programs",
    features: [
      "Browse all programs",
      "Basic application tracking",
      "Email support",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    basePrice: 29,
    period: "per month",
    description: "For serious medical students",
    features: [
      "Everything in Free",
      "Priority applications",
      "Document review service",
      "Interview preparation",
      "Direct hospital contacts",
      "24/7 priority support",
    ],
    cta: "Start Premium",
    popular: true,
  },
  {
    name: "Enterprise",
    basePrice: null,
    description: "For medical schools & institutions",
    features: [
      "Everything in Premium",
      "Bulk applications",
      "Custom integrations",
      "Dedicated account manager",
      "Analytics dashboard",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  const [plans, setPlans] = useState(() =>
    basePlans.map(plan => ({
      ...plan,
      price: plan.basePrice === null ? "Custom" : plan.basePrice === 0 ? "$0" : `$${plan.basePrice}`,
      trend: plan.basePrice === null ? null : Math.random() > 0.5 ? "up" : "down",
      lastUpdated: new Date().toLocaleTimeString()
    }))
  )

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPlans(currentPlans =>
        currentPlans.map(plan => {
          if (plan.basePrice === null || plan.basePrice === 0) return plan

          // Simulate small price fluctuations (±5%)
          const fluctuation = (Math.random() - 0.5) * 0.1
          const newPrice = Math.max(1, Math.round(plan.basePrice * (1 + fluctuation)))
          const trend = newPrice > plan.basePrice ? "up" : newPrice < plan.basePrice ? "down" : plan.trend

          return {
            ...plan,
            basePrice: newPrice,
            price: `$${newPrice}`,
            trend,
            lastUpdated: new Date().toLocaleTimeString()
          }
        })
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 sm:py-24 bg-linear-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600 max-w-xl mx-auto px-4"
          >
            Choose the plan that works best for your medical training journey.
            Upgrade or downgrade at any time.
          </motion.p>
        </div>

        <div className="mx-auto mt-12 sm:mt-16 grid max-w-lg grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                plan.popular
                  ? "border border-white/40 backdrop-blur-xl bg-linear-to-br from-white/50 via-white/30 to-white/20"
                  : "border border-white/30 backdrop-blur-xl bg-linear-to-br from-white/40 via-white/20 to-white/10"
              }`}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-400/10 via-transparent to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Liquid glass shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-linear-to-br from-white to-transparent rounded-full blur-xl" />
              </div>

              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-lg">
                    <Star className="mr-1 h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                    <span className="hidden sm:inline">Most Popular</span>
                    <span className="sm:hidden">Popular</span>
                  </div>
                </div>
              )}

              <div className="relative text-center z-10">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-3 sm:mt-4 flex items-baseline justify-center">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="ml-1 text-xs sm:text-sm font-medium text-slate-600">
                      {plan.period}
                    </span>
                  )}
                  {plan.trend && (
                    <div className="ml-2 flex items-center">
                      {plan.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {plan.lastUpdated && plan.basePrice !== 0 && plan.basePrice !== null && (
                  <div className="mt-1 flex items-center justify-center text-xs text-slate-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span className="hidden sm:inline">Updated {plan.lastUpdated}</span>
                    <span className="sm:hidden">Live</span>
                  </div>
                )}
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600">{plan.description}</p>
              </div>

              <ul className="relative z-10 mt-6 sm:mt-8 space-y-2 sm:space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="ml-3 text-xs sm:text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="relative z-10 mt-6 sm:mt-8">
                <Button
                  className={`w-full py-3 text-sm sm:text-base ${
                    plan.popular
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600">
            Have questions about pricing?{" "}
            <a href="#faq" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Check our FAQ →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}