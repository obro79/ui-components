import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

export type ProjectTableRow = {
  id: string
  name: string
  status: "Active" | "In review" | "Draft" | "Paused"
  owner: string
  updated: string
}

const DEFAULT_ROWS: ProjectTableRow[] = [
  { id: "atlas", name: "Atlas dashboard", status: "Active", owner: "Maya Chen", updated: "2026-07-19" },
  { id: "checkout", name: "Checkout refresh", status: "In review", owner: "Noah Kim", updated: "2026-07-18" },
  { id: "mobile", name: "Mobile navigation", status: "Draft", owner: "Iris Bell", updated: "2026-07-17" },
  { id: "tokens", name: "Token migration", status: "Active", owner: "Sam Rivera", updated: "2026-07-15" },
  { id: "billing", name: "Billing portal", status: "Paused", owner: "Maya Chen", updated: "2026-07-12" },
  { id: "onboarding", name: "Onboarding flow", status: "In review", owner: "Iris Bell", updated: "2026-07-10" },
  { id: "docs", name: "Docs search", status: "Active", owner: "Noah Kim", updated: "2026-07-08" },
  { id: "reports", name: "Reports builder", status: "Draft", owner: "Sam Rivera", updated: "2026-07-06" },
  { id: "settings", name: "Workspace settings", status: "Active", owner: "Maya Chen", updated: "2026-07-03" },
]

function SelectionCheckbox({ checked, indeterminate = false, label, onChange }: { checked: boolean; indeterminate?: boolean; label: string; onChange: (checked: boolean) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate }, [indeterminate])
  return <input ref={ref} type="checkbox" checked={checked} aria-label={label} onChange={(event) => onChange(event.target.checked)} />
}

export type DataTableToolsProps = {
  data?: ProjectTableRow[]
}

export function DataTableTools({ data = DEFAULT_ROWS }: DataTableToolsProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "updated", desc: true }])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 })

  const columns = useMemo<ColumnDef<ProjectTableRow>[]>(() => [
    {
      id: "select",
      enableSorting: false,
      header: ({ table }) => <SelectionCheckbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        label="Select all rows on this page"
        onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />,
      cell: ({ row }) => <SelectionCheckbox checked={row.getIsSelected()} label={`Select ${row.original.name}`} onChange={(checked) => row.toggleSelected(checked)} />,
    },
    { accessorKey: "name", header: "Project" },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <span className="builder-table-status" data-status={String(getValue()).toLowerCase().replace(" ", "-")}>{String(getValue())}</span> },
    { accessorKey: "owner", header: "Owner" },
    { accessorKey: "updated", header: "Updated", cell: ({ getValue }) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(`${String(getValue())}T12:00:00`)) },
  ], [])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection, globalFilter, pagination },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const pageCount = Math.max(1, table.getPageCount())

  return <div className="builder-data-table">
    <div className="builder-table-toolbar">
      <label className="builder-table-search">
        <span className="builder-sr-only">Filter projects</span>
        <Search aria-hidden="true" size={16} />
        <input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Filter projects…" />
        {globalFilter && <button type="button" className="builder-icon-button" aria-label="Clear project filter" onClick={() => setGlobalFilter("")}><X aria-hidden="true" size={14} /></button>}
      </label>
      <span className="builder-selection-count" aria-live="polite">{selectedCount} selected</span>
    </div>

    <div className="builder-table-scroll">
      <table>
        <caption className="builder-sr-only">Projects with sortable columns, row selection, filtering, and pagination</caption>
        <thead>{table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => {
          const sorted = header.column.getIsSorted()
          const ariaSort = sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"
          return <th key={header.id} aria-sort={header.column.getCanSort() ? ariaSort : undefined}>
            {header.isPlaceholder ? null : header.column.getCanSort() ? <button type="button" className="builder-sort-button" onClick={header.column.getToggleSortingHandler()}>
              {flexRender(header.column.columnDef.header, header.getContext())}
              {sorted === "asc" ? <ArrowUp aria-hidden="true" size={14} /> : sorted === "desc" ? <ArrowDown aria-hidden="true" size={14} /> : <ChevronsUpDown aria-hidden="true" size={14} />}
            </button> : flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        })}</tr>)}</thead>
        <tbody>{table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <tr key={row.id} data-selected={row.getIsSelected() || undefined}>{row.getVisibleCells().map((cell) => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={columns.length}><div className="builder-table-empty">No projects match “{globalFilter}”.</div></td></tr>}</tbody>
      </table>
    </div>

    <div className="builder-table-pagination">
      <label>Rows <select value={pagination.pageSize} onChange={(event) => table.setPageSize(Number(event.target.value))}><option value="4">4</option><option value="6">6</option><option value="9">9</option></select></label>
      <span>Page {table.getState().pagination.pageIndex + 1} of {pageCount}</span>
      <div>
        <button type="button" className="builder-icon-button" aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeft aria-hidden="true" size={17} /></button>
        <button type="button" className="builder-icon-button" aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRight aria-hidden="true" size={17} /></button>
      </div>
    </div>
  </div>
}
