/**
 * Backend slider placements are addressed by group **slug**, agreed with the
 * admin panel (see docs/SliderModule_frontend_integration.md §2.4). Keep the
 * slug→placement mapping centralized here — components must receive the
 * slug as a prop, never hardcode it themselves.
 */
export const SLIDER_GROUPS = {
  homeHero: "home",
} as const;
