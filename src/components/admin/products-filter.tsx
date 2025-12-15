import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, Brand } from "@/services/catalogService";

interface ProductsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  categories: Category[];
  brands: Brand[];
  selectedCategory?: number;
  selectedBrand?: number;
  selectedStatus?: string;
  onCategoryChange: (categoryId?: number) => void;
  onBrandChange: (brandId?: number) => void;
  onStatusChange: (status?: string) => void;
}

export function ProductsFilter({
  searchTerm,
  onSearchChange,
  onSearch,
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedStatus,
  onCategoryChange,
  onBrandChange,
  onStatusChange,
}: ProductsFilterProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Búsqueda */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="flex-1"
        />
        <Button onClick={onSearch}>
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) =>
              onCategoryChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&>option]:bg-white [&>option]:text-gray-900 [&>option:checked]:bg-blue-600 [&>option:checked]:text-white dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-100"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Marca */}
        <div>
          <label className="block text-sm font-medium mb-1">Marca</label>
          <select
            value={selectedBrand || ""}
            onChange={(e) =>
              onBrandChange(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&>option]:bg-white [&>option]:text-gray-900 [&>option:checked]:bg-blue-600 [&>option:checked]:text-white dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-100"
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Estado */}
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            value={selectedStatus || ""}
            onChange={(e) => onStatusChange(e.target.value || undefined)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&>option]:bg-white [&>option]:text-gray-900 [&>option:checked]:bg-blue-600 [&>option:checked]:text-white dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-100"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>
    </div>
  );
}
