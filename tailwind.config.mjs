/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        julianText: '#474747',
        julianMuted: '#5C5C5C',
        julianBorder: '#CCCCCC',
        julianHover: '#000000',
      },
      fontFamily: {
        josefin: ["'Josefin Sans'", 'sans-serif'],
        montserrat: ["'Montserrat'", 'sans-serif'],
        sans: ["'Montserrat'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        'widest-julian': '0.25rem',
        'heading-julian': '0.5rem',
      }
    },
  },
  plugins: [],
};
