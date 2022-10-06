/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
        fontSize:{
          '2xs':'.75rem'
        },
        screens: {
          '3xl': '1600px',
          '4xl': '1900px',
        },
 
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
