import nextVitals from "eslint-config-next/core-web-vitals";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".tools/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
];

export default eslintConfig;
