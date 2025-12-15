import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    // ADD THIS LINE: Only apply these settings to .js files
    files: ["**/*.js"], 
    languageOptions: {
      globals: {
        ...globals.node,    // Solves require, module errors
        ...globals.jest,    // Solves describe, it, expect errors
      },
      sourceType: "commonjs", // Correctly treats your app code as CommonJS
    },
  },
  {
    // Optional: Explicitly treat .mjs files (like this config) as modules
    files: ["**/*.mjs"],
    languageOptions: {
      sourceType: "module",
    },
  }
];