"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";

interface StatusButtonsProps {
  hasChanges: boolean;
  onDelete: () => void;
  onUpdate: () => void;
  isLoading?: boolean;
  status: "SUCCESS" | "FAILED";
}

export const StatusButtons = ({
  hasChanges,
  onDelete,
  onUpdate,
  isLoading = false,
  status,
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
      ) : status === "FAILED" ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
          className="text-yellow-600 hover:text-yellow-800 h-10 w-10 cursor-pointer hover:bg-gray-200 disabled:opacity-50"
          title="Warning: Failed status - click to delete"
        >
          {isLoading ? <Spinner /> : "⚠️"}
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
          {isLoading ? <Spinner /> : "❌"}
        </Button>
      )}
    </div>
  );
};
