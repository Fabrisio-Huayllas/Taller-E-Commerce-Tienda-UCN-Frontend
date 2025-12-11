import { OrderDetailViewPage } from "@/views/order-detail-view";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const orderCode = id;

  if (!orderCode || orderCode.trim() === "") {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetailViewPage orderCode={orderCode} />
    </div>
  );
}
