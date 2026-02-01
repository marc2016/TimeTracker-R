import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: [
            "Inter",
            "Avenir",
            "Helvetica",
            "Arial",
            "sans-serif",
        ].join(","),
    },
});

export default theme;
