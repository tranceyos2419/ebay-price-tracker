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
import { onAddRecord } from "@/actions/dashoard";
import {
  DataModalFormData,
  DataModalFormErrors,
  TableRowData,
} from "@/types/interfaces";

interface DataModalProps {
  onAddSuccess?: (newRow: TableRowData) => void;
}

const DataModal = ({ onAddSuccess }: DataModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for submit state
  const [formData, setFormData] = useState<DataModalFormData>({
    key_page: "",
    minimum_best_offer: undefined,
    price: undefined,
    page_01: "",
    page_02: "",
    page_03: "",
  });
  const [errors, setErrors] = useState<DataModalFormErrors>({});

  const validateItemId = (
    id: string,
    fieldName: string,
  ): string | undefined => {
    if (id && (id.length !== 12 || !/^\d+$/.test(id))) {
      return `${fieldName} must be a 12-digit number`;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: DataModalFormErrors = {};

    if (!formData.key_page.trim()) {
      newErrors.key_page = "Key Page item id is required";
      toast.error("Key Page item id is required");
    } else {
      const keyPageError = validateItemId(
        formData.key_page,
        "Key Page item id",
      );
      if (keyPageError) newErrors.key_page = keyPageError;
    }

    if (formData.page_01) {
      const page01Error = validateItemId(formData.page_01, "Page 01");
      if (page01Error) newErrors.page_01 = page01Error;
    }

    if (formData.page_02) {
      const page02Error = validateItemId(formData.page_02, "Page 02");
      if (page02Error) newErrors.page_02 = page02Error;
    }

    if (formData.page_03) {
      const page03Error = validateItemId(formData.page_03, "Page 03");
      if (page03Error) newErrors.page_03 = page03Error;
    }

    if (
      formData.minimum_best_offer !== undefined &&
      (isNaN(formData.minimum_best_offer) || formData.minimum_best_offer < 0)
    ) {
      newErrors.minimum_best_offer = "Must be a valid positive number";
      toast.error("Minimum Best Offer must be a valid positive number");
    }

    if (
      formData.price !== undefined &&
      (isNaN(formData.price) || formData.price < 0)
    ) {
      newErrors.price = "Must be a valid positive number";
      toast.error("Price must be a valid positive number");
    }

    const ids = [
      formData.key_page,
      formData.page_01,
      formData.page_02,
      formData.page_03,
    ].filter(Boolean);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      newErrors.key_page = "eBay item IDs must be unique across all fields";
      toast.error("eBay item IDs must be unique across all fields");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: DataModalFormData = {
        key_page: formData.key_page,
        ...(formData.minimum_best_offer !== undefined && {
          minimum_best_offer: formData.minimum_best_offer,
        }),
        ...(formData.price !== undefined && { price: formData.price }),
        ...(formData.page_01 && { page_01: formData.page_01 }),
        ...(formData.page_02 && { page_02: formData.page_02 }),
        ...(formData.page_03 && { page_03: formData.page_03 }),
      };

      const result = await onAddRecord(submitData);

      if (result.success && result.newRow) {
        if (onAddSuccess) onAddSuccess(result.newRow);
        setOpen(false);
        setFormData({
          key_page: "",
          minimum_best_offer: undefined,
          price: undefined,
          page_01: "",
          page_02: "",
          page_03: "",
        });
        setErrors({});
        toast.success("Record added successfully");
      } else {
        toast.error(result.message || "Failed to add record");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
          disabled={isSubmitting}
        >
          ADD
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Add New Record</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Key Page <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.key_page}
              onChange={(e) =>
                setFormData({ ...formData, key_page: e.target.value })
              }
              placeholder="Ex: 386204322430"
              className="mt-2"
              required
              disabled={isSubmitting}
            />
            {errors.key_page && (
              <p className="mt-1 text-sm text-red-500">{errors.key_page}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              Minimum Best Offer
            </label>
            <Input
              type="number"
              value={formData.minimum_best_offer || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimum_best_offer: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="Ex: 132.99"
              className="mt-2"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
            {errors.minimum_best_offer && (
              <p className="mt-1 text-sm text-red-500">
                {errors.minimum_best_offer}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <Input
              type="number"
              value={formData.price || ""}
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
          <div>
            <label className="block text-sm font-medium">Page 01</label>
            <Input
              value={formData.page_01}
              onChange={(e) =>
                setFormData({ ...formData, page_01: e.target.value })
              }
              placeholder="Ex: 386204322434"
              className="mt-2"
              disabled={isSubmitting}
            />
            {errors.page_01 && (
              <p className="mt-1 text-sm text-red-500">{errors.page_01}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Page 02</label>
            <Input
              value={formData.page_02}
              onChange={(e) =>
                setFormData({ ...formData, page_02: e.target.value })
              }
              placeholder="Ex: 386203231330"
              className="mt-2"
              disabled={isSubmitting}
            />
            {errors.page_02 && (
              <p className="mt-1 text-sm text-red-500">{errors.page_02}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Page 03</label>
            <Input
              value={formData.page_03}
              onChange={(e) =>
                setFormData({ ...formData, page_03: e.target.value })
              }
              placeholder="Ex: 342304322423"
              className="mt-2"
              disabled={isSubmitting}
            />
            {errors.page_03 && (
              <p className="mt-1 text-sm text-red-500">{errors.page_03}</p>
            )}
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="w-full mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataModal;
