import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: 'Open Sauce One, sans-serif',
        headline: 'Miriam Libre, sans-serif',
      },
    },
  },
  plugins: [],
} satisfies Config;
