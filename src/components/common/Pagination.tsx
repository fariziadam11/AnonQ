import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsCount: number;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="mt-4 rounded-neo border-2 border-neoDark bg-white p-3 sm:mt-6 sm:p-4 dark:border-white dark:bg-neoDark">
      <div className="mb-2 flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-xs text-neoDark/70 sm:text-sm dark:text-white/70">
          Showing {itemsCount} of {totalItems} items
        </p>
        <p className="text-xs text-neoDark/70 sm:text-sm dark:text-white/70">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-neo border-2 border-neoDark bg-white p-2 text-neoDark transition-all duration-200 hover:bg-neoAccent/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {renderPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`rounded-neo border-2 border-neoDark px-4 py-2 font-bold transition-all duration-200 ${
              currentPage === page
                ? 'bg-neoAccent2 text-white dark:bg-neoAccent3 dark:text-neoDark'
                : 'bg-white text-neoDark hover:bg-neoAccent/40 dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-neo border-2 border-neoDark bg-white p-2 text-neoDark transition-all duration-200 hover:bg-neoAccent/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}; 