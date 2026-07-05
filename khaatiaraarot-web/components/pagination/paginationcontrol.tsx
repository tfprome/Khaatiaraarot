"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function PaginationControls({
    page,
    totalPages,
    onPageChange,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-10 flex justify-end">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() =>
                                page > 1 && onPageChange(page - 1)
                            }
                            className={
                                page === 1
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => {
                        const pageNumber = i + 1;

                        return (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    isActive={page === pageNumber}
                                    onClick={() => onPageChange(pageNumber)}
                                    className="cursor-pointer"
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                page < totalPages &&
                                onPageChange(page + 1)
                            }
                            className={
                                page === totalPages
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}