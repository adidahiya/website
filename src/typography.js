import Typography from "typography";

const typography = new Typography({
    googleFonts: [
        {
            name: "Almarai",
            styles: ["400", "700"],
        },
    ],
    baseFontSize: "16px",
    baseLineHeight: 1.4,
    bodyFontFamily: ["Almarai", "sans-serif"],
    headerFontFamily: ["Almarai", "sans-serif"],
});
const { rhythm, scale } = typography;

export { typography as default, rhythm, scale };
