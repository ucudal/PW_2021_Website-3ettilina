module.exports = {
  // Tell Tailwind where to find css classes to keep on its file 
  // (remove unused css classes)
  purge: [
    "docs/*.html"
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        betty: '#a8c53c'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
