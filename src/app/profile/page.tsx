import { ProfilePageView } from "@/features/auth/ProfilePageView";
import { profileService } from "@/services/profileService";

export default async function ProfilePage() {
  const [user, orders] = await Promise.all([
    profileService.getUser(),
    profileService.getOrders(),
  ]);

  return <ProfilePageView user={user} orders={orders} />;
}
