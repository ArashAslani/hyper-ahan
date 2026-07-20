import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Import-boundary guardrails for docs/architecture/folder-structure.md and
// docs/architecture/frontend-blueprint.md ("Allowed Dependency Direction").
// See docs/architecture/foundation-checklist.md -> "Import Guardrail Checklist".
const mocksOutsideServicesRule = {
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/services/**", "src/mocks/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/mocks/*", "@/mocks"],
            message:
              "Only src/services/* may import from @/mocks. See docs/architecture/folder-structure.md (src/mocks/).",
          },
        ],
      },
    ],
  },
};

const noRawFetchRule = {
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/lib/api-client.ts"],
  rules: {
    "no-restricted-globals": [
      "error",
      {
        name: "fetch",
        message:
          "UI/services must not call raw fetch. Use src/lib/api-client.ts. See .ai/constitution/project-constitution.md (Architecture Values).",
      },
    ],
  },
};

const sharedUiBoundaryRule = {
  files: ["src/shared/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/*", "@/services/*"],
            message:
              "src/shared must stay domain-neutral and must not import features or services. See docs/architecture/frontend-architecture.md (Shared Layer).",
          },
        ],
      },
    ],
  },
};

const servicesBoundaryRule = {
  files: ["src/services/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/*", "@/shared/ui/*"],
            message:
              "src/services must stay free of UI/feature imports. See docs/architecture/folder-structure.md (src/services/).",
          },
        ],
      },
    ],
  },
};

const libBoundaryRule = {
  files: ["src/lib/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/*"],
            message:
              "src/lib must stay feature-agnostic. See docs/architecture/folder-structure.md (src/lib/).",
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  mocksOutsideServicesRule,
  noRawFetchRule,
  sharedUiBoundaryRule,
  servicesBoundaryRule,
  libBoundaryRule,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
