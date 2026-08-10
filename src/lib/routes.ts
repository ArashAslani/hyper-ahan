export const routes = {
  home: "/",
  categories: "/catalog",
  catalog: {
    root: "/catalog",
    category: (id: string) => `/catalog/categories/${id}`,
    product: (id: string) => `/catalog/products/${id}`,
    factory: (id: string) => `/catalog/factories/${id}`,
  },
  products: {
    /** @deprecated use routes.catalog.root */
    list: "/catalog",
    /** @deprecated use routes.catalog.product */
    detail: (id: string | number) => `/catalog/products/${id}`,
    /** @deprecated use routes.catalog.category */
    category: (id: string) => `/catalog/categories/${id}`,
  },
  cart: "/cart",
  checkout: "/checkout",
  auth: {
    login: "/login",
    register: "/register",
  },
  profile: "/profile",
  orders: {
    list: "/orders",
    detail: (id: string | number) => `/orders/${id}`,
  },
  search: "/search",
  tools: {
    list: "/tools",
    detail: (slug: string) => `/tools/calculators/${slug}`,
    /** Tool page with optional PDP handoff context. */
    detailWithProduct: (slug: string, productId: string, returnPath?: string) => {
      const q = new URLSearchParams({ productId });
      if (returnPath) q.set("return", returnPath);
      return `/tools/calculators/${slug}?${q.toString()}`;
    },
    listWithProduct: (productId: string) =>
      `/tools?productId=${encodeURIComponent(productId)}`,
  },
  articles: {
    list: "/articles",
    detail: (id: string | number) => `/articles/${id}`,
  },
  blog: {
    list: "/blog",
    detail: (slug: string) => `/blog/${slug}`,
    category: (slug: string) => `/blog/category/${slug}`,
  },
  admin: {
    login: "/admin/login",
    dashboard: "/admin",
    blog: {
      list: "/admin/blog",
      new: "/admin/blog/new",
      edit: (id: string) => `/admin/blog/${id}/edit`,
    },
    sliders: {
      list: "/admin/sliders",
      new: "/admin/sliders/new",
      edit: (id: string) => `/admin/sliders/${id}/edit`,
    },
    catalog: {
      root: "/admin/catalog",
      categories: "/admin/catalog/categories",
      factories: "/admin/catalog/factories",
    },
    search: "/admin/search",
  },
  about: "/about",
  contact: "/contact",
  app: "/app",
  /** @deprecated use routes.tools.detail */
  weightCalc: (slug: string) => `/tools/calculators/${slug}`,
  phone: {
    office: "tel:03191690433",
    call: "tel:03191690433",
    mobileFooter: "tel:03191690433",
  },
} as const;
