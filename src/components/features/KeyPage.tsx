"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { StatusButtons } from "@/components/StatusButtons";
import toast from "react-hot-toast";
import { onUpdateKeyPage, onDeleteKeyPage } from "@/actions/dashoard";
import ConfirmationModal from "./ConfirmationModal";

interface KeyPageCardProps {
  ebay_item_id: string;
  price: number;
  minimum_best_offer: number;
  image_url: string;
  title: string;
  status: "SUCCESS" | "FAILED";
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
  status,
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
  const [isUpdating, setIsUpdating] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const [truncatedTitle, setTruncatedTitle] = useState(title);

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

  useEffect(() => {
    const truncateTitle = () => {
      if (titleRef.current) {
        const element = titleRef.current;
        const originalTitle = title;
        let truncated = originalTitle;

        // Reset to original title first
        element.textContent = originalTitle;

        // Check if text overflows
        while (
          element.scrollWidth > element.clientWidth &&
          truncated.length > 0
        ) {
          truncated = truncated.slice(0, -1);
          element.textContent = truncated + "...";
        }

        setTruncatedTitle(element.textContent || originalTitle);
      }
    };

    truncateTitle();
    window.addEventListener("resize", truncateTitle);

    return () => {
      window.removeEventListener("resize", truncateTitle);
    };
  }, [title]);

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
        <div className="flex-shrink-0 border border-gray-300 rounded-md p-1 h-[120px]">
          <Image
            src={image_url}
            alt={title}
            width={100}
            height={100}
            className="object-cover rounded-md h-full"
          />
        </div>

        <div className="flex-1 p-2 overflow-hidden">
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
          <p
            ref={titleRef}
            className="text-sm font-bold text-gray-500 mt-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
            title={title}
          >
            {truncatedTitle}
          </p>
        </div>

        <div className="flex-shrink-0 p-1">
          <StatusButtons
            hasChanges={hasChanges}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            isLoading={isUpdating}
            status={status}
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
