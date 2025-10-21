/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        Jakarta: ["Jakarta", "sans-serif"],
        JakartaBold: ["Jakarta-Bold", "sans-serif"],
        JakartaExtraBold: ["Jakarta-ExtraBold", "sans-serif"],
        JakartaExtraLight: ["Jakarta-ExtraLight", "sans-serif"],
        JakartaLight: ["Jakarta-Light", "sans-serif"],
        JakartaMedium: ["Jakarta-Medium", "sans-serif"],
        JakartaSemiBold: ["Jakarta-SemiBold", "sans-serif"],
      },
      colors: {
        primary: {
          50:  "#FDF8FC",
          100: "#FAEFF7",
          200: "#F1D8EC", // your given pastel pink
          300: "#EABFD9",
          400: "#E09EC2",
          500: "#D377AB",
          600: "#BF5E93", // solid brand button bg
          700: "#A34779",
          800: "#833A60",
          900: "#5C2743",
        },
        secondary: {
          50:  "#F1ECFA",
          100: "#E6DBF6",
          200: "#D1C1EE",
          300: "#B6A0E1",
          400: "#9378C9",
          500: "#7659AE",
          600: "#5F4490", // your given purple
          700: "#4E3975",
          800: "#3E2E5D",
          900: "#2E2244",
        },
        neutral: {
          100: "#F8F9FA",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        success: {
          500: "#38A169",
        },
        danger: {
          500: "#E53E3E",
        },
        warning: {
          500: "#FACC15",
        },
      },
    },
  },
  plugins: [],
}
