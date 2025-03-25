"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { StatusButtons } from "@/components/StatusButtons";
import toast from "react-hot-toast";
import { onUpdateTrackingPage, onDeleteTrackingPage } from "@/actions/dashoard";
import ConfirmationModal from "./ConfirmationModal";

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
  message,
  onUpdate,
  onDelete,
  onChange,
}: TrackingPageCardProps) => {
  const [editableItemId, setEditableItemId] = useState(ebay_item_id);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        className="flex items-start justify-between p-2 bg-gray-100 rounded-lg shadow-md w-full max-w-[650px] my-1"
        data-ebay-id={ebay_item_id} // Add identifier for bulk update
      >
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
              <p className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-20">
                {price.toFixed(2)}
              </p>
            </div>
            <input
              type="text"
              value={editableItemId}
              onChange={(e) => setEditableItemId(e.target.value)}
              className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-40"
            />
          </div>
          {message && (
            <p className="text-sm font-bold text-gray-500 mt-5 truncate">
              {message}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 p-1">
          <StatusButtons
            hasChanges={hasChanges}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
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
