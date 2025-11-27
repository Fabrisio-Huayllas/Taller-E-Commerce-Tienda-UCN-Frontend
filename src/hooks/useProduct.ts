'use client';

import { useState, useEffect } from 'react';
import { Product, ProductFilters, getProducts } from '@/services/productService';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(filters);
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching products';
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.pageNumber, filters?.pageSize, filters?.searchTerm, filters?.categoryId, filters?.brandId]);

  return { 
    products, 
    totalCount,
    totalPages,
    currentPage,
    loading, 
    error 
  };
}