/** @type {import('tailwindcss').Config} */
import tailwindcssReactAriaComponents from "tailwindcss-react-aria-components"
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssReactAriaComponents],
}
