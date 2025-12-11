import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ProductsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export function ProductsFilter({
  searchTerm,
  onSearchChange,
  onSearch,
}: ProductsFilterProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1 flex gap-2">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <Button onClick={onSearch}>
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  );
}
