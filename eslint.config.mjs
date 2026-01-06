// @ts-check
import eslintConfigNext from "eslint-config-next";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
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
