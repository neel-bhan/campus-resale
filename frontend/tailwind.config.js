/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "mono-black": "#000000",
        "mono-dark": "#111111",
        "mono-darker": "#1a1a1a",
        "mono-medium": "#333333",
        "mono-light": "#666666",
        "mono-lighter": "#999999",
        "mono-white": "#ffffff",
        "mono-off-white": "#f5f5f5",
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
      },
    },
  },
  plugins: [],
};
