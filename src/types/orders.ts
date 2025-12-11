// Tipos para órdenes
export interface OrderItem {
  productId: number;
  productTitle: string;
  productDescription: string;
  mainImageURL: string;
  productImage?: string; // fallback
  quantity: number;
  priceAtMoment: number;
  priceAtMomentFormatted: string;
  price?: string | number; // fallback
  subtotal?: string | number; // fallback
}

export interface Order {
  id: number;
  code: string;
  date: string;
  status: string;
  statusName: string;
  itemsCount: number;
  total: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  userId: number;
  createdAt: string;
  updatedAt: string;
  purchasedAt?: string;
  totalFormatted?: string;
  subTotalFormatted?: string;
}

export interface GetOrdersParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface GetOrdersResponse {
  message: string;
  data: {
    orders: Order[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface GetOrderDetailResponse {
  message: string;
  data: OrderDetail;
}

export interface DownloadPdfResponse {
  url: string;
  fileName: string;
}
