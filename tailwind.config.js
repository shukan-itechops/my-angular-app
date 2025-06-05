/** @type {import('tailwindcss').Config} */
module.exports = {
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

