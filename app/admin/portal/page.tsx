"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertCircle,
  Filter,
  Search,
  Download,
  Settings,
} from "lucide-react";

interface DutyAssignment {
  id: string;
  doctorId: string;
  doctorName: string;
  department: string;
  maxStudents: number;
  assignedStudents: number;
  assignedDate: string;
  status: "active" | "inactive" | "pending";
  specialties: string[];
}

interface DoctorProfile {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  specialization: string;
  available: boolean;
}

export default function AdminPortal() {
  const router = useRouter();

  // Mock data
  const mockDutiesData: DutyAssignment[] = [
    {
      id: "duty_1",
      doctorId: "DOC001",
      doctorName: "Dr. Sarah Ahmed",
      department: "Internal Medicine",
      maxStudents: 12,
      assignedStudents: 10,
      assignedDate: "2025-01-15",
      status: "active",
      specialties: ["Cardiology", "Pulmonology"],
    },
    {
      id: "duty_2",
      doctorId: "DOC002",
      doctorName: "Dr. Mohammed Hassan",
      department: "Surgery",
      maxStudents: 8,
      assignedStudents: 7,
      assignedDate: "2025-01-10",
      status: "active",
      specialties: ["General Surgery", "Emergency Surgery"],
    },
    {
      id: "duty_3",
      doctorId: "DOC003",
      doctorName: "Dr. Fatima Al Mazrouei",
      department: "Pediatrics",
      maxStudents: 6,
      assignedStudents: 3,
      assignedDate: "2025-01-20",
      status: "pending",
      specialties: ["Neonatal Care"],
    },
  ];

  const mockDoctorsData: DoctorProfile[] = [
    {
      id: "DOC001",
      name: "Dr. Sarah Ahmed",
      department: "Internal Medicine",
      email: "sarah.ahmed@hospital.com",
      phone: "+971 4 XXX XXXX",
      specialization: "Cardiology",
      available: true,
    },
    {
      id: "DOC002",
      name: "Dr. Mohammed Hassan",
      department: "Surgery",
      email: "mohammed.hassan@hospital.com",
      phone: "+971 4 XXX XXXX",
      specialization: "General Surgery",
      available: true,
    },
    {
      id: "DOC003",
      name: "Dr. Fatima Al Mazrouei",
      department: "Pediatrics",
      email: "fatima.mazrouei@hospital.com",
      phone: "+971 4 XXX XXXX",
      specialization: "Neonatal Care",
      available: false,
    },
    {
      id: "DOC004",
      name: "Dr. Ahmed Rashid",
      department: "Emergency Medicine",
      email: "ahmed.rashid@hospital.com",
      phone: "+971 4 XXX XXXX",
      specialization: "Emergency Medicine",
      available: true,
    },
  ];

  const [duties, setDuties] = useState<DutyAssignment[]>(mockDutiesData);
  const [doctors, setDoctors] = useState<DoctorProfile[]>(mockDoctorsData);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"assignments" | "doctors" | "reports">("assignments");
  const [showAddDuty, setShowAddDuty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newDuty, setNewDuty] = useState({
    doctorId: "",
    maxStudents: 10,
    specialties: "",
  });

  const handleAddDuty = () => {
    if (!newDuty.doctorId) {
      alert("Please select a doctor");
      return;
    }

    const doctor = doctors.find((d) => d.id === newDuty.doctorId);
    if (!doctor) return;

    const duty: DutyAssignment = {
      id: `duty_${Date.now()}`,
      doctorId: newDuty.doctorId,
      doctorName: doctor.name,
      department: doctor.department,
      maxStudents: newDuty.maxStudents,
      assignedStudents: 0,
      assignedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      specialties: newDuty.specialties.split(",").map((s) => s.trim()),
    };

    setDuties([...duties, duty]);
    setNewDuty({ doctorId: "", maxStudents: 10, specialties: "" });
    setShowAddDuty(false);
  };

  const handleRemoveDuty = (id: string) => {
    setDuties(duties.filter((d) => d.id !== id));
  };

  const handleApproveDuty = (id: string) => {
    setDuties(
      duties.map((d) =>
        d.id === id ? { ...d, status: "active" as const } : d
      )
    );
  };

  const filteredDuties = duties.filter((duty) => {
    const matchSearch =
      duty.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      duty.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDept === "all" || duty.department === filterDept;
    const matchStatus = filterStatus === "all" || duty.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const departments = [...new Set(doctors.map((d) => d.department))];
  const activeDuties = duties.filter((d) => d.status === "active").length;
  const totalAssignedStudents = duties.reduce((sum, d) => sum + d.assignedStudents, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading admin portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-sm text-slate-500">Duty Assignment & Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Duties", value: activeDuties, icon: Users, color: "from-blue-500 to-blue-500" },
            { label: "Total Doctors", value: doctors.length, icon: Users, color: "from-indigo-500 to-indigo-500" },
            { label: "Students Assigned", value: totalAssignedStudents, icon: BarChart3, color: "from-green-500 to-emerald-500" },
            { label: "Pending Approval", value: duties.filter((d) => d.status === "pending").length, icon: AlertCircle, color: "from-yellow-500 to-orange-500" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <stat.icon className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          {[
            { id: "assignments", label: "Duty Assignments" },
            { id: "doctors", label: "Doctor Management" },
            { id: "reports", label: "Reports" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-3 font-medium transition-all border-b-2 ${
                selectedTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Assignments Tab */}
        {selectedTab === "assignments" && (
          <div className="space-y-6">
            {/* Add Duty Form */}
            {showAddDuty && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Assign New Duty</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    value={newDuty.doctorId}
                    onChange={(e) => setNewDuty({ ...newDuty, doctorId: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.department}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newDuty.maxStudents}
                    onChange={(e) => setNewDuty({ ...newDuty, maxStudents: parseInt(e.target.value) })}
                    placeholder="Max Students"
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />

                  <input
                    type="text"
                    value={newDuty.specialties}
                    onChange={(e) => setNewDuty({ ...newDuty, specialties: e.target.value })}
                    placeholder="Specialties (comma-separated)"
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddDuty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Assign Duty
                  </button>
                  <button
                    onClick={() => setShowAddDuty(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {!showAddDuty && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAddDuty(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Assign New Duty
              </motion.button>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search doctor name or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Duties Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Doctor Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Department</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Max Students</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Assigned</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Specialties</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDuties.map((duty, idx) => (
                      <motion.tr
                        key={duty.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">{duty.doctorName}</td>
                        <td className="px-6 py-4 text-slate-600">{duty.department}</td>
                        <td className="px-6 py-4 text-slate-600">{duty.maxStudents}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 font-semibold">{duty.assignedStudents}</span>
                            <div className="w-24 h-2 bg-slate-200 rounded-full">
                              <div
                                className="h-2 bg-blue-600 rounded-full transition-all"
                                style={{ width: `${(duty.assignedStudents / duty.maxStudents) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {duty.specialties.join(", ")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              duty.status === "active"
                                ? "bg-green-100 text-green-700"
                                : duty.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {duty.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {duty.status === "pending" && (
                              <button
                                onClick={() => handleApproveDuty(duty.id)}
                                className="p-1 hover:bg-green-100 text-green-600 rounded transition-colors"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveDuty(duty.id)}
                              className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {selectedTab === "doctors" && (
          <div className="grid md:grid-cols-2 gap-6">
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {doctor.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{doctor.name}</p>
                      <p className="text-sm text-slate-500">{doctor.specialization}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      doctor.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-semibold">Department:</span> {doctor.department}</p>
                  <p className="text-sm"><span className="font-semibold">Email:</span> {doctor.email}</p>
                  <p className="text-sm"><span className="font-semibold">Phone:</span> {doctor.phone}</p>
                </div>

                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Edit Profile
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reports Tab */}
        {selectedTab === "reports" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Reports & Analytics</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Duty Assignment Report",
                  description: "Download all current duty assignments",
                },
                {
                  title: "Doctor Utilization Report",
                  description: "Doctor capacity and student distribution",
                },
                {
                  title: "Department Summary",
                  description: "Department-wise duty status",
                },
                {
                  title: "Student Assignment List",
                  description: "Complete student assignment details",
                },
              ].map((report) => (
                <div key={report.title} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <p className="font-semibold text-slate-900 mb-1">{report.title}</p>
                  <p className="text-sm text-slate-600 mb-3">{report.description}</p>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
