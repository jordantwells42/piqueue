/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pico-black': '#000000',
        'pico-dark-blue': '#1D2B53',
        'pico-dark-purple': '#7E2553',
        'pico-dark-green': '#008751',
        'pico-brown': '#AB5236',
        'pico-dark-grey': '#5F574F',
        'pico-light-grey': '#C2C3C7',
        'pico-white': '#FFF1E8',
        'pico-mid-blue': '#809bce',
        'pico-red': '#ffc09f',
        'pico-orange': '#ffee93',
        'pico-yellow': '#fcf5c7',
        'pico-blue': '#a0ced9',
        'pico-green': '#adf7b6',
        'pico-lavender': '#83769C',
        'pico-pink': '#FF77A8',
        'pico-light-peach': '#FFCCAA'
      },
      fontFamily: {
        "main": ['"Lilita One"', 'cursive'],
      }
    }
  },
  plugins: [require('tailwind-scrollbar-hide')]
}
