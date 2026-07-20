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
