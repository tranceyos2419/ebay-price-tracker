import { Button } from "@/components/ui/button";

interface StatusButtonsProps {
  hasChanges: boolean;
  onDelete: () => void;
  onUpdate: () => void;
}

export const StatusButtons = ({
  hasChanges,
  onDelete,
  onUpdate,
}: StatusButtonsProps) => {
  return (
    <div className="flex gap-2">
      {hasChanges ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onUpdate}
          className="text-green-600 hover:text-green-800 h-10 w-10  cursor-pointer hover:bg-gray-200"
          title="Data edited - click to update"
        >
          ✔️
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 h-10 w-10  cursor-pointer hover:bg-gray-200"
          title="All good - click to delete"
        >
          ❌
        </Button>
      )}
    </div>
  );
};
