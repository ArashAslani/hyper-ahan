import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Legacy weight-calc path → schema-driven tools portal. */
export default async function WeightCalcRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(routes.tools.detail(slug));
}
