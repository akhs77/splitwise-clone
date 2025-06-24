/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      brand: '#1DA1F2',

    },
  },
  plugins: [],
}
}
// / This is a Tailwind CSS configuration file that specifies the content sources
// for purging unused styles and extends the default theme. It includes all
// JavaScript and TypeScript files in the src directory and its subdirectories.
// The `extend` property allows for custom styles to be added without overriding the defaults.  