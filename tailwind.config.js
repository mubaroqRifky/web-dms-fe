/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        colors: {
            primary: "var(--primary)",
            primaryDark: "var(--primaryDark)",
            primaryLight: "var(--primaryLight)",

            primaryTransparent: "var(--primaryTransparent)",
            primaryOutline: "var(--primaryOutline)",

            secondary: "var(--secondary)",
            secondaryDark: "var(--secondaryDark)",
            secondaryLight: "var(--secondaryLight)",

            secondaryTransparent: "var(--secondaryTransparent)",
            secondaryOutline: "var(--secondaryOutline)",

            black: "var(--black)",
            white: "var(--white)",
            whiteTransparent: "var(--whiteTransparent)",
            gray: "var(--gray)",
            softGray: "var(--softGray)",
            lightGray: "var(--lightGray)",
            darkGray: "var(--darkGray)",

            danger: "#FF4D4D",
            dangerOutline: "#de48486b",
            warning: "#FBBC05",
            orange: "#EE632C",
            red: "#FF0000",
            success: "#2299DC",
            transparent: "#00000085",
            clear: "#00000000",

            "blue-light": "#8AC1E9",
            "green-dark": "#07C90E",
            "green-soft": "#8AE9DD",
            "green-light": "#A1E976",
            "orange-light": "#FFC178",
            "red-light": "#FFEAEA",
            "gray-dark": "var(--gray-dark)",
        },
        fontFamily: {
            sans: ["Product Sans Medium", "Open Sans", "sans-serif"],
        },
        extend: {
            spacing: {
                "3xl": "25rem",
                "4xl": "30rem",
                "5xl": "34.375rem",
                "6xl": "40rem",
                "7xl": "60rem",
                "8xl": "96rem",
                "9xl": "128rem",
            },
            borderRadius: {
                "4xl": "2rem",
            },
            gridRow: {
                "span-10": "span 10 / span 10",
                "span-7": "span 7 / span 7",
            },
        },
        screens: {
            xs: "425px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
    },
    plugins: [],
};
