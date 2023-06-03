import {type Config} from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scale: {
        '200': '',
      }
    },
    screens: {
      'xl': '1280px',
      'lg': '1024px',
      'md': '768px',
      'sm': '640px',
      'xs': '0px',
    },
  },
  plugins: [],
} satisfies Config;
