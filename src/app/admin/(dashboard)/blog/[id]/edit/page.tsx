import { BlogAdminFormView } from "@/features/admin/blog";

type AdminBlogEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogEditPage({ params }: AdminBlogEditPageProps) {
  const { id } = await params;
  return <BlogAdminFormView mode="edit" postId={id} />;
}
