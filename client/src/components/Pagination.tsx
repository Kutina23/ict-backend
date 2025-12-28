import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/10 backdrop-blur-sm">
      {showInfo && totalItems && (
        <div className="text-white/80 text-xs sm:text-sm order-2 sm:order-1">
          <span className="neon-glow">
            Showing {startItem}-{endItem} of {totalItems} items
          </span>
        </div>
      )}

      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="group flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-cyan-400/50 min-w-[36px] sm:min-w-[80px]"
        >
          <FiChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="hidden xs:inline text-xs sm:text-sm">Previous</span>
          <span className="xs:hidden text-xs sm:text-sm">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={`${page}-${index}`}>
              {page === "..." ? (
                <div className="px-2 sm:px-3 py-2 text-white/60 flex items-center justify-center">
                  <FiMoreHorizontal size={14} />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm ${
                    currentPage === page
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 neon-glow"
                      : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 hover:border-cyan-400/50 backdrop-blur-sm"
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="group flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-cyan-400/50 min-w-[36px] sm:min-w-[80px]"
        >
          <span className="hidden xs:inline text-xs sm:text-sm">Next</span>
          <span className="xs:hidden text-xs sm:text-sm">Nxt</span>
          <FiChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
}
