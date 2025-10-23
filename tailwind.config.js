/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#09090b",
          card: "#18181b",
          border: "#27272a",
          "text-primary": "#fafaf9",
          "text-secondary": "#a8a29e",
        },
      },
    },
  },
  plugins: [],
};
