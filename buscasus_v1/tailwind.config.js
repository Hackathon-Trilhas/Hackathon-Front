/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-claro': '#689CFF',
        'primary': '#34D399',
        'primary-dark': '#059669',
        'background': '#F0FFF4',
        'accent-light': '#D1FAE5',
        'text-dark': '#064E3B',
        'text-light': '#666666',
      },
      height: {
        '15': '60px',
        '11.25': '45px',
        '17.5': '70px',
        '700': '700px',
        '25': '100px',
      },
      maxWidth: {
        '30': '120px',
      },
      margin: {
        '15': '60px',
      },
    },
  },
  plugins: [],
}
