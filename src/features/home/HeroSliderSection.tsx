import { HeroSection } from "@/features/home/HeroSection";
import { sliderService } from "@/services/sliderService";
import { SLIDER_GROUPS } from "@/config/sliderGroups";

/**
 * Streams independently from the rest of the Home page (see Suspense
 * boundary in HomePageView) so a slow/unreachable slider API never blocks
 * the rest of the page — `sliderService.getGroup` already degrades to `[]`
 * on any error, so this can render an empty hero without crashing.
 */
export async function HeroSliderSection() {
  const slides = await sliderService.getGroup(SLIDER_GROUPS.homeHero);
  return <HeroSection slides={slides} />;
}
