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

/**
 * Unified image contract returned by every backend module (Slider, Blog,
 * Catalog, ...) — see docs/FileModule_frontend_integration.md.
 */
export type FileDto = {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
};

export type SliderButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link";

export type SliderTextAlignment = "start" | "center" | "end" | "left" | "right";

/** `PublicSliderResponseDto` — GET /api/sliders/group/{groupSlug} */
export type PublicSlide = {
  id: string;
  title: string;
  description?: string | null;
  image: FileDto | null;
  mobileImage: FileDto | null;
  images: FileDto[];
  link: string;
  openInNewTab: boolean;
  buttonText?: string | null;
  buttonVariant?: SliderButtonVariant | null;
  overlayOpacity?: number | null;
  textAlignment?: SliderTextAlignment | null;
  displayOrder: number;
  priority: number;
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

export type AdminLoginRequest = {
  username: string;
  password: string;
};

export type AdminLoginResponse = {
  adminId: string;
  accessToken: string;
};

export type BlogAuthor = {
  id: string;
  name: string;
  /** Backend has no author-avatar field today; kept for forward-compat with the File contract. */
  avatar: FileDto | null;
  role?: string;
  bio?: string;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogSortBy =
  | "PublishDateDesc"
  | "PublishDateAsc"
  | "VisitDesc"
  | "VisitAsc"
  | "TitleAsc"
  | "TitleDesc";

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Backend File contract (docs/FileModule_frontend_integration.md §8) — render via `AppImage`. */
  image: FileDto | null;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt: string | null;
  readingTimeMinutes: number;
  tags: string[];
  visits: number;
};

export type BlogPost = BlogPostSummary & {
  bodyHtml: string;
  headings: BlogHeading[];
  metaTitle: string;
  metaDescription: string;
  canonicalSlug: string | null;
};

export type BlogListResult = {
  items: BlogPostSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
