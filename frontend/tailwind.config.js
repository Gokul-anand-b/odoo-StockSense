/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090b',
          card: '#121215',
          hover: '#1c1c21',
          border: '#27272a',
          lightBorder: '#3f3f46',
        }
      },
    },
  },
  plugins: [],
};
