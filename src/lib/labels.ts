import type { Product, ProfileOrder } from "@/types";

export const productUnitLabels: Record<Product["unit"], string> = {
  Kg: "کیلو",
  Ton: "تن",
  Piece: "شاخه",
};

export const orderStatusLabels: Record<ProfileOrder["status"], string> = {
  Submitted: "ثبت شده — در انتظار تماس",
  InReview: "در حال بررسی کارشناس",
  Confirmed: "تأیید شده — آماده ارسال",
  Completed: "تکمیل / تحویل",
  Cancelled: "لغو شده",
};
