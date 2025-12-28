import type { ReactNode } from 'react'
import Pagination from './Pagination'

interface Column {
  key: string
  title: string
  render?: (value: any, record: any) => ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
  }
  searchable?: {
    searchTerm: string
    onSearchChange: (term: string) => void
    placeholder?: string
  }
  title?: string
  actionButton?: {
    icon: ReactNode
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
}

export default function DataTable({
  columns,
  data,
  loading = false,
  pagination,
  searchable,
  title,
  actionButton,
}: DataTableProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || searchable || actionButton) && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {title && (
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full neon-glow"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent neon-glow">
                {title}
              </h2>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchable.placeholder || 'Search...'}
                  value={searchable.searchTerm}
                  onChange={(e) => searchable.onSearchChange(e.target.value)}
                  className="w-full sm:w-80 px-4 py-3 pl-12 bg-white/10 border-2 border-white/20 rounded-xl backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none hover:border-cyan-400/40 hover:bg-white/15 hover:shadow-lg hover:shadow-cyan-400/20 transform hover:scale-[1.02]"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Action Button */}
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl relative overflow-hidden flex items-center gap-3 ${
                  actionButton.variant === 'secondary'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white'
                }`}
              >
                <div className="relative z-10 flex items-center gap-3">
                  {actionButton.icon}
                  <span className="neon-glow">{actionButton.label}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-white/20">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider ${
                      column.width ? `w-${column.width}` : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="neon-glow">{column.title}</span>
                      {column.sortable && (
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 sm:px-6 py-8 sm:py-12 text-center"
                  >
                    <div className="flex items-center justify-center gap-3 sm:gap-4 text-cyan-400">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
                      <span className="neon-glow text-sm sm:text-base">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 sm:px-6 py-8 sm:py-12 text-center text-white/60"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-white/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-white/60 text-sm sm:text-base">No data available</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/5 transition-all duration-300 group"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white/90 group-hover:text-white transition-colors duration-300"
                      >
                        {column.render
                          ? column.render(record[column.key], record)
                          : record[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
        />
      )}
    </div>
  )
}
