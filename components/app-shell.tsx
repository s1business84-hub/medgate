"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Stethoscope,
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  Building2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Programs",
    href: "/programs",
    icon: Stethoscope,
  },
  {
    name: "Student Portal",
    href: "/student",
    icon: Users,
  },
  {
    name: "Purpose",
    href: "/purpose",
    icon: LayoutDashboard,
  },
  {
    name: "For Hospitals",
    href: "/for-hospitals",
    icon: Building2,
  },
  {
    name: "Login",
    href: "/login",
    icon: Settings,
  },
]

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white/80 backdrop-blur-xl px-6 pb-4 shadow-sm">
          <div className="flex h-16 shrink-0 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 shadow-lg">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Electivio
                </h1>
              </div>
            </motion.div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200",
                            item.name === "Login"
                              ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:from-blue-400 hover:to-indigo-500"
                              : isActive
                              ? "bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200/50 hover:bg-slate-50 hover:shadow-sm"
                              : "text-slate-700 hover:bg-slate-50 hover:shadow-sm hover:text-slate-900"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              item.name === "Login"
                                ? "text-white"
                                : isActive
                                ? "text-blue-600"
                                : "text-slate-400 group-hover:text-slate-600"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                          {isActive && item.name !== "Login" && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-blue-600 to-indigo-600 rounded-r-full"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 sm:px-6 pb-4">
            <div className="flex h-14 sm:h-16 shrink-0 items-center">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 shadow-lg">
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Electivio
                  </h1>
                </div>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              "group flex gap-x-3 rounded-lg p-3 sm:p-4 text-sm sm:text-base font-medium leading-6 transition-all duration-200 min-h-12 items-center",
                              item.name === "Login"
                                ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:from-blue-400 hover:to-indigo-500"
                                : isActive
                                ? "bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200/50 hover:bg-slate-50 hover:shadow-sm"
                                : "text-slate-700 hover:bg-slate-50 hover:shadow-sm hover:text-slate-900"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                item.name === "Login"
                                  ? "text-white"
                                  : isActive
                                  ? "text-blue-600"
                                  : "text-slate-400 group-hover:text-slate-600"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-3 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-3 sm:px-6 shadow-sm lg:px-8">
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="-m-2.5 p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 lg:hidden min-h-11 min-w-11"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>

          {/* Separator */}
          <div className="h-5 sm:h-6 w-px bg-slate-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-3 sm:gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              {/* Mobile logo - only show on mobile when sidebar is closed */}
              <div className="lg:hidden flex items-center space-x-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 shadow-sm">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm sm:text-base font-semibold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Electivio
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-3 sm:gap-x-4 lg:gap-x-6">
              {/* Profile dropdown or other actions can go here */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-linear-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">MG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}