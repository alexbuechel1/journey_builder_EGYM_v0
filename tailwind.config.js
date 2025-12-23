/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // #C75300 - EGYM Orange
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // #ededed - Light gray
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))", // #8d8d8d
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
        // Status colors for actions
        success: {
          DEFAULT: "hsl(142, 71%, 45%)", // Green for completed
          foreground: "hsl(0, 0%, 100%)",
        },
        warning: {
          DEFAULT: "hsl(38, 92%, 50%)", // Amber for in-progress
          foreground: "hsl(0, 0%, 100%)",
        },
        info: {
          DEFAULT: "hsl(217, 91%, 60%)", // Blue for info
          foreground: "hsl(0, 0%, 100%)",
        },
        wellpass: {
          DEFAULT: "#06909B", // Wellpass blue
          foreground: "hsl(0, 0%, 100%)",
        },
        // Purple for Zapier-style connections
        purple: {
          DEFAULT: "hsl(270, 80%, 55%)", // Purple for connections (more vibrant)
          light: "hsl(270, 70%, 95%)", // Light purple background
        },
      },
      borderRadius: {
        lg: "var(--radius)", // 8px - Card radius
        md: "calc(var(--radius) - 2px)", // 6px
        sm: "var(--radius-sm)", // 4px - Text area radius
        full: "9999px", // Round
      },
      fontFamily: {
        sans: ['"Helvetica Now Display"', "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      spacing: {
        // EGYM spacing scale from Figma (4px base unit)
        '4x': '8px',   // Spacing/4x
        '10x': '20px', // Spacing/10x
        '12x': '24px', // Spacing/12x
        '14x': '28px', // Spacing/14x
        '16x': '32px', // Spacing/16x
      },
      fontSize: {
        // Typography scale from Figma
        'body-100': ['16px', { lineHeight: '24px', letterSpacing: '0.3px' }],
        'body-50': ['14px', { lineHeight: '20px', letterSpacing: '0.3px' }],
        'marginal-25': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
    },
  },
  plugins: [require("tailwindcss-animate")],
}
