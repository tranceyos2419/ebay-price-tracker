# Ebay Price Tracker

This app allows the users to track and perform CRUD operations on their eay store in comparison to the compititors. This is the api documentation of this application.

# Directory Structure

└── src
    ├── actions
    │   └── dashoard
    │       ├── index.ts
    ├── app
    │   └── dashboard
    │       ├── page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    ├── components
    │   ├── features
    │   │   ├── DataModal.tsx
    │   └── ui
    │       ├── Spinner.tsx
    │       ├── toggle.tsx
    │       ├── tooltip.tsx
    ├── constants
    │   ├── index.ts
    ├── lib
    │   ├── ebay.ts
    │   ├── currency.ts
    │   ├── utils.ts
    └── types
        ├── interfaces.ts
├── .env
├── .gitignore
├── Makefile
├── README.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json

# End Directory Structure

great I want to make thses changes to the app. When we sumit an item id for any of the key or tracking pages we are calling the fetchItemData method in the server actions. This operation might have errors from eay. for instance the item ID could e non existent or other error. I want this error handling to e implemented to the app. !. when trying to fetch the item data with the provided item ID (for the key page and the tracking pages) If there is an error from eay or overall during processing the data I want you to regester the error message in readale format in the message portion of the respective component(key or tracking page or oth) and the status should e update to FAILED, if the status is error I want you not to update the data in the dataase, (for creating records if there is an error create the record with the status as FAILED and the message holding the error message and for updating key and tracking pages after changing some value, if there is an error record the status of the particular component and message with the error and donot touch the other values except the item ID) 2. after creatin or updating any of the key page or the tracking page. the row's status and message can e SUCCESS and Successfully Updated repectively  only if the key page and the tracking pages(if any) have SUCCESS satus if one of them have FAILED status the status of the row should e FAILED and the message will e changed to the error message which is saved in side of the keypage or the tracking pages data(if multiple components  have FAILED status the row's message should contain there error message like this Page 01: <error message > Page 02: <error message> in vertical position. 3. Add another utton for the status which has a yellow warning sign and this is shown when a key or tracking page has a status of FAILED. if the user clicks tthe warning utton the record will go through the deletion process and get deleted however the user can edit the data in the component and the utton will ecome green tic like the oter cases where there is change and they can redo the updating and the process continues in this manner. this is a situational example with a row of one key page and one tracking page hich you can use as an example to implement the solution. 1 the user clicks ADd and adds a key page. the data gets fetched and it was successfull. 2. the user clicks on the plus ign to add a tracking page and this also is successful. 3. the user tries to change the item ID of the keypage and clicks the update utton. however eay responds with error saying the itemid is not found then the tracking page data doesnt get changesd like the image the store name and other things however the item id gets updated to the latest one which caused the error. the status is marked as FAILED and the message will ecome the item id is not found(for now just use the eay eror and later on we will create the custom errors). then the rows status ecomes FAIEDL and the message will ecome Page 01: <item not found error message from eay>. 4, then the tracking page with the error which is page 01 will have the status utton the warning one. 5. when the user click this utton the confirmation modal opens up with the message do you want to delete this data with an error if the user deletes it it will follow the existing deletionprocess and gets deleted, if the user edits the item id and other parts that might have caused the error (in this case the error came from the item id eing wrong)  hten the process repeats it self  Implement the complete solution "use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";

interface StatusButtonsProps {
  hasChanges: boolean;
  onDelete: () => void;
  onUpdate: () => void;
  isLoading?: boolean;
}

export const StatusButtons = ({
  hasChanges,
  onDelete,
  onUpdate,
  isLoading = false,
}: StatusButtonsProps) => {
  return (
    <div className="flex gap-2">
      {hasChanges ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onUpdate}
          disabled={isLoading}
          className="text-green-600 hover:text-green-800 h-10 w-10 cursor-pointer hover:bg-gray-200 disabled:opacity-50"
          title="Data edited - click to update"
        >
          {isLoading ? <Spinner /> : "✔️"}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
          className="text-red-600 hover:text-red-800 h-10 w-10 cursor-pointer hover:bg-gray-200 disabled:opacity-50"
          title="All good - click to delete"
        >
          ❌
        </Button>
      )}
    </div>
  );
};
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { StatusButtons } from "@/components/StatusButtons";
import toast from "react-hot-toast";
import { onUpdateKeyPage, onDeleteKeyPage } from "@/actions/dashoard";
import ConfirmationModal from "./ConfirmationModal";
import Spinner from "@/components/ui/Spinner";

