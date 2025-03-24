"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { StatusButtons } from "@/components/StatusButtons";
import toast from "react-hot-toast";
import { onUpdateTrackingPage, onDeleteTrackingPage } from "@/actions/dashoard";

interface TrackingPageCardProps {
  ebay_item_id: string;
  price: number;
  image_url: string;
  store_name: string;
  status: string;
  message?: string;
  last_updated_date: string;
  onUpdate: (
    originalEbayId: string,
    data: { ebay_item_id: string; price: number },
  ) => void;
  onDelete: () => void;
}

const TrackingPageCard = ({
  ebay_item_id,
  price,
  image_url,
  store_name,
  message,
  onUpdate,
  onDelete,
}: TrackingPageCardProps) => {
  const [editablePrice, setEditablePrice] = useState(price.toFixed(2));
  const [editableItemId, setEditableItemId] = useState(ebay_item_id);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Reset editable fields to props when they change
    setEditablePrice(price.toFixed(2));
    setEditableItemId(ebay_item_id);
    setHasChanges(false); // Reset hasChanges when props update
  }, [price, ebay_item_id]);

  useEffect(() => {
    const changed =
      parseFloat(editablePrice) !== price || editableItemId !== ebay_item_id;
    setHasChanges(changed);
  }, [editablePrice, editableItemId, price, ebay_item_id]);

  const validate = (): boolean => {
    if (
      !editableItemId ||
      editableItemId.length !== 12 ||
      !/^\d+$/.test(editableItemId)
    ) {
      toast.error("Tracking Page item ID must be a 12-digit number");
      return false;
    }
    if (isNaN(parseFloat(editablePrice)) || parseFloat(editablePrice) < 0) {
      toast.error("Price must be a valid positive number");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    const updatedData = {
      ebay_item_id: editableItemId,
      price: parseFloat(editablePrice),
    };

    const result = await onUpdateTrackingPage(ebay_item_id, updatedData);
    if (result.success) {
      onUpdate(ebay_item_id, updatedData);
      toast.success(result.message);
      setHasChanges(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async () => {
    const result = await onDeleteTrackingPage(ebay_item_id);
    if (result.success) {
      onDelete();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex items-start justify-between p-2 bg-gray-100 rounded-lg shadow-md w-full max-w-[650px] my-1">
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
            <input
              type="text"
              value={editablePrice}
              onChange={(e) => setEditablePrice(e.target.value)}
              className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-20"
            />
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
  );
};

export default TrackingPageCard;
