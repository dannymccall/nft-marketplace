import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...compat.config({
        extends: ["next"],
        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-page-custom-font': 'off',

            // Disable TypeScript-specific constraints
            // '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            ' @typescript-eslint/no-non-null-asserted-optional-chain': 'off',
            // Ignore unused variables (useful for in-progress code)
            '@typescript-eslint/no-unused-vars': 'off',

            // Suppress react-hooks exhaustive-deps warnings
            'react-hooks/exhaustive-deps': 'off',
            "prefer-const": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "react-hooks/rules-of-hooks": "off",
        },
    }),
];

export default eslintConfig;