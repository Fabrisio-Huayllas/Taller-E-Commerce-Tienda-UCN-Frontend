"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface OrdersFilterBarProps {
  onSearch: (searchTerm: string) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

const DEBOUNCE_DELAY = 500; // ms

export function OrdersFilterBar({
  onSearch,
  onPageSizeChange,
  isLoading = false,
}: OrdersFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounce automático en onChange
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        onSearch(searchTerm);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, onSearch]);

  const handleSearch = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por código de orden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="pl-10"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <Button onClick={handleSearch} disabled={isLoading} className="px-6">
          Buscar
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          Mostrar:
        </span>
        <select
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
