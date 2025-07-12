/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
     "./src/**/*.{html,ts}",
  ],
  safelist: [
    {
      pattern: /mat-.+/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

