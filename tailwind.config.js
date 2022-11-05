/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'scorebox-blue': '#364EFF',
        'scorebox-lightgray': '#666666',
      },
    },
  },
  plugins: [],
};
