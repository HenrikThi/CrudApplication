module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
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
