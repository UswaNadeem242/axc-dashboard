"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface CommonPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CommonPagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: CommonPaginationProps) => {
    const getPages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const buttonBase =
        "flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <div className="flex items-center justify-end gap-1.5 py-2">
            {/* First Page (<<) */}
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
                className={`${buttonBase} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                title="First Page"
            >
                <ChevronsLeft size={16} />
            </button>

            {/* Previous Page (<) */}
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`${buttonBase} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                title="Previous Page"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
                {getPages().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={index}
                            className="flex h-8 w-6 items-center justify-center text-sm font-medium text-gray-500"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onPageChange(Number(page))}
                            className={`${buttonBase} ${
                                currentPage === page
                                    ? "border-axc-navy bg-axc-navy text-white shadow-xs"
                                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next Page (>) */}
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`${buttonBase} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                title="Next Page"
            >
                <ChevronRight size={16} />
            </button>

            {/* Last Page (>>) */}
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                className={`${buttonBase} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                title="Last Page"
            >
                <ChevronsRight size={16} />
            </button>
        </div>
    );
};

export default CommonPagination;