import type { Config } from "tailwindcss";
const { lerpColors } = require("tailwind-lerp-colors");

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        colors: lerpColors(
            {
                score: {
                    0: "#e11d48",
                    20: "#f43f5e",
                    40: "#fda4af",
                    60: "#86efac",
                    80: "#4ade80",
                    100: "#22c55e",
                },
            },
            {
                // function options (all optional)
                includeBase: true,
                includeLegacy: false,
                lerpEnds: true,
                interval: 1,
                mode: "lrgb",
            }
        ),
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
