import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** Legacy path — catalog lives under /catalog. */
export default function ProductsRedirectPage() {
  redirect(routes.catalog.root);
}
