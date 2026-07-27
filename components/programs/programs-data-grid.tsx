"use client";

/**
 * Programme listings built on the reUI DataGrid (TanStack Table underneath).
 *
 * Table on md+, cards on mobile — a 7-column grid is unusable at 375px, and
 * the same TanStack instance drives both so sorting/filtering stay in sync.
 */

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { MapPin, Clock, Search, Building2 } from "lucide-react";

import { DataGrid } from "@/components/reui/data-grid/data-grid";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ProgramRow = {
  id: string;
  name: string;
  hospital: string;
  city: string;
  specialty: string;
  duration: string;
  exposureLevel: string;
  status: "Pilot" | "Planned";
};

function StatusBadge({ status }: { status: ProgramRow["status"] }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "shrink-0",
        status === "Pilot"
          ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
          : "border-white/10 bg-white/5 text-slate-400"
      )}
    >
      {status}
    </Badge>
  );
}

export function ProgramsDataGrid({ rows }: { rows: ProgramRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.hospital, r.city, r.specialty].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [rows, search]);

  const columns = useMemo<ColumnDef<ProgramRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Programme" column={column} />
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{row.original.name}</p>
            <p className="truncate text-xs text-slate-400">
              {row.original.specialty}
            </p>
          </div>
        ),
        size: 280,
      },
      {
        accessorKey: "hospital",
        header: ({ column }) => (
          <DataGridColumnHeader title="Institution" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-slate-300">{row.original.hospital}</span>
        ),
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <DataGridColumnHeader title="Location" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-slate-300">{row.original.city}</span>
        ),
      },
      {
        accessorKey: "duration",
        header: ({ column }) => (
          <DataGridColumnHeader title="Duration" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-slate-300">{row.original.duration}</span>
        ),
      },
      {
        accessorKey: "exposureLevel",
        header: ({ column }) => (
          <DataGridColumnHeader title="Exposure" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-slate-400">{row.original.exposureLevel}</span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 110,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
    getRowId: (r) => r.id,
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      {/* search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search specialty, hospital or city"
          aria-label="Search programmes"
          className="h-11 border-white/10 bg-white/5 pl-9 text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <p className="text-xs text-slate-400">
        {filtered.length} programme{filtered.length === 1 ? "" : "s"}
      </p>

      {/* Table from md up */}
      <div className="hidden md:block">
        <DataGrid
          table={table}
          recordCount={filtered.length}
          emptyMessage="No programmes match that search."
          tableLayout={{ rowBorder: true, headerBackground: true, dense: true }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
            <DataGridTable />
          </div>
          <div className="mt-3">
            <DataGridPagination />
          </div>
        </DataGrid>
      </div>

      {/* Cards below md */}
      <div className="grid gap-3 md:hidden">
        {visibleRows.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
            No programmes match that search.
          </p>
        )}
        {visibleRows.map((row) => {
          const p = row.original;
          return (
            <article
              key={p.id}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition-colors hover:border-blue-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                  <p className="mt-0.5 text-xs text-blue-300">{p.specialty}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <dl className="mt-3 space-y-1.5 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-slate-500" />
                  <dd className="truncate">{p.hospital}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                  <dd>{p.city}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-slate-500" />
                  <dd>{p.duration}</dd>
                </div>
              </dl>
            </article>
          );
        })}

        {visibleRows.length > 0 && (
          <div className="pt-1">
            <DataGrid table={table} recordCount={filtered.length}>
              <DataGridPagination />
            </DataGrid>
          </div>
        )}
      </div>
    </div>
  );
}
