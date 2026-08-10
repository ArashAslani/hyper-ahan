import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

type PageProps = {
  params: Promise<{ id: string }>;
};

/** Legacy PDP path → canonical catalog PDP. */
export default async function ProductDetailRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(routes.catalog.product(id));
}
