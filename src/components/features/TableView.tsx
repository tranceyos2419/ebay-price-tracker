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

export interface TrackingPageData {
  ebay_item_id: string;
  price: number;
  image_url: string;
  store_name: string;
  status: string;
  message: string;
  last_updated_date: string;
}

export interface KeyPageData {
  ebay_item_id: string;
  price: number;
  minimum_best_offer: number;
  image_url: string;
  title: string;
  status: string;
  message: string | undefined;
  last_updated_date: string;
}

export interface TableRowData {
  status: string;
  message: string;
  timestamp: string;
  keyPage: KeyPageData;
  page01?: TrackingPageData;
  page02?: TrackingPageData;
  page03?: TrackingPageData;
}

export interface TableViewProps {
  initialData: TableRowData[];
}

const TableView = ({ initialData }: TableViewProps) => {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const handleAddSuccess = (newRow: TableViewProps["initialData"][0]) => {
    setData((prevData) => [newRow, ...prevData]);
  };

  const handleUpdateKeyPage = (
    originalEbayId: string,
    updatedData: {
      ebay_item_id: string;
      price: number;
      minimum_best_offer: number;
    },
  ) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.keyPage.ebay_item_id === originalEbayId
          ? {
              ...row,
              keyPage: {
                ...row.keyPage,
                ebay_item_id: updatedData.ebay_item_id,
                price: updatedData.price,
                minimum_best_offer: updatedData.minimum_best_offer,
                last_updated_date: new Date().toLocaleString(),
              },
              timestamp: new Date().toLocaleString(),
            }
          : row,
      ),
    );
  };

  const handleUpdateTrackingPage = (
    originalEbayId: string,
    updatedData: { ebay_item_id: string; price: number },
  ) => {
    setData((prevData) =>
      prevData.map((row) => {
        const updatedRow = { ...row };
        if (row.page01 && row.page01.ebay_item_id === originalEbayId) {
          updatedRow.page01 = {
            ...row.page01,
            ebay_item_id: updatedData.ebay_item_id,
            price: updatedData.price,
            last_updated_date: new Date().toLocaleString(),
          };
        } else if (row.page02 && row.page02.ebay_item_id === originalEbayId) {
          updatedRow.page02 = {
            ...row.page02,
            ebay_item_id: updatedData.ebay_item_id,
            price: updatedData.price,
            last_updated_date: new Date().toLocaleString(),
          };
        } else if (row.page03 && row.page03.ebay_item_id === originalEbayId) {
          updatedRow.page03 = {
            ...row.page03,
            ebay_item_id: updatedData.ebay_item_id,
            price: updatedData.price,
            last_updated_date: new Date().toLocaleString(),
          };
        }
        updatedRow.timestamp = new Date().toLocaleString();
        return updatedRow;
      }),
    );
  };

  const handleDeleteKeyPage = (ebay_item_id: string) => {
    setData((prevData) =>
      prevData.filter((row) => row.keyPage.ebay_item_id !== ebay_item_id),
    );
  };

  const handleDeleteTrackingPage = (ebay_item_id: string) => {
    setData((prevData) =>
      prevData.map((row) => {
        const updatedRow = { ...row };
        const pages = [row.page01, row.page02, row.page03].filter(
          (page): page is TrackingPageData => !!page,
        );
        const filteredPages = pages.filter(
          (page) => page.ebay_item_id !== ebay_item_id,
        );
        updatedRow.page01 = filteredPages[0] || undefined;
        updatedRow.page02 = filteredPages[1] || undefined;
        updatedRow.page03 = filteredPages[2] || undefined;
        updatedRow.timestamp = new Date().toLocaleString();
        return updatedRow;
      }),
    );
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
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No Records Found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.keyPage.ebay_item_id}
                  className="hover:bg-gray-50"
                >
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
                    <KeyPageCard
                      {...row.keyPage}
                      onUpdate={handleUpdateKeyPage}
                      onDelete={() =>
                        handleDeleteKeyPage(row.keyPage.ebay_item_id)
                      }
                    />
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                    {row.page01 && (
                      <TrackingPageCard
                        {...row.page01}
                        onUpdate={handleUpdateTrackingPage}
                        onDelete={() =>
                          row.page01?.ebay_item_id &&
                          handleDeleteTrackingPage(row.page01.ebay_item_id)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                    {row.page02 && (
                      <TrackingPageCard
                        {...row.page02}
                        onUpdate={handleUpdateTrackingPage}
                        onDelete={() =>
                          row.page02?.ebay_item_id &&
                          handleDeleteTrackingPage(row.page02.ebay_item_id)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                    {row.page03 && (
                      <TrackingPageCard
                        {...row.page03}
                        onUpdate={handleUpdateTrackingPage}
                        onDelete={() =>
                          row.page03?.ebay_item_id &&
                          handleDeleteTrackingPage(row.page03.ebay_item_id)
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
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
