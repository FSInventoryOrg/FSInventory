/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"]
    },
    extend: {
      colors: {
        body: "var(--body-new)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        highlight: "hsl(var(--highlight))",
        darker: "hsl(var(--darker))",
        error: "var(--error)",
        background: {
          DEFAULT: "hsl(var(--background))",
          new: "var(--background-new)"
        },
        foreground: "hsl(var(--foreground))",
        "fs-green": {
          DEFAULT: "var(--fs-green)",
          hover: "var(--fs-green-hover)"
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          new: "var(--border-new)"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          new: "var(--primary-new)"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          new: "var(--secondary-new)"
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
          new: "var(--muted-new)"
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
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
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
        'login-bg': "linear-gradient(164.19deg, rgba(36, 67, 66, 0.4) 11.03%, #244342 88.77%), url('/src/assets/laptop-background.jpg')"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
