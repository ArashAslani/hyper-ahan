import { ArticleListView } from "@/features/content/ArticleListView";
import { articleService } from "@/services/articleService";

export default async function ArticlesPage() {
  const articles = await articleService.getAll();
  return <ArticleListView articles={articles} />;
}
