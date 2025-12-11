import {
  GetOrdersParams,
  GetOrdersResponse,
  GetOrderDetailResponse,
  OrderDetail,
  Order,
} from "@/types/orders";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5043/api";

export class OrderServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "OrderServiceError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch {}
    throw new OrderServiceError(response.status, errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response as unknown as T;
}

export const ordersService = {
  async getOrders(
    token: string,
    params?: GetOrdersParams,
  ): Promise<GetOrdersResponse["data"]> {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber)
      queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize)
      queryParams.append("PageSize", params.pageSize.toString());
    if (params?.searchTerm) queryParams.append("SearchTerm", params.searchTerm);

    const url = `${API_BASE_URL}/orders/user-orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await handleResponse<GetOrdersResponse>(response);

    // Mapear purchasedAt a date si no existe
    const ordersWithDate = result.data.orders.map((order: Order) => ({
      ...order,
      date: order.date || order.purchasedAt,
    }));

    return {
      ...result.data,
      orders: ordersWithDate,
    };
  },

  async getOrderDetail(token: string, orderCode: string): Promise<OrderDetail> {
    const url = `${API_BASE_URL}/orders/detail/${orderCode}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await handleResponse<GetOrderDetailResponse>(response);
    return result.data;
  },

  async downloadOrderPdf(token: string, orderCode: string): Promise<Blob> {
    const url = `${API_BASE_URL}/orders/detail/${orderCode}/pdf`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const message =
        response.status === 404
          ? "El PDF de esta orden aún no está disponible"
          : `Error descargando PDF (${response.status})`;
      throw new OrderServiceError(response.status, message);
    }

    const blob = await response.blob();
    return blob;
  },
};
