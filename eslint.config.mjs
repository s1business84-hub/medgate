// @ts-check
import eslintConfigNext from "eslint-config-next";

const config = [
  {
    // components/reui/** is installed, unmodified third-party registry code
    // (reui.io). Linting it against this project's rules only surfaces
    // violations we can't fix without diverging from upstream, and any
    // future `shadcn add` re-install would overwrite hand-fixes anyway.
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "components/reui/**"],
  },
  ...eslintConfigNext,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default config;
