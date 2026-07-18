import { notFound } from "next/navigation";
import { ArticleDetailView } from "@/features/content/ArticleDetailView";
import { articleService } from "@/services/articleService";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await articleService.getById(id);

  if (!article) {
    notFound();
  }

  return <ArticleDetailView article={article} />;
}
