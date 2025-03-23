"use client";

import { useState } from "react";
import NavBar from "@/components/features/NavBar";
import TableView, { TableViewProps } from "@/components/features/TableView";
import Footer from "@/components/features/Footer";

const tableData: TableViewProps = {
  data: [
    {
      status: "Success",
      message: "Successfully Updated",
      timestamp: "03/22/11:22:49",
      keyPage: {
        ebay_item_id: "386719525691",
        price: 309.99,
        minimum_best_offer: 288.99,
        image_url: "/test.jpg",
        title: "TECH21 SansAmp Classic E",
        status: "active",
        message: "Key Page*", // Include the message property
      },
      page01: {
        ebay_item_id: "386719525691",
        price: 138.98,
        image_url: "/test.jpg",
        title: "King Jim Pomeran Digital Memo Tool DM100",
        status: "active",
        message: undefined, // Optional, can be undefined
      },
      page02: {
        ebay_item_id: "386719525691",
        price: 149.0,
        image_url: "/test.jpg",
        title: "maximaki-dream-japan",
        status: "inactive",
        message: undefined,
      },
      page03: {
        ebay_item_id: "139.08",
        price: 0,
        image_url: "/test.jpg",
        title: "japan_fun_select",
        status: "inactive",
        message: undefined,
      },
    },
    {
      status: "Success",
      message: "Successfully Updated",
      timestamp: "03/22/11:22:49",
      keyPage: {
        ebay_item_id: "386719525691",
        price: 309.99,
        minimum_best_offer: 288.99,
        image_url: "/test.jpg",
        title: "TECH21 SansAmp Classic E",
        status: "active",
        message: "Key Page*", // Include the message property
      },
      page01: {
        ebay_item_id: "386719525691",
        price: 138.98,
        image_url: "/test.jpg",
        title: "King Jim Pomeran Digital Memo Tool DM100",
        status: "active",
        message: undefined, // Optional, can be undefined
      },
      page02: {
        ebay_item_id: "386719525691",
        price: 149.0,
        image_url: "/test.jpg",
        title: "maximaki-dream-japan",
        status: "inactive",
        message: "some text",
      },
      page03: {
        ebay_item_id: "139.08",
        price: 0,
        image_url: "/test.jpg",
        title: "japan_fun_select",
        status: "inactive",
        message: "some text",
      },
    },
    {
      status: "Success",
      message: "Successfully Updated",
      timestamp: "03/22/11:22:49",
      keyPage: {
        ebay_item_id: "386719525691",
        price: 309.99,
        minimum_best_offer: 288.99,
        image_url: "/test.jpg",
        title: "TECH21 SansAmp Classic E",
        status: "active",
        message: "Key Page*", // Include the message property
      },
      page01: {
        ebay_item_id: "386719525691",
        price: 138.98,
        image_url: "/test.jpg",
        title: "King Jim Pomeran Digital Memo Tool DM100",
        status: "active",
        message: "some text", // Optional, can be "some text"
      },
      page02: {
        ebay_item_id: "386719525691",
        price: 149.0,
        image_url: "/test.jpg",
        title: "maximaki-dream-japan",
        status: "inactive",
        message: "some text",
      },
      page03: {
        ebay_item_id: "139.08",
        price: 0,
        image_url: "/test.jpg",
        title: "japan_fun_select",
        status: "inactive",
        message: "some text",
      },
    },
    {
      status: "Success",
      message: "Successfully Updated",
      timestamp: "03/22/11:22:49",
      keyPage: {
        ebay_item_id: "386719525691",
        price: 309.99,
        minimum_best_offer: 288.99,
        image_url: "/test.jpg",
        title: "TECH21 SansAmp Classic E",
        status: "active",
        message: "Key Page*", // Include the message property
      },
      page01: {
        ebay_item_id: "386719525691",
        price: 138.98,
        image_url: "/test.jpg",
        title: "King Jim Pomeran Digital Memo Tool DM100",
        status: "active",
        message: "some text", // Optional, can be "some text"
      },
      page02: {
        ebay_item_id: "386719525691",
        price: 149.0,
        image_url: "/test.jpg",
        title: "maximaki-dream-japan",
        status: "inactive",
        message: "some text",
      },
      page03: {
        ebay_item_id: "139.08",
        price: 0,
        image_url: "/test.jpg",
        title: "japan_fun_select",
        status: "inactive",
        message: "some text",
      },
    },
    {
      status: "Error",
      message: "Key Page: Quantity is 0",
      timestamp: "03/22/11:22:49",
      keyPage: {
        ebay_item_id: "297081609809",
        price: 0.38,
        minimum_best_offer: 0,
        image_url: "/test.jpg",
        title: "itsonlinejp",
        status: "inactive",
        message: "some text", // Optional, can be "some text"
      },
      page01: {
        ebay_item_id: "355331298628",
        price: 310.39,
        image_url: "/test.jpg",
        title: "spice-japan",
        status: "inactive",
        message: "some text",
      },
    },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState(tableData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const totalPages = Math.ceil(data.data.length / itemsPerPage);
  const paginatedData = data.data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAdd = (newItem: {
    ebay_item_id: string;
    price: number;
    minimum_best_offer: number;
    tracking_page_id_01: string;
    tracking_page_id_02: string;
    tracking_page_id_03: string;
  }) => {
    const newRow: TableViewProps["data"][0] = {
      status: "Success",
      message: "New Item Added",
      timestamp: new Date().toLocaleString(),
      keyPage: {
        ebay_item_id: newItem.ebay_item_id,
        price: newItem.price,
        minimum_best_offer: newItem.minimum_best_offer,
        image_url: "/test.jpg",
        title: "New Item",
        status: "active",
        message: undefined,
      },
      page01: {
        ebay_item_id: newItem.tracking_page_id_01,
        price: newItem.price,
        image_url: "/test.jpg",
        title: "Tracking Page 01",
        status: "active",
        message: undefined,
      },
      page02: {
        ebay_item_id: newItem.tracking_page_id_02,
        price: newItem.price,
        image_url: "/test.jpg",
        title: "Tracking Page 02",
        status: "active",
        message: undefined,
      },
      page03: {
        ebay_item_id: newItem.tracking_page_id_03,
        price: newItem.price,
        image_url: "/test.jpg",
        title: "Tracking Page 03",
        status: "active",
        message: undefined,
      },
    };

    setData((prevData) => [...prevData, newRow]);
  };
  return (
    <div className="p-4 min-h-screen flex flex-col">
      <NavBar onAdd={handleAdd} />
      <div className="flex-1 mt-5">
        <TableView data={paginatedData} />
      </div>
      <Footer
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