interface KeyPageCardProps {
  ebay_item_id: string;
  price: number;
  minimum_best_offer: number;
  image_url: string;
  title: string;
  status: string;
  message?: string;
  last_updated_date: string;
  onUpdate: (
    originalEbayId: string,
    data: { ebay_item_id: string; price: number; minimum_best_offer: number },
  ) => void;
  onDelete: () => void;
  onChange: (hasChanges: boolean) => void;
}

const KeyPageCard = ({
  ebay_item_id,
  price,
  minimum_best_offer,
  image_url,
  title,
  onUpdate,
  onDelete,
  onChange,
}: KeyPageCardProps) => {
  const [editablePrice, setEditablePrice] = useState(price.toFixed(2));
  const [editableBestOffer, setEditableBestOffer] = useState(
    minimum_best_offer.toFixed(2),
  );
  const [editableItemId, setEditableItemId] = useState(ebay_item_id);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Added for update progress

  useEffect(() => {
    setEditablePrice(price.toFixed(2));
    setEditableBestOffer(minimum_best_offer.toFixed(2));
    setEditableItemId(ebay_item_id);
    setHasChanges(false);
  }, [price, minimum_best_offer, ebay_item_id]);

  useEffect(() => {
    const changed =
      parseFloat(editablePrice) !== price ||
      parseFloat(editableBestOffer) !== minimum_best_offer ||
      editableItemId !== ebay_item_id;
    if (changed !== hasChanges) {
      setHasChanges(changed);
      onChange(changed);
    }
  }, [
    editablePrice,
    editableBestOffer,
    editableItemId,
    price,
    minimum_best_offer,
    ebay_item_id,
    hasChanges,
    onChange,
  ]);

  const validate = (): boolean => {
    if (
      !editableItemId ||
      editableItemId.length !== 12 ||
      !/^\d+$/.test(editableItemId)
    ) {
      toast.error("Key Page item ID must be a 12-digit number");
      return false;
    }
    if (isNaN(parseFloat(editablePrice)) || parseFloat(editablePrice) < 0) {
      toast.error("Price must be a valid positive number");
      return false;
    }
    if (
      isNaN(parseFloat(editableBestOffer)) ||
      parseFloat(editableBestOffer) < 0
    ) {
      toast.error("Minimum Best Offer must be a valid positive number");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setIsUpdating(true);
    try {
      const updatedData = {
        ebay_item_id: editableItemId,
        price: parseFloat(editablePrice),
        minimum_best_offer: parseFloat(editableBestOffer),
      };

      const result = await onUpdateKeyPage(ebay_item_id, updatedData);
      if (result.success) {
        onUpdate(ebay_item_id, updatedData);
        setEditablePrice(updatedData.price.toFixed(2));
        setEditableBestOffer(updatedData.minimum_best_offer.toFixed(2));
        setEditableItemId(updatedData.ebay_item_id);
        setHasChanges(false);
        onChange(false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const result = await onDeleteKeyPage(ebay_item_id);
    if (result.success) {
      onDelete();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        className="flex items-start justify-between p-2 bg-gray-100 rounded-lg shadow-md w-full max-w-[1050px] my-1 relative"
        data-ebay-id={ebay_item_id}
      >
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-lg">
            <Spinner />
          </div>
        )}
        <div className="flex-shrink-0 border border-gray-300 rounded-md p-1 h-[120px]">
          <Image
            src={image_url}
            alt={title}
            width={100}
            height={100}
            className="object-cover rounded-md h-full"
          />
        </div>

        <div className="flex-1 p-2">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-1">
              <span className="font-bold text-center">$</span>
              <input
                type="text"
                value={editablePrice}
                onChange={(e) => setEditablePrice(e.target.value)}
                className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-20"
                disabled={isUpdating}
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-center">$</span>
              <input
                type="text"
                value={editableBestOffer}
                onChange={(e) => setEditableBestOffer(e.target.value)}
                className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-20"
                disabled={isUpdating}
              />
            </div>
            <input
              type="text"
              value={editableItemId}
              onChange={(e) => setEditableItemId(e.target.value)}
              className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-35"
              disabled={isUpdating}
            />
          </div>
          <p className="text-sm font-bold text-gray-500 mt-5 truncate">
            {title}
          </p>
        </div>

        <div className="flex-shrink-0 p-1">
          <StatusButtons
            hasChanges={hasChanges}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            isLoading={isUpdating}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete the key page with eBay Item ID ${ebay_item_id} and all related records? This action is irreversible.`}
      />
    </>
  );
};

export default KeyPageCard;
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { StatusButtons } from "@/components/StatusButtons";
import toast from "react-hot-toast";
import { onUpdateTrackingPage, onDeleteTrackingPage } from "@/actions/dashoard";
import ConfirmationModal from "./ConfirmationModal";
import Spinner from "@/components/ui/Spinner";

interface TrackingPageCardProps {
  ebay_item_id: string;
  price: number;
  image_url: string;
  store_name: string;
  status: string;
  message?: string;
  last_updated_date: string;
  onUpdate: (originalEbayId: string, data: { ebay_item_id: string }) => void;
  onDelete: () => void;
  onChange: (hasChanges: boolean) => void;
}

const TrackingPageCard = ({
  ebay_item_id,
  price,
  image_url,
  store_name,
  onUpdate,
  onDelete,
  onChange,
}: TrackingPageCardProps) => {
  const [editableItemId, setEditableItemId] = useState(ebay_item_id);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEditableItemId(ebay_item_id);
    setHasChanges(false);
  }, [ebay_item_id]);

  useEffect(() => {
    const changed = editableItemId !== ebay_item_id;
    if (changed !== hasChanges) {
      setHasChanges(changed);
      onChange(changed);
    }
  }, [editableItemId, ebay_item_id, hasChanges, onChange]);

  const validate = (): boolean => {
    if (
      !editableItemId ||
      editableItemId.length !== 12 ||
      !/^\d+$/.test(editableItemId)
    ) {
      toast.error("Tracking Page item ID must be a 12-digit number");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setIsUpdating(true);
    try {
      const updatedData = {
        ebay_item_id: editableItemId,
      };

      const result = await onUpdateTrackingPage(ebay_item_id, updatedData);
      if (result.success) {
        onUpdate(ebay_item_id, updatedData);
        setEditableItemId(updatedData.ebay_item_id);
        setHasChanges(false);
        onChange(false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const result = await onDeleteTrackingPage(ebay_item_id);
    if (result.success) {
      onDelete();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        className="flex items-start justify-between p-2 bg-gray-100 rounded-lg shadow-md w-full max-w-[650px] my-1 relative"
        data-ebay-id={ebay_item_id}
      >
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-lg">
            <Spinner />
          </div>
        )}
        <div className="flex-shrink-0 border border-gray-300 rounded-md p-1 h-[120px]">
          <Image
            src={image_url}
            alt={store_name || "Tracking product image"}
            width={100}
            height={100}
            className="object-cover rounded-md h-full"
          />
        </div>

        <div className="flex-1 mx-2 p-2">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-1">
              <span className="font-bold text-center">$</span>
              <p className="text-[16px] font-semibold text-gray-600  p-1 w-20">
                {price.toFixed(2)}
              </p>
            </div>
            <input
              type="text"
              value={editableItemId}
              onChange={(e) => setEditableItemId(e.target.value)}
              className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-40"
              disabled={isUpdating}
            />
          </div>
          <p className="text-sm font-bold text-gray-500 mt-5 truncate">
            {store_name}
          </p>
        </div>

        <div className="flex-shrink-0 p-1">
          <StatusButtons
            hasChanges={hasChanges}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            isLoading={isUpdating}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete the tracking page data for eBay Item ID ${ebay_item_id}? This action is irreversible.`}
      />
    </>
  );
};

export default TrackingPageCard;
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
import AddTrackingPageModal from "./AddTrackingPageModal";
import { TableRowData, TrackingPageData } from "@/types/interfaces";

export interface TableViewProps {
  initialData: TableRowData[];
}

const TableView = ({ initialData }: TableViewProps) => {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
              status: "SUCCESS",
            }
          : row,
      ),
    );
    setSelectedRows((prev) => prev.filter((id) => id !== originalEbayId));
  };

  const handleUpdateTrackingPage = (
    originalEbayId: string,
    updatedData: { ebay_item_id: string },
  ) => {
    setData((prevData) =>
      prevData.map((row) => {
        const updatedRow = { ...row };
        if (row.page01 && row.page01.ebay_item_id === originalEbayId) {
          updatedRow.page01 = {
            ...row.page01,
            ebay_item_id: updatedData.ebay_item_id,
            last_updated_date: new Date().toLocaleString(),
          };
        } else if (row.page02 && row.page02.ebay_item_id === originalEbayId) {
          updatedRow.page02 = {
            ...row.page02,
            ebay_item_id: updatedData.ebay_item_id,
            last_updated_date: new Date().toLocaleString(),
          };
        } else if (row.page03 && row.page03.ebay_item_id === originalEbayId) {
          updatedRow.page03 = {
            ...row.page03,
            ebay_item_id: updatedData.ebay_item_id,
            last_updated_date: new Date().toLocaleString(),
          };
        }
        updatedRow.timestamp = new Date().toLocaleString();
        updatedRow.status = "SUCCESS";
        return updatedRow;
      }),
    );
    const rowId = data.find((row) =>
      [row.page01, row.page02, row.page03].some(
        (page) => page?.ebay_item_id === originalEbayId,
      ),
    )?.keyPage.ebay_item_id;
    if (rowId) {
      setSelectedRows((prev) => prev.filter((id) => id !== rowId));
    }
  };

  const handleDeleteKeyPage = (ebay_item_id: string) => {
    setData((prevData) =>
      prevData.filter((row) => row.keyPage.ebay_item_id !== ebay_item_id),
    );
    setSelectedRows((prev) => prev.filter((id) => id !== ebay_item_id));
  };

  const handleDeleteTrackingPage = (ebay_item_id: string) => {
    setData((prevData) =>
      prevData.map((row) => {
        const updatedRow = { ...row };
        if (row.page01?.ebay_item_id === ebay_item_id) {
          updatedRow.page01 = undefined;
        } else if (row.page02?.ebay_item_id === ebay_item_id) {
          updatedRow.page02 = undefined;
        } else if (row.page03?.ebay_item_id === ebay_item_id) {
          updatedRow.page03 = undefined;
        }
        updatedRow.timestamp = new Date().toLocaleString();
        return updatedRow;
      }),
    );
  };

  const handleAddTrackingPage = (
    keyPageEbayId: string,
    position: "page01" | "page02" | "page03",
    newTrackingPage: TrackingPageData,
  ) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.keyPage.ebay_item_id === keyPageEbayId
          ? {
              ...row,
              [position]: newTrackingPage,
              timestamp: new Date().toLocaleString(),
              status: "SUCCESS",
            }
          : row,
      ),
    );
  };

  const toggleRowSelection = (ebay_item_id: string) => {
    setSelectedRows((prev) =>
      prev.includes(ebay_item_id)
        ? prev.filter((id) => id !== ebay_item_id)
        : [...prev, ebay_item_id],
    );
  };

  const handleRowChange = (ebay_item_id: string, hasChanges: boolean) => {
    setSelectedRows((prev) => {
      const isSelected = prev.includes(ebay_item_id);
      if (hasChanges && !isSelected) {
        return [...prev, ebay_item_id];
      } else if (!hasChanges && isSelected) {
        return prev.filter((id) => id !== ebay_item_id);
      }
      return prev;
    });
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar
        onAddSuccess={handleAddSuccess}
        selectedRows={selectedRows}
        data={data}
        setData={setData}
        setSelectedRows={setSelectedRows}
      />
      <div className="flex-1 overflow-x-auto overflow-y-auto mt-20">
        <p className="mb-3">
          <span className="font-bold">Total number of rows:</span>  {" "}
          {initialData.length}
        </p>
        <Table
          className="border-collapse border border-gray-300"
          style={{ tableLayout: "auto", minWidth: "fit-content" }}
        >
          <TableHeader>
            <TableRow className="bg-blue-500">
              <TableHead className="w-10 text-white border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer"
                  checked={paginatedData.every((row) =>
                    selectedRows.includes(row.keyPage.ebay_item_id),
                  )}
                  onChange={() => {
                    if (
                      paginatedData.every((row) =>
                        selectedRows.includes(row.keyPage.ebay_item_id),
                      )
                    ) {
                      setSelectedRows(
                        selectedRows.filter(
                          (id) =>
                            !paginatedData.some(
                              (row) => row.keyPage.ebay_item_id === id,
                            ),
                        ),
                      );
                    } else {
                      setSelectedRows([
                        ...selectedRows,
                        ...paginatedData
                          .map((row) => row.keyPage.ebay_item_id)
                          .filter((id) => !selectedRows.includes(id)),
                      ]);
                    }
                  }}
                />
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
                  className={`hover:bg-gray-50 ${
                    selectedRows.includes(row.keyPage.ebay_item_id)
                      ? "bg-gray-200"
                      : ""
                  }`}
                >
                  <TableCell className="border border-gray-300 p-2 align-middle text-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer"
                      checked={selectedRows.includes(row.keyPage.ebay_item_id)}
                      onChange={() =>
                        toggleRowSelection(row.keyPage.ebay_item_id)
                      }
                    />
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 align-middle text-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`inline-block px-4 py-2 rounded text-center ${
                          row.status === "SUCCESS"
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
                      onChange={(hasChanges) =>
                        handleRowChange(row.keyPage.ebay_item_id, hasChanges)
                      }
                    />
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                    {row.page01 ? (
                      <TrackingPageCard
                        {...row.page01}
                        onUpdate={handleUpdateTrackingPage}
                        onDelete={() =>
                          row.page01?.ebay_item_id &&
                          handleDeleteTrackingPage(row.page01.ebay_item_id)
                        }
                        onChange={(hasChanges) =>
                          handleRowChange(row.keyPage.ebay_item_id, hasChanges)
                        }
                      />
                    ) : row.keyPage.key_page_id !== undefined ? (
                      <AddTrackingPageModal
                        keyPageId={row.keyPage.key_page_id}
                        onAddSuccess={(newTrackingPage) =>
                          handleAddTrackingPage(
                            row.keyPage.ebay_item_id,
                            "page01",
                            newTrackingPage,
                          )
                        }
                        position="page01"
                      />
                    ) : (
                      <div>No Key Page ID available</div>
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                    {row.page02 ? (
                      <TrackingPageCard
                        {...row.page02}
                        onUpdate={handleUpdateTrackingPage}
                        onDelete={() =>
                          row.page02?.ebay_item_id &&
                          handleDeleteTrackingPage(row.page02.ebay_item_id)
                        }
                        onChange={(hasChanges) =>
                          handleRowChange(row.keyPage.ebay_item_id, hasChanges)
                        }
                      />
                    ) : row.keyPage.key_page_id !== undefined ? (
                      <AddTrackingPageModal
                        keyPageId={row.keyPage.key_page_id}
                        onAddSuccess={(newTrackingPage) =>
                          handleAddTrackingPage(
                            row.keyPage.ebay_item_id,
                            "page02",
                            newTrackingPage,
                          )
                        }
                        position="page02"
                      />
                    ) : (
                      <div>No Key Page ID available</div>
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 align-top min-w-[650px]">
                    {row.page03 ? (
                      <TrackingPageCard
                        {...row.page03}
                        onUpdate={handleUpdateTrackingPage}
                        onDelete={() =>
                          row.page03?.ebay_item_id &&
                          handleDeleteTrackingPage(row.page03.ebay_item_id)
                        }
                        onChange={(hasChanges) =>
                          handleRowChange(row.keyPage.ebay_item_id, hasChanges)
                        }
                      />
                    ) : row.keyPage.key_page_id !== undefined ? (
                      <AddTrackingPageModal
                        keyPageId={row.keyPage.key_page_id}
                        onAddSuccess={(newTrackingPage) =>
                          handleAddTrackingPage(
                            row.keyPage.ebay_item_id,
                            "page03",
                            newTrackingPage,
                          )
                        }
                        position="page03"
                      />
                    ) : (
                      <div>No Key Page ID available</div>
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
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import {
  AddRecordData,
  TrackingPageData,
  TableRowData,
} from "@/types/interfaces";
import { fetchEbayItemData } from "@/lib/ebay";

async function checkEbayItemIdUniqueness(
  ebay_item_id: string,
  excludeId?: string,
): Promise<boolean> {
  try {
    const [keyPage, trackingPage] = await prisma.$transaction([
      prisma.keyPage.findUnique({ where: { ebay_item_id } }),
      prisma.trackingPage.findUnique({ where: { ebay_item_id } }),
    ]);
    return (
      !(keyPage && keyPage.ebay_item_id !== excludeId) &&
      !(trackingPage && trackingPage.ebay_item_id !== excludeId)
    );
  } catch (error) {
    console.error("Error checking uniqueness:", error);
    throw error;
  }
}

export const onFetchRecords = async (): Promise<{
  initialData: TableRowData[];
}> => {
  try {
    const keyPages = await prisma.keyPage.findMany({
      include: { TrackingPage: true },
      orderBy: { last_updated_date: "desc" },
    });

    const initialData: TableRowData[] = keyPages.map((keyPage) => {
      const trackingPages = keyPage.TrackingPage || [];
      const [page01, page02, page03] = trackingPages
        .slice(0, 3)
        .map((page) => ({
          key_page_id: page.key_page_id,
          ebay_item_id: page.ebay_item_id,
          price: page.price,
          image_url: page.image_url,
          store_name: page.store_name,
          status: page.status,
          message: page.message || "",
          last_updated_date: page.last_updated_date.toLocaleString(),
        }));

      return {
        status: keyPage.status,
        message: keyPage.message || "Successfully Updated",
        timestamp: keyPage.last_updated_date.toLocaleString(),
        keyPage: {
          key_page_id: keyPage.key_page_id,
          ebay_item_id: keyPage.ebay_item_id,
          price: keyPage.price,
          minimum_best_offer: keyPage.minimum_best_offer,
          image_url: keyPage.image_url,
          title: keyPage.title,
          status: keyPage.status,
          message: keyPage.message || undefined,
          last_updated_date: keyPage.last_updated_date.toLocaleString(),
        },
        page01: page01 || undefined,
        page02: page02 || undefined,
        page03: page03 || undefined,
      };
    });

    return { initialData };
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const onAddRecord = async (
  data: AddRecordData,
): Promise<{
  success: boolean;
  message: string;
  newRow?: TableRowData;
}> => {
  try {
    const idsToCheck = [
      data.key_page_ebay_item_id,
      data.page_01,
      data.page_02,
      data.page_03,
    ].filter(Boolean) as string[];
    for (const id of idsToCheck) {
      if (!(await checkEbayItemIdUniqueness(id))) {
        return { success: false, message: `eBay Item ID ${id} already exists` };
      }
    }

    const keyPageEbayResult = await fetchEbayItemData(
      data.key_page_ebay_item_id,
    );
    if (!keyPageEbayResult.success) {
      return {
        success: false,
        message: keyPageEbayResult.error || "Failed to fetch key page data",
      };
    }
    const keyPageData = keyPageEbayResult.data!;

    const trackingPageResults = await Promise.all(
      [data.page_01, data.page_02, data.page_03]
        .filter(Boolean)
        .map((id) => fetchEbayItemData(id!)),
    );

    const result = await prisma.$transaction(async (tx) => {
      const keyPage = await tx.keyPage.create({
        data: {
          ebay_item_id: data.key_page_ebay_item_id,
          price: data.price || keyPageData.price,
          minimum_best_offer:
            data.minimum_best_offer || keyPageData.minimum_best_offer || 0,
          image_url: keyPageData.image_url,
          title: keyPageData.title,
          status: "SUCCESS",
          message: "Successfully Updated",
          last_updated_date: new Date(),
        },
      });

      await tx.item.create({
        data: { key_page_id: keyPage.key_page_id },
      });

      const trackingPagesData: Prisma.TrackingPageCreateManyInput[] = [];
      const trackingPages: TrackingPageData[] = [];

      trackingPageResults.forEach((result, index) => {
        const ebayId = [data.page_01, data.page_02, data.page_03][index];
        if (result.success && ebayId) {
          const ebayData = result.data!;
          trackingPagesData.push({
            ebay_item_id: ebayId,
            price: ebayData.price,
            image_url: ebayData.image_url,
            store_name: ebayData.store_name || `Tracking Store ${index + 1}`,
            status: "SUCCESS",
            message: "Successfully Updated",
            last_updated_date: new Date(),
            key_page_id: keyPage.key_page_id,
          });
          trackingPages.push({
            key_page_id: keyPage.key_page_id,
            ebay_item_id: ebayId,
            price: ebayData.price,
            image_url: ebayData.image_url,
            store_name: ebayData.store_name || `Tracking Store ${index + 1}`,
            status: "SUCCESS",
            message: "Successfully Updated",
            last_updated_date: new Date().toLocaleString(),
          });
        } else if (ebayId) {
          trackingPagesData.push({
            ebay_item_id: ebayId,
            price: 0,
            image_url: "",
            store_name: `Tracking Store ${index + 1}`,
            status: "FAILED",
            message: result.error || "Failed to fetch tracking page data",
            last_updated_date: new Date(),
            key_page_id: keyPage.key_page_id,
          });
          trackingPages.push({
            key_page_id: keyPage.key_page_id,
            ebay_item_id: ebayId,
            price: 0,
            image_url: "",
            store_name: `Tracking Store ${index + 1}`,
            status: "FAILED",
            message: result.error || "Failed to fetch tracking page data",
            last_updated_date: new Date().toLocaleString(),
          });
        }
      });

      if (trackingPagesData.length > 0) {
        await tx.trackingPage.createMany({ data: trackingPagesData });
      }

      const newRow: TableRowData = {
        status: "SUCCESS",
        message: "New Item Added",
        timestamp: new Date().toLocaleString(),
        keyPage: {
          key_page_id: keyPage.key_page_id,
          ebay_item_id: keyPage.ebay_item_id,
          price: keyPage.price,
          minimum_best_offer: keyPage.minimum_best_offer,
          image_url: keyPage.image_url,
          title: keyPage.title,
          status: keyPage.status,
          message: keyPage.message,
          last_updated_date: keyPage.last_updated_date.toLocaleString(),
        },
        page01: trackingPages[0],
        page02: trackingPages[1],
        page03: trackingPages[2],
      };

      return newRow;
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Record added successfully",
      newRow: result,
    };
  } catch (error) {
    console.error("Error adding record:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, message: `Failed to add record: ${errorMessage}` };
  }
};

export const onUpdateKeyPage = async (
  ebay_item_id: string,
  data: { price: number; minimum_best_offer: number; ebay_item_id: string },
): Promise<{ success: boolean; message: string }> => {
  try {
    if (
      data.ebay_item_id !== ebay_item_id &&
      !(await checkEbayItemIdUniqueness(data.ebay_item_id, ebay_item_id))
    ) {
      return {
        success: false,
        message: `eBay Item ID ${data.ebay_item_id} already exists`,
      };
    }

    const ebayResult = await fetchEbayItemData(data.ebay_item_id);
    if (!ebayResult.success) {
      return {
        success: false,
        message: ebayResult.error || "Failed to fetch key page data",
      };
    }
    const ebayData = ebayResult.data!;

    await prisma.keyPage.update({
      where: { ebay_item_id },
      data: {
        ebay_item_id: data.ebay_item_id,
        price: data.price || ebayData.price,
        minimum_best_offer:
          data.minimum_best_offer || ebayData.minimum_best_offer || 0,
        image_url: ebayData.image_url,
        title: ebayData.title,
        status: "SUCCESS",
        message: "Successfully Updated",
        last_updated_date: new Date(),
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Key Page updated successfully" };
  } catch (error) {
    console.error("Error updating key page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to update key page: ${errorMessage}`,
    };
  }
};

