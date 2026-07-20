import { SliderAdminFormView } from "@/features/admin/sliders";

type AdminSliderEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSliderEditPage({ params }: AdminSliderEditPageProps) {
  const { id } = await params;
  return <SliderAdminFormView mode="edit" slideId={id} />;
}
