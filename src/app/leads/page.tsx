"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown, Mail, ExternalLink, Search, Plus, Download } from "lucide-react"

interface Lead {
  id: string
  clubName: string
  location: string
  state: string
  tier: string
  contactEmail: string
  website: string
  status: "New" | "Emailed" | "Meeting Set" | "Closed"
  personalization: string
  tags: string[]
}

const leadsData: Lead[] = [
  {
    id: "SA-001",
    clubName: "South Adelaide Panthers",
    location: "Marion Stadium",
    state: "SA",
    tier: "Tier 1",
    contactEmail: "secretary@southadelaidebasketball.com.au",
    website: "https://www.southadelaidebasketball.com.au/",
    status: "New",
    personalization: "REDARC extended 3-year partnership for Hoops & Her program",
    tags: ["district", "womens-basketball"],
  },
  {
    id: "SA-002",
    clubName: "Norwood Flames",
    location: "The ARC Campbelltown",
    state: "SA",
    tier: "Tier 1",
    contactEmail: "secretary@norwoodbasketball.com.au",
    website: "https://www.norwoodbasketball.com.au/",
    status: "New",
    personalization: "Adelaide's biggest club (60+ teams), runs Easter Classic Tournament",
    tags: ["district", "largest-club"],
  },
  {
    id: "SA-003",
    clubName: "Sturt Sabres",
    location: "Springbank Sports Centre",
    state: "SA",
    tier: "Tier 1",
    contactEmail: "basketball@sturtsabres.com.au",
    website: "https://www.sturtsabres.com.au/",
    status: "New",
    personalization: "Most professional junior program in SA, pro player pipeline",
    tags: ["district", "elite"],
  },
  {
    id: "SA-004",
    clubName: "Forestville Eagles",
    location: "State Basketball Centre Wayville",
    state: "SA",
    tier: "Tier 1 Warm",
    contactEmail: "finance@forestvilleeagles.asn.au",
    website: "https://www.forestvilleeagles.asn.au/",
    status: "New",
    personalization: "Zane's club! Mini 3agles 3v3 program active now",
    tags: ["district", "warm-lead", "zanes-club"],
  },
  {
    id: "SA-005",
    clubName: "West Adelaide Bearcats",
    location: "Port Adelaide Recreation Centre",
    state: "SA",
    tier: "Tier 1",
    contactEmail: "playatwestbearcats@gmail.com",
    website: "https://www.westbearcats.net/",
    status: "New",
    personalization: "SA Premier League, NBL1 Central, season starts March 2026",
    tags: ["district", "nbl1"],
  },
  {
    id: "SA-006",
    clubName: "Woodville Warriors",
    location: "St Clair Recreation Centre",
    state: "SA",
    tier: "Tier 1",
    contactEmail: "secretary@woodvillewarriors.com.au",
    website: "https://woodvillewarriors.com.au",
    status: "New",
    personalization: "One of only 10 Basketball SA elite member clubs",
    tags: ["district", "elite"],
  },
  {
    id: "SA-007",
    clubName: "Eastern Mavericks",
    location: "St Francis De Sales College Mt Barker",
    state: "SA",
    tier: "Tier 2",
    contactEmail: "secretary@easternmavericks.com.au",
    website: "http://www.easternmavericks.com.au/",
    status: "New",
    personalization: "Hills region club — growing area outside metro core",
    tags: ["district", "regional"],
  },
  {
    id: "SA-008",
    clubName: "North Adelaide Rockets",
    location: "The Lights Sports Centre",
    state: "SA",
    tier: "Tier 2",
    contactEmail: "secretary@nabc-rockets.club",
    website: "https://nabc-rockets.club/",
    status: "New",
    personalization: "Northern Adelaide club at The Lights facility",
    tags: ["district", "northern"],
  },
  // Melbourne / Victoria Clubs
  {
    id: "VIC-001",
    clubName: "Melbourne Tigers",
    location: "Melbourne Sports Centres - Parkville",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "info@melbournetigers.basketball",
    website: "https://melbournetigers.basketball/",
    status: "New",
    personalization: "NBL1 South powerhouse, 10+ NBL1 championships, pro pathway focus",
    tags: ["nbl1", "melbourne", "elite", "championship"],
  },
  {
    id: "VIC-002",
    clubName: "Knox Raiders",
    location: "Knox Basketball Stadium Boronia",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "admin@knoxbasketball.com.au",
    website: "https://www.knoxbasketball.com.au/",
    status: "New",
    personalization: "NBL1 South, historic rivalry with Kilsyth for 'The Ashes' trophy",
    tags: ["nbl1", "melbourne-east", "rivalry", "elite"],
  },
  {
    id: "VIC-003",
    clubName: "Eltham Wildcats",
    location: "Eltham High School Leisure Centre",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "info@elthamwildcats.com.au",
    website: "https://www.elthamwildcats.com.au/",
    status: "New",
    personalization: "NBL1 South, 50-year rivalry with Diamond Valley for O'Connor-Cukier Cup",
    tags: ["nbl1", "melbourne-north", "rivalry", "heritage"],
  },
  {
    id: "VIC-004",
    clubName: "Nunawading Spectres",
    location: "Nunawading Basketball Centre",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "admin@nunawadingbasketball.com.au",
    website: "https://www.nunawadingbasketball.com.au/",
    status: "New",
    personalization: "NBL1 South, Basketball Victoria heritage club, strong junior program",
    tags: ["nbl1", "melbourne-east", "heritage", "elite"],
  },
  {
    id: "VIC-005",
    clubName: "Ringwood Hawks",
    location: "Ringwood Basketball Stadium",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "info@ringwoodbasketball.com.au",
    website: "https://ringwoodhawks.nbl1.com.au/",
    status: "New",
    personalization: "NBL1 South, joined from Big V, strong community base",
    tags: ["nbl1", "melbourne-east", "community", "growth"],
  },
  {
    id: "VIC-006",
    clubName: "Dandenong Rangers",
    location: "Dandenong Stadium",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "info@dandenongstadium.com.au",
    website: "https://dandenongstadium.com.au/",
    status: "New",
    personalization: "WNBL heritage, NBL1 South, SEABL legacy club, southeastern Melbourne hub",
    tags: ["nbl1", "melbourne-south", "wnbl", "legacy"],
  },
  {
    id: "VIC-007",
    clubName: "Kilsyth Cobras",
    location: "Kilsyth Sports Centre",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "info@kilsythbasketball.com.au",
    website: "https://www.kilsythbasketball.com.au/",
    status: "New",
    personalization: "NBL1 South, historic 'Ashes' rivalry with Knox Raiders",
    tags: ["nbl1", "melbourne-east", "rivalry", "elite"],
  },
  {
    id: "VIC-008",
    clubName: "Diamond Valley Eagles",
    location: "Diamond Valley Sports Centre",
    state: "VIC",
    tier: "Tier 1",
    contactEmail: "admin@dvbasketball.com.au",
    website: "https://dvbasketball.com.au/",
    status: "New",
    personalization: "NBL1 South, 50-year rivalry with Eltham, northern Melbourne power",
    tags: ["nbl1", "melbourne-north", "rivalry", "heritage"],
  },
]

