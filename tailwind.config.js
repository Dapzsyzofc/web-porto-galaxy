/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        goozeman: ['Goozeman', 'Space Grotesk', 'sans-serif'],
        display: ['Goozeman', 'Space Grotesk', 'sans-serif'],
        'mono-tech': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