export const onUpdateTrackingPage = async (
  originalEbayId: string,
  data: { ebay_item_id: string },
): Promise<{ success: boolean; message: string }> => {
  try {
    if (data.ebay_item_id !== originalEbayId) {
      if (!(await checkEbayItemIdUniqueness(data.ebay_item_id))) {
        return {
          success: false,
          message: `eBay Item ID ${data.ebay_item_id} already exists`,
        };
      }
    }

    const ebayResult = await fetchEbayItemData(data.ebay_item_id);
    const status = ebayResult.success ? "SUCCESS" : "FAILED";
    const message = ebayResult.success
      ? "Successfully Updated"
      : ebayResult.error || "Failed to fetch tracking page data";

    await prisma.trackingPage.update({
      where: { ebay_item_id: originalEbayId },
      data: {
        ebay_item_id: data.ebay_item_id,
        price: ebayResult.success ? ebayResult.data!.price : 0,
        image_url: ebayResult.success ? ebayResult.data!.image_url : "",
        store_name: ebayResult.success
          ? ebayResult.data!.store_name || "Tracking Store"
          : "Tracking Store",
        status,
        message,
        last_updated_date: new Date(),
      },
    });

    revalidatePath("/dashboard");
    return { success: ebayResult.success, message };
  } catch (error) {
    console.error("Error updating tracking page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to update tracking page: ${errorMessage}`,
    };
  }
};

