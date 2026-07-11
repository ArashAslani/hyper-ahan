export const routes = {
  home: "/",
  categories: "/categories",
  products: {
    list: "/products",
    detail: (id: string | number) => `/products/${id}`,
    category: (slug: string) => `/product-category/${slug}`,
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
  articles: {
    list: "/articles",
    detail: (id: string | number) => `/articles/${id}`,
  },
  about: "/about",
  contact: "/contact",
  app: "/app",
  weightCalc: (slug: string) => `/weight-calc/${slug}`,
  phone: {
    office: "tel:03191690433",
    call: "tel:03191690433",
    mobileFooter: "tel:03191690433",
  },
} as const;
