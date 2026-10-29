import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const config = [
  { ignores: [".next", "node_modules", "coverage", "next-env.d.ts"] },
  ...nextVitals,
  ...nextTs,
  prettier,
];

export default config;
