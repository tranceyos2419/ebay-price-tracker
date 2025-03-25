"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { onAddTrackingPage } from "@/actions/dashoard";
import { TrackingPageData } from "@/types/interfaces";
import { Plus } from "lucide-react";

interface AddTrackingPageModalProps {
  keyPageId: number;
  onAddSuccess: (newTrackingPage: TrackingPageData) => void;
  position: "page01" | "page02" | "page03";
}

const AddTrackingPageModal = ({
  keyPageId,
  onAddSuccess,
  position,
}: AddTrackingPageModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    ebay_item_id: string;
    price: number | undefined;
  }>({
    ebay_item_id: "",
    price: undefined,
  });
  const [errors, setErrors] = useState<{
    ebay_item_id?: string;
    price?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { ebay_item_id?: string; price?: string } = {};

    if (!formData.ebay_item_id.trim()) {
      newErrors.ebay_item_id = "eBay Item ID is required";
    } else if (
      formData.ebay_item_id.length !== 12 ||
      !/^\d+$/.test(formData.ebay_item_id)
    ) {
      newErrors.ebay_item_id = "eBay Item ID must be a 12-digit number";
    }

    if (
      formData.price !== undefined &&
      (isNaN(formData.price) || formData.price < 0)
    ) {
      newErrors.price = "Price must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onAddTrackingPage(keyPageId, {
        ebay_item_id: formData.ebay_item_id,
        price: formData.price ?? 0,
      });

      if (result.success && result.newTrackingPage) {
        onAddSuccess(result.newTrackingPage);
        setOpen(false);
        setFormData({ ebay_item_id: "", price: undefined });
        setErrors({});
        toast.success("Tracking Page added successfully");
      } else {
        toast.error(result.message || "Failed to add tracking page");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-5xl text-gray-500 hover:text-gray-700 h-full w-full flex items-center hover:bg-gray-50 justify-center cursor-pointer mt-14"
        >
          <Plus className="h-10 w-10 cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Add New Tracking Page ({position})
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              eBay Item ID <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.ebay_item_id}
              onChange={(e) =>
                setFormData({ ...formData, ebay_item_id: e.target.value })
              }
              placeholder="Ex: 386204322434"
              className="mt-2"
              required
              disabled={isSubmitting}
            />
            {errors.ebay_item_id && (
              <p className="mt-1 text-sm text-red-500">{errors.ebay_item_id}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <Input
              type="number"
              value={formData.price ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="Ex: 140.99"
              className="mt-2"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="w-full mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Tracking Page"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrackingPageModal;