export default function LeadsPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "clubName",
      header: "Club",
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="font-semibold text-white">{row.original.clubName}</div>
          <div className="text-sm text-[#71717A]">{row.original.location}</div>
        </div>
      ),
    },
    {
      accessorKey: "tier",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 text-xs font-bold text-[#71717A] uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
        >
          Tier
          <SortIcon sorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const tier = row.original.tier
        const isWarm = tier.includes("Warm")
        const isTier1 = tier.includes("Tier 1") && !isWarm
        
        return (
          <span className={`
            inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border
            ${isWarm ? "text-amber-950 bg-amber-400 border-amber-400" : ""}
            ${isTier1 ? "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20" : ""}
            ${!isWarm && !isTier1 ? "text-[#71717A] bg-[#18181B] border-[#27272A]" : ""}
          `}>
            {tier}
          </span>
        )
      },
    },
    {
      accessorKey: "state",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 text-xs font-bold text-[#71717A] uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
        >
          State
          <SortIcon sorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#18181B] text-[#A1A1AA]">
          {row.original.state}
        </span>
      ),
    },
    {
      accessorKey: "personalization",
      header: "Context",
      cell: ({ row }) => (
        <div className="max-w-[320px] text-sm text-[#A1A1AA] line-clamp-2">
          {row.original.personalization}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <a
            href={`mailto:${row.original.contactEmail}?subject=Quick question about ${row.original.clubName}`}
            className="p-2.5 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-xl transition-all duration-200"
            title={`Email ${row.original.contactEmail}`}
          >
            <Mail size={18} />
          </a>
          <a 
            href={row.original.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2.5 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-xl transition-all duration-200"
            title={`Visit ${row.original.website}`}
          >
            <ExternalLink size={18} />
          </a>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: leadsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Basketball Clubs</h1>
          <p className="text-sm text-[#71717A] mt-2">{leadsData.length} leads researched and ready for outreach</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] bg-[#0F0F11] border border-[#27272A] rounded-xl hover:bg-[#18181B] hover:text-white hover:border-[#3F3F46] transition-all duration-200">
            <Download size={16} />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#F97316] rounded-xl hover:bg-[#FB923C] hover:shadow-lg hover:shadow-[#F97316]/20 transition-all duration-200 active:scale-[0.98]">
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
        <input
          type="text"
          placeholder="Search clubs, locations, tags..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#0F0F11] border border-[#27272A] rounded-xl text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 transition-all duration-200"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[#27272A] bg-[#09090B]">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-5 py-4 text-left font-normal">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#18181B]/50 transition-colors duration-200">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#18181B] flex items-center justify-center">
                      <Search className="text-[#3F3F46]" size={24} />
                    </div>
                    <h3 className="text-white font-semibold mb-1">No clubs found</h3>
                    <p className="text-sm text-[#71717A] mb-4">Try adjusting your search terms</p>
                    <button 
                      onClick={() => setGlobalFilter("")}
                      className="px-4 py-2 text-sm font-semibold text-[#A1A1AA] bg-[#18181B] border border-[#27272A] rounded-xl hover:bg-[#27272A] hover:text-white transition-all"
                    >
                      Clear search
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#71717A]">
          Showing <span className="font-semibold text-white">{table.getRowModel().rows.length}</span> of {leadsData.length} leads
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-sm font-semibold text-[#A1A1AA] bg-[#0F0F11] border border-[#27272A] rounded-xl hover:bg-[#18181B] hover:text-white hover:border-[#3F3F46] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0F0F11] disabled:hover:text-[#A1A1AA] disabled:hover:border-[#27272A] transition-all duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 text-sm font-semibold text-[#A1A1AA] bg-[#0F0F11] border border-[#27272A] rounded-xl hover:bg-[#18181B] hover:text-white hover:border-[#3F3F46] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0F0F11] disabled:hover:text-[#A1A1AA] disabled:hover:border-[#27272A] transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp size={14} />
  if (sorted === "desc") return <ArrowDown size={14} />
  return <ArrowUpDown size={14} className="opacity-40" />
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "New": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "Emailed": "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20",
    "Meeting Set": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "Closed": "text-[#71717A] bg-[#18181B] border-[#27272A]",
  }

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  )
}
