module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    backgroundImage: (theme) => ({
      "background-nft": "url('/images/image.png')"
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
