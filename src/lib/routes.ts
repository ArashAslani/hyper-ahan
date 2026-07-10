export const routes = {
  home: "/",
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
    mobileFooter: "tel:02112345678",
  },
} as const;
