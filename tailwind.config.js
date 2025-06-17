/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'neo': '4px 4px 0 0 #222, 0 0 0 2px #fff',
        'neo-lg': '8px 8px 0 0 #222, 0 0 0 2px #fff',
      },
      borderRadius: {
        'neo': '18px',
      },
      colors: {
        neoBg: '#f9f7f3',
        neoAccent: '#ffb800',
        neoAccent2: '#ff5e5b',
        neoAccent3: '#00cecb',
        neoDark: '#222',
      },
    },
  },
  plugins: [],
};
