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

interface FormData {
  key_page: string;
  minimum_best_offer?: number;
  price?: number;
  page_01?: string;
  page_02?: string;
  page_03?: string;
}

interface FormErrors {
  key_page?: string;
  minimum_best_offer?: string;
  price?: string;
}

interface DataModalProps {
  onSubmit: (data: FormData) => void;
}

const DataModal = ({ onSubmit }: DataModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    key_page: "",
    minimum_best_offer: undefined,
    price: undefined,
    page_01: "",
    page_02: "",
    page_03: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.key_page.trim()) {
      newErrors.key_page = "Key Page is required";
      toast.error("Key Page is required");
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData: FormData = {
      key_page: formData.key_page,
      ...(formData.minimum_best_offer !== undefined && {
        minimum_best_offer: formData.minimum_best_offer,
      }),
      ...(formData.price !== undefined && { price: formData.price }),
      ...(formData.page_01 && { page_01: formData.page_01 }),
      ...(formData.page_02 && { page_02: formData.page_02 }),
      ...(formData.page_03 && { page_03: formData.page_03 }),
    };

    onSubmit(submitData);
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">ADD</Button>
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
            />
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
            />
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
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="w-full mt-3"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataModal;
