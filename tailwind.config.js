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
          50: "#F4EAF8",
          100: "#E9D8F0", // splash background
          200: "#D6BDE8",
          300: "#C19AD9",
          400: "#9C72C2",
          500: "#7B53A6",
          600: "#5A3E85", // logo purple
          700: "#452E66",
          800: "#2E1F46",
          900: "#1A0F26",
        },
        secondary: {
          100: "#FAF5FF",
          200: "#F3E8FF",
          300: "#E9D5FF",
          400: "#D8B4FE",
          500: "#C084FC",
          600: "#A855F7",
          700: "#9333EA",
          800: "#7E22CE",
          900: "#6B21A8",
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
