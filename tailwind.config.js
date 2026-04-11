/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-ink': '#0a1f1c',
        'ocean-teal': '#0d2f2a',
        'bright-cyan': '#00ffc8',
        'amber-gold': '#f5a623',
        'soft-white': '#f0f5f4',
        'muted-gray': '#8a9a96',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Source Sans Pro', 'sans-serif'],
        'elegant': ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'grid-flow': 'grid-flow 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 200, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 200, 0.6)' },
        },
        'grid-flow': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        },
      },
    },
  },
  plugins: [],
}