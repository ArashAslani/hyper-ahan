import { notFound } from "next/navigation";
import { OrderDetailView } from "@/features/orders/OrderDetailView";
import { profileService } from "@/services/profileService";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const orders = await profileService.getOrders();
  const order = orders.find((o) => String(o.id) === id);
  if (!order) notFound();
  return <OrderDetailView order={order} />;
}
