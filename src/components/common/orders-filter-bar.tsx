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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex gap-2 flex-1">
        <Input
          placeholder="Buscar por código de orden..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>

      <select
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        disabled={isLoading}
        className="px-3 py-2 border rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-700"
      >
        <option value={10}>10 por página</option>
        <option value={20}>20 por página</option>
        <option value={50}>50 por página</option>
      </select>
    </div>
  );
}
