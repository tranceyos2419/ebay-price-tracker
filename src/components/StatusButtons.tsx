import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2 } from "lucide-react"; // Import Lucide icons

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
          className="text-green-600 hover:text-green-800"
          title="Data edited - click to update"
        >
          <CheckCircle2 className="h-4 w-4" /> {/* Lucide check icon */}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
          title="All good - click to delete"
        >
          <Trash2 className="h-4 w-4" /> {/* Lucide trash icon */}
        </Button>
      )}
    </div>
  );
};
