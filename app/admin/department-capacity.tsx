"use client";
import { useState } from "react";

// Placeholder: In production, fetch from backend
const mockDepartments = [
  { id: "d1", name: "Cardiology", maxCapacity: 5, current: 3 },
  { id: "d2", name: "Radiology", maxCapacity: 4, current: 4 },
  { id: "d3", name: "Emergency Medicine", maxCapacity: 6, current: 2 },
];

export default function DepartmentCapacity() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [editId, setEditId] = useState<string | null>(null);
  const [newCapacity, setNewCapacity] = useState("");

  const handleSave = (id: string) => {
    setDepartments(depts => depts.map(d => d.id === id ? { ...d, maxCapacity: Number(newCapacity) } : d));
    setEditId(null);
    setNewCapacity("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Department Capacity Declaration</h1>
      <table className="w-full border text-sm mb-6">
        <thead>
          <tr className="bg-slate-100 text-slate-800">
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Max Capacity</th>
            <th className="p-2 border">Current Trainees</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(d => (
            <tr key={d.id} className="border-b">
              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">
                {editId === d.id ? (
                  <input
                    type="number"
                    className="border p-1 rounded w-20"
                    value={newCapacity}
                    onChange={e => setNewCapacity(e.target.value)}
                  />
                ) : d.maxCapacity}
              </td>
              <td className="p-2 border">{d.current}</td>
              <td className="p-2 border">
                {editId === d.id ? (
                  <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => handleSave(d.id)}>Save</button>
                ) : (
                  <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => { setEditId(d.id); setNewCapacity(d.maxCapacity.toString()); }}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-slate-500">Electivio will block new trainees if department is at or above declared capacity.</div>
    </div>
  );
}
