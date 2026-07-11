import { OrdersListView } from "@/features/orders/OrdersListView";
import { profileService } from "@/services/profileService";

export default async function OrdersPage() {
  const orders = await profileService.getOrders();
  return <OrdersListView orders={orders} />;
}
