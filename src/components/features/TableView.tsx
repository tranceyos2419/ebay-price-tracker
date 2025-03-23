"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import KeyPageCard from "./KeyPage";
import TrackingPageCard from "./TrackingPage";
import NavBar from "./NavBar";

export interface TableViewProps {
  initialData: {
    status: string;
    message: string;
    timestamp: string;
    keyPage: {
      ebay_item_id: string;
      price: number;
      minimum_best_offer: number;
      image_url: string;
      title: string;
      status: string;
      message: string;
      last_updated_date: string;
    };
    page01?: {
      ebay_item_id: string;
      price: number;
      image_url: string;
      store_name: string;
      status: string;
      message: string;
      last_updated_date: string;
    };
    page02?: {
      ebay_item_id: string;
      price: number;
      image_url: string;
      store_name: string;
      status: string;
      message: string;
      last_updated_date: string;
    };
    page03?: {
      ebay_item_id: string;
      price: number;
      image_url: string;
      store_name: string;
      status: string;
      message: string;
      last_updated_date: string;
    };
  }[];
}

const TableView = ({ initialData }: TableViewProps) => {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const handleAddSuccess = (newRow: TableViewProps["initialData"][0]) => {
    setData((prevData) => [newRow, ...prevData]);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar onAddSuccess={handleAddSuccess} />
      <div className="flex-1 overflow-x-auto overflow-y-auto mt-5">
        <Table
          className="border-collapse border border-gray-300"
          style={{ tableLayout: "auto", minWidth: "fit-content" }}
        >
          <TableHeader>
            <TableRow className="bg-blue-500">
              <TableHead className="w-10 text-white border border-gray-300 p-2">
                <input type="checkbox" />
              </TableHead>
              <TableHead className="text-white border border-gray-300 p-2">
                Status
              </TableHead>
              <TableHead className="text-white border border-gray-300 p-2">
                Message
              </TableHead>
              <TableHead className="text-white border border-gray-300 p-2">
                Key Page
              </TableHead>
              <TableHead className="text-white border border-gray-300 p-2">
                Page 01
              </TableHead>
              <TableHead className="text-white border border-gray-300 p-2">
                Page 02
              </TableHead>
              <TableHead className="text-white border border-gray-300 p-2">
                Page 03
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="border border-gray-300 p-2 align-top">
                  <input type="checkbox" />
                </TableCell>
                <TableCell className="border border-gray-300 p-2 align-middle text-center">
                  <div className="flex flex-col items-center">
                    <span
                      className={`inline-block px-4 py-2 rounded text-center ${
                        row.status === "Success"
                          ? "bg-green-500 text-white font-semibold"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                    <span className="text-xs text-black mt-3">
                      {row.timestamp}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="border border-gray-300 p-2 align-middle text-center">
                  <div className="flex justify-center items-center h-full">
                    {row.message}
                  </div>
                </TableCell>
                <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                  {row.keyPage && <KeyPageCard {...row.keyPage} />}
                </TableCell>
                <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                  {row.page01 && <TrackingPageCard {...row.page01} />}
                </TableCell>
                <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                  {row.page02 && <TrackingPageCard {...row.page02} />}
                </TableCell>
                <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                  {row.page03 && <TrackingPageCard {...row.page03} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 flex justify-between items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                className="cursor-pointer"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
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
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(parseInt(value))}
        >
          <SelectTrigger className="w-[180px] cursor-pointer">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="20">
              20/page
            </SelectItem>
            <SelectItem className="cursor-pointer" value="50">
              50/page
            </SelectItem>
            <SelectItem className="cursor-pointer" value="100">
              100/page
            </SelectItem>
            <SelectItem className="cursor-pointer" value="200">
              200/page
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TableView;
