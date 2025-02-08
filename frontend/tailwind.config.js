module.exports = {
  content: ['./src/**/*.{js,jsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        'dancing-script': ['Dancing Script', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        xs: '480px', // Adding xs breakpoint for very small devices
      },
      colors: {
        customBlue: '#00D8FF',
      },
    },
  },
  plugins: [],
};
