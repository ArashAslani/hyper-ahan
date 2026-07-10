import { profileOrdersMock, profileUserMock } from "@/mocks/home";
import type { ProfileOrder, ProfileUser } from "@/types";

export const profileService = {
  getUser(): Promise<ProfileUser> {
    return Promise.resolve(profileUserMock);
  },

  getOrders(): Promise<ProfileOrder[]> {
    return Promise.resolve(profileOrdersMock);
  },
};
