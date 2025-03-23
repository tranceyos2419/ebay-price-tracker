"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import KeyPageCard from "./KeyPage";
import TrackingPageCard from "./TrackingPage";

export interface TableViewProps {
  data: {
    status: string;
    message: string;
    timestamp: string;
    keyPage?: {
      ebay_item_id: string;
      price: number;
      minimum_best_offer: number;
      image_url: string;
      title: string;
      status: string;
      message?: string;
    };
    page01?: {
      ebay_item_id: string;
      price: number;
      image_url: string;
      title: string;
      status: string;
      message?: string;
    };
    page02?: {
      ebay_item_id: string;
      price: number;
      image_url: string;
      title: string;
      status: string;
      message?: string;
    };
    page03?: {
      ebay_item_id: string;
      price: number;
      image_url: string;
      title: string;
      status: string;
      message?: string;
    };
  }[];
}

const TableView = ({ data }: TableViewProps) => {
  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
      <Table
        className="border-collapse border border-gray-300"
        style={{ tableLayout: "auto", minWidth: "fit-content" }}
      >
        <TableHeader>
          <TableRow className="bg-blue-600">
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
          {data.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="border border-gray-300 p-2 align-top">
                <input type="checkbox" />
              </TableCell>
              <TableCell className="border border-gray-300 p-2 align-top">
                <span
                  className={`inline-block px-2 py-1 rounded ${
                    row.status === "Success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell className="border border-gray-300 p-2 align-top">
                {row.message}
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
  );
};

export default TableView;
