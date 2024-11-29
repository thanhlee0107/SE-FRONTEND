/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [ "sans-serif"],
      },
      colors: {
        baliHai: "rgb(138, 164, 175)",
        black: "rgb(0, 0, 0)",
        black20: "rgba(0, 0, 0, 0.2)",
        bostonBlue: "rgb(60, 141, 188)",
        boulder: "rgb(119, 119, 119)",
        catskillWhite: "rgb(236, 240, 245)",
        cerulean: "rgb(0, 192, 239)",
        crimson: "rgb(200, 16, 46)",
        gallery: "rgb(235, 235, 235)",
        killarney: "rgb(60, 118, 61)",
        loblolly: "rgb(184, 199, 206)",
        midnightBlue: "rgb(1, 33, 105)",
        mineShaft: "rgb(34, 34, 34)",
        mischka: "rgb(210, 214, 222)",
        outerSpace: "#222D32",
        red: "rgb(236, 0, 21)",
        silver: "rgb(204, 204, 204)",
        tundora: "rgb(68, 68, 68)",
        white: "rgb(255, 255, 255)",
        whiteOuterSpace: "rgb(34, 45, 50)",
        wildSand: "rgb(244, 244, 244)",
        yellow: "rgb(255, 255, 0)",
      },
      
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
})