export const onDeleteKeyPage = async (
  ebay_item_id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const keyPage = await prisma.keyPage.findUnique({
      where: { ebay_item_id },
    });
    if (!keyPage) {
      return { success: false, message: "Key Page not found" };
    }

    await prisma.$transaction([
      prisma.trackingPage.deleteMany({
        where: { key_page_id: keyPage.key_page_id },
      }),
      prisma.item.deleteMany({ where: { key_page_id: keyPage.key_page_id } }),
      prisma.keyPage.delete({ where: { ebay_item_id } }),
    ]);

    revalidatePath("/dashboard");
    return { success: true, message: "Key Page and associated data deleted" };
  } catch (error) {
    console.error("Error deleting key page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to delete key page: ${errorMessage}`,
    };
  }
};

export const onDeleteTrackingPage = async (
  ebay_item_id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const trackingPage = await prisma.trackingPage.findUnique({
      where: { ebay_item_id },
    });
    if (!trackingPage) {
      return { success: false, message: "Tracking Page not found" };
    }

    await prisma.trackingPage.delete({
      where: { ebay_item_id },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Tracking Page deleted" };
  } catch (error) {
    console.error("Error deleting tracking page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to delete tracking page: ${errorMessage}`,
    };
  }
};

export const onAddTrackingPage = async (
  keyPageId: number,
  data: { ebay_item_id: string },
): Promise<{
  success: boolean;
  message: string;
  newTrackingPage?: TrackingPageData;
}> => {
  try {
    if (!(await checkEbayItemIdUniqueness(data.ebay_item_id))) {
      return {
        success: false,
        message: `eBay Item ID ${data.ebay_item_id} already exists`,
      };
    }

    const keyPage = await prisma.keyPage.findUnique({
      where: { key_page_id: keyPageId },
    });
    if (!keyPage) {
      return { success: false, message: "Key Page not found" };
    }

    const ebayResult = await fetchEbayItemData(data.ebay_item_id);
    const status = ebayResult.success ? "SUCCESS" : "FAILED";
    const message = ebayResult.success
      ? "Successfully Updated"
      : ebayResult.error || "Failed to fetch tracking page data";

    const newTrackingPage = await prisma.trackingPage.create({
      data: {
        ebay_item_id: data.ebay_item_id,
        price: ebayResult.success ? ebayResult.data!.price : 0,
        image_url: ebayResult.success ? ebayResult.data!.image_url : "",
        store_name: ebayResult.success
          ? ebayResult.data!.store_name || "Tracking Store"
          : "Tracking Store",
        status,
        message,
        last_updated_date: new Date(),
        key_page_id: keyPageId,
      },
    });

    const trackingPageData: TrackingPageData = {
      key_page_id: newTrackingPage.key_page_id,
      ebay_item_id: newTrackingPage.ebay_item_id,
      price: newTrackingPage.price,
      image_url: newTrackingPage.image_url,
      store_name: newTrackingPage.store_name,
      status: newTrackingPage.status,
      message: newTrackingPage.message || "",
      last_updated_date: newTrackingPage.last_updated_date.toLocaleString(),
    };

    revalidatePath("/dashboard");
    return {
      success: ebayResult.success,
      message,
      newTrackingPage: trackingPageData,
    };
  } catch (error) {
    console.error("Error adding tracking page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to add tracking page: ${errorMessage}`,
    };
  }
};
import axios from "axios";
import { EbayApiErrorResponse, EbayItemResponse } from "@/types/interfaces";

const ebayApi = axios.create({
  baseURL: "https://api.ebay.com/buy/browse/v1",
  headers: {
    "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    Accept: "application/json",
  },
});

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

async function getOAuthToken(): Promise<string> {
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration - 60000) {
    return cachedToken;
  }

  const CLIENT_ID =
    process.env.EBAY_CLIENT_ID || "Yoshinor-tranceyo-PRD-8e572b069-bf0b04cb";
  const CLIENT_SECRET =
    process.env.EBAY_CLIENT_SECRET || "PRD-e572b069529e-a6a1-46af-8739-d426";

  try {
    const response = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        },
      },
    );
    cachedToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000;
    return cachedToken!;
  } catch (error) {
    console.error("Failed to get OAuth token:", error);
    throw new Error("Authentication failed");
  }
}

