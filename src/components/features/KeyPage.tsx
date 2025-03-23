"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { StatusButtons } from "@/components/StatusButtons";

interface KeyPageCardProps {
  ebay_item_id: string;
  price: number;
  minimum_best_offer: number;
  image_url: string;
  title: string;
  status: string;
  message?: string;
}

const KeyPageCard = ({
  ebay_item_id,
  price,
  minimum_best_offer,
  image_url,
  title,
}: KeyPageCardProps) => {
  const [editablePrice, setEditablePrice] = useState(price.toFixed(2));
  const [editableBestOffer, setEditableBestOffer] = useState(
    minimum_best_offer.toFixed(2),
  );
  const [editableItemId, setEditableItemId] = useState(ebay_item_id);
  const [isDeleted, setIsDeleted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      parseFloat(editablePrice) !== price ||
      parseFloat(editableBestOffer) !== minimum_best_offer ||
      editableItemId !== ebay_item_id;
    setHasChanges(changed);
  }, [
    editablePrice,
    editableBestOffer,
    editableItemId,
    price,
    minimum_best_offer,
    ebay_item_id,
  ]);

  const handleDelete = () => setIsDeleted(true);
  const handleUpdate = () => {
    console.log("Updating data:", {
      ebay_item_id: editableItemId,
      price: editablePrice,
      minimum_best_offer: editableBestOffer,
    });
    setHasChanges(false);
  };

  if (isDeleted) return null;

  return (
    <div className="flex items-start justify-between p-2 bg-gray-100 rounded-lg shadow-md w-full max-w-[1050px] my-1">
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
        <div className="flex items-start gap-1">
          <input
            type="text"
            value={editablePrice}
            onChange={(e) => setEditablePrice(e.target.value)}
            className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-15"
          />
          <input
            type="text"
            value={editableBestOffer}
            onChange={(e) => setEditableBestOffer(e.target.value)}
            className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md p-1 w-15"
          />
          <input
            type="text"
            value={editableItemId}
            onChange={(e) => setEditableItemId(e.target.value)}
            className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-md  p-1 w-40"
          />
        </div>
        <p className="text-xs font-semibold text-gray-500 mt-1 truncate">
          {title}
        </p>
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

export default KeyPageCard;
