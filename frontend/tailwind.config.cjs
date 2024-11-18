/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "3xl": "1536px",
        "2xl": "1400px",
        tablet: "1024px",
        "mobile-sm": "320px",
        "mobile-lg": "640px",
      },
    },
    extend: {
      colors: {
        body: "var(--body-new)",
        border: {
          DEFAULT: "hsl(var(--border))",
          new: "var(--border-new)",
        },
        brandgreen: {
          DEFAULT: "var(--brand-green)",
          hover: "var(--brand-green-hover)",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        tab: "hsl(var(--tab))",
        highlight: "hsl(var(--highlight))",
        darker: "hsl(var(--darker))",
        background: {
          DEFAULT: "hsl(var(--background))",
          new: "var(--background-new)",
        },
        foreground: "hsl(var(--foreground))",
        error: {
          DEFAULT: "var(--error)",
          bg: "var(--error-bg)",
        },
        "fs-green": {
          DEFAULT: "var(--fs-green)",
          hover: "var(--fs-green-hover)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          new: "var(--primary-new)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          new: "var(--secondary-new)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          new: "var(--muted-new)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        tracker: {
          from: "var(--tracker-gradient-from)",
          to: "var(--tracker-gradient-to)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-120": "linear-gradient(125.56deg, var(--tw-gradient-stops))",
        "gradient-302": "linear-gradient(302.19deg, var(--tw-gradient-stops))",
        "login-bg":
          "linear-gradient(164.19deg, rgba(36, 67, 66, 0.4) 11.03%, #244342 88.77%), url('./src/assets/laptop-background.jpg')",
      },
      screens: {
        "3xl": "1536px",
        "2xl": "1400px",
        tablet: "1024px",
        "mobile-sm": "320px",
        "mobile-lg": "640px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
