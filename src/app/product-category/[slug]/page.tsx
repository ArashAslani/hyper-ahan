import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** Legacy slug categories → catalog root (categories are id-based). */
export default function ProductCategoryRedirectPage() {
  redirect(routes.catalog.root);
}
