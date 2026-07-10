import type { CategoryNode } from "@/types";

export const categoriesData: CategoryNode[] = [
  {
    id: 1,
    name: "میلگرد",
    slug: "rebar",
    children: [
      { name: "میلگرد آجدار", slug: "rebar-ridged", children: [] },
      { name: "میلگرد آلومینیوم", slug: "aluminum-rebar", children: [] },
      {
        name: "سایز میلگرد",
        slug: "rebar-size",
        children: [
          { name: "میلگرد 8", slug: "rebar-8mm", children: [] },
          { name: "میلگرد 12", slug: "rebar-12mm", children: [] },
          { name: "میلگرد 16", slug: "rebar-16mm", children: [] },
        ],
      },
      {
        name: "اندازه میلگرد",
        slug: "rebar-size-alt",
        children: [
          { name: "اندازه 8", slug: "rebar-8mm", children: [] },
          { name: "اندازه 12", slug: "rebar-12mm", children: [] },
          { name: "اندازه 16", slug: "rebar-16mm", children: [] },
        ],
      },
      {
        name: "برند میلگرد",
        slug: "rebar-brand",
        children: [
          { name: "برند 8", slug: "rebar-8mm", children: [] },
          { name: "برند 12", slug: "rebar-12mm", children: [] },
          { name: "برند 16", slug: "rebar-16mm", children: [] },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "پروفیل (قوطی)",
    slug: "profile",
    children: [
      { name: "پروفیل 20*20", slug: "profile-20x20", children: [] },
      { name: "پروفیل 40*40", slug: "profile-40x40", children: [] },
    ],
  },
  {
    id: 3,
    name: "تیرآهن",
    slug: "beam",
    children: [
      { name: "تیرآهن لانه زنبوری", slug: "honeycomb-beam", children: [] },
      { name: "هاش", slug: "h-beam", children: [] },
      {
        name: "سایز تیرآهن",
        slug: "beam-size",
        children: [
          { name: "تیرآهن 12", slug: "beam-12", children: [] },
          { name: "تیرآهن 16", slug: "beam-16", children: [] },
          { name: "تیرآهن 18", slug: "beam-18", children: [] },
        ],
      },
    ],
  },
];
