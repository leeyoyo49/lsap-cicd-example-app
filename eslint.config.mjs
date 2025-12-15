import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      // 這裡告訴 ESLint 你的程式碼運行在什麼環境
      globals: {
        ...globals.node,    // 解決 require, module 報錯
        ...globals.jest,    // 解決 describe, it, expect 報錯
      },
      sourceType: "commonjs", // 因為你使用 require() 語法
    },
  },
];