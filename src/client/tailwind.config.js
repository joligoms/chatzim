/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
        pattern: /(text|bg)-(indigo|red|yellow|green|amber|cyan|fuchsia|sky|emerald)-(500|600|700)/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

