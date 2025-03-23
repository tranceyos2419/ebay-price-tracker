"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FooterProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Footer = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: FooterProps) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className="cursor-pointer"
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Select
        value={itemsPerPage.toString()}
        onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
      >
        <SelectTrigger className="w-[180px] cursor-pointer">
          <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value="2">
            2/page
          </SelectItem>
          <SelectItem className="cursor-pointer" value="5">
            5/page
          </SelectItem>
          <SelectItem className="cursor-pointer" value="10">
            10/page
          </SelectItem>
          <SelectItem className="cursor-pointer" value="20">
            20/page
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Footer;
