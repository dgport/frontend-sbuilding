import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onGenerate: () => void;
}

const EmptyState = ({ onGenerate }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Button onClick={onGenerate} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Generate Apartments
      </Button>
    </div>
  );
};

export default EmptyState;