export async function fetchEbayItemData(itemId: string): Promise<{
  success: boolean;
  data?: {
    price: number;
    minimum_best_offer?: number;
    image_url: string;
    title: string;
    store_name?: string;
  };
  error?: string;
}> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const token = await getOAuthToken();
      const response = await ebayApi.get<EbayItemResponse>(
        `/item/v1|${itemId}|0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        },
      );

      const item = response.data;
      return {
        success: true,
        data: {
          price: parseFloat(item.price.value),
          minimum_best_offer: item.buyingOptions.includes("BEST_OFFER")
            ? parseFloat(item.price.value) * 0.8
            : undefined,
          image_url: item.image.imageUrl,
          title: item.title,
          store_name: item.seller.store_name
            ? item.seller.store_name
            : item.seller.username,
        },
      };
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? (error.response?.data as EbayApiErrorResponse)?.errors?.[0]
            ?.message || error.message
        : "Unknown error";
      if (attempt === MAX_RETRIES) {
        return {
          success: false,
          error: `Failed to fetch eBay item ${itemId} after ${MAX_RETRIES} attempts: ${errorMessage}`,
        };
      }
      const delay = BASE_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return { success: false, error: "Unexpected retry failure" };
}
export interface AddRecordData {
  key_page_ebay_item_id: string;
  minimum_best_offer?: number;
  price?: number;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

export interface DataModalFormData {
  key_page_ebay_item_id: string;
  minimum_best_offer?: number;
  price?: number;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

export interface DataModalFormErrors {
  key_page_ebay_item_id?: string;
  minimum_best_offer?: string;
  price?: string;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

export interface TrackingPageData {
  key_page_id: number;
  ebay_item_id: string;
  price: number;
  image_url: string;
  store_name: string;
  status: "SUCCESS" | "FAILED";
  message: string;
  last_updated_date: string;
}

export interface KeyPageData {
  key_page_id: number;
  ebay_item_id: string;
  price: number;
  minimum_best_offer: number;
  image_url: string;
  title: string;
  status: "SUCCESS" | "FAILED";
  message: string | undefined;
  last_updated_date: string;
}

export interface TableRowData {
  status: "SUCCESS" | "FAILED";
  message: string;
  timestamp: string;
  keyPage: KeyPageData;
  page01?: TrackingPageData;
  page02?: TrackingPageData;
  page03?: TrackingPageData;
}

export interface Price {
  value: string;
  currency: string;
}

export interface Image {
  imageUrl: string;
  width: number;
  height: number;
}

export interface Seller {
  username: string;
  feedbackPercentage: string;
  feedbackScore: number;
  store_name?: string;
}

export interface EbayItemResponse {
  itemId: string;
  sellerItemRevision?: string;
  title: string;
  shortDescription?: string;
  price: Price;
  minimum_best_offer?: number;
  image: Image;
  seller: Seller;
  buyingOptions: string[];
  description?: string;
  legacyItemId?: string;
}

export interface EbayApiErrorResponse {
  errors?: Array<{
    message?: string;
    longMessage?: string;
  }>;
}
