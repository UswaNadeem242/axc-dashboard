"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        const pages = [];

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


    return (
        <div className="flex items-center  justify-end    px-4 py-3">

            {/* Previous */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ChevronLeft size={16} />
                 
            </button>


            {/* Pages */}
            <div className="flex items-center gap-2">
                {getPages().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={index}
                            className="px-2 text-gray-500"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => onPageChange(Number(page))}
                            className={`h-8 w-8 rounded-full text-sm transition
                ${currentPage === page
                                    ? "bg-axc-navy text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
              `}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>


            {/* Next */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                 
                <ChevronRight size={16} />
            </button>

        </div>
    );
};

export default CommonPagination;