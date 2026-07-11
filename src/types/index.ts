export type ProductUnit = "Kg" | "Ton" | "Piece";

export type Product = {
  id: number;
  name: string;
  size: string;
  price: string;
  brand: string;
  factoryName: string;
  image: string;
  weight?: string;
  unit: ProductUnit;
  stock: number;
  grade?: string;
  loadingPlace?: string;
  type?: string;
  description?: string;
  discountPercent?: number;
};

export type CategoryNode = {
  id?: number;
  name: string;
  slug: string;
  children: CategoryNode[];
  icon?: string;
};

export type WeightCalcItem = {
  name: string;
  slug: string;
};

export type PriceRow = {
  id: number;
  product: string;
  size: string;
  grade: string;
  loadingPlace: string;
  type: string;
  price: string;
  trend: "up" | "down" | "flat";
};

export type HomeCategory = {
  id: number;
  name: string;
  icon: string;
  slug: string;
  count: number;
};

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

export type JourneyStep = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
};

export type ArticleSummary = {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
};

export type ArticleComment = {
  id: number;
  user: string;
  text: string;
  date: string;
};

export type Article = ArticleSummary & {
  author: string;
  content: string;
  comments: ArticleComment[];
};

export type CartItem = Product & {
  quantity: number;
  lockedPrice?: number;
  lockedAt?: string;
  expiresAt?: string;
};

export type ProfileUser = {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
};

export type OrderStatus =
  | "Submitted"
  | "InReview"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export type ProfileOrder = {
  id: number;
  orderNumber: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: number;
};
