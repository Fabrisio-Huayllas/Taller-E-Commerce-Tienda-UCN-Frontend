"use client";

import { useRouter } from "next/navigation";
import { useOrderDetail, useDownloadOrderPdf } from "@/hooks/useOrders";
import {
  OrderDetailView,
  OrderDetailSkeleton,
  OrderDetailErrorState,
} from "@/components";

interface OrderDetailViewPageProps {
  orderCode: string;
}

export function OrderDetailViewPage({ orderCode }: OrderDetailViewPageProps) {
  const router = useRouter();
  const { order, loading, error } = useOrderDetail(orderCode);
  const {
    downloadPdf,
    downloading,
    error: downloadError,
  } = useDownloadOrderPdf();

  const handleGoBack = () => {
    router.back();
  };

  const handleDownloadPdf = async () => {
    if (order) {
      await downloadPdf(order.code);
    }
  };

  if (error) {
    return (
      <OrderDetailErrorState
        error={error}
        onRetry={() => window.location.reload()}
        onGoBack={handleGoBack}
        isLoading={loading}
      />
    );
  }

  if (loading || !order) {
    return <OrderDetailSkeleton onGoBack={handleGoBack} />;
  }

  return (
    <OrderDetailView
      order={order}
      onDownloadPdf={handleDownloadPdf}
      onGoBack={handleGoBack}
      isDownloading={downloading}
      downloadError={downloadError}
    />
  );
}
