import Login from "../Login";
import React, { FunctionComponent } from "react";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  createMuiTheme
} from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { TypographyOptions } from "@material-ui/core/styles/createTypography";
import { ThemeProvider } from "@material-ui/styles";

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundColor: "#f2f2f2",
      height: "100%",
      width: "100%",
      position: "absolute"
    },
    pageContainer: {
      margin: "0 auto",
      height: "100%",
      maxWidth: 760
    }
  });

const typography: TypographyOptions = {
  fontFamily: ["Helvetica", "Roboto", "sans-serif"].join(","),
  htmlFontSize: 16,
  fontSize: 16,
  body1: {
    fontSize: 16,
    lineHeight: 1.33
  },
  body2: {
    fontSize: 14,
    lineHeight: 1.33
  },
  h1: {
    fontSize: 50,
    lineHeight: 1.33
  },
  h2: {
    fontSize: 32,
    lineHeight: 1.33
  },
  h3: {
    fontSize: 24,
    lineHeight: 1.33
  },
  h4: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.33
  },
  h5: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.33
  }
};

const palette: PaletteOptions = {
  common: {
    white: "#ffffff"
  },
  primary: {
    main: "#190574",
    light: "#2B0EAB",
    dark: "#0A0136"
  },
  secondary: {
    light: "#00AB5D",
    main: "#00743F",
    dark: "#00361E"
  },
  grey: {
    50: "#f2f2f2",
    500: "#cccccc",
    700: "#999999",
    900: "#333333"
  },
  text: {
    primary: "#333333",
    secondary: "#999999"
  },
  type: "light"
};

const theme = createMuiTheme({
  palette,
  typography
});

const App: FunctionComponent<WithStyles<typeof styles>> = ({ classes }) => {
  // TODO: implement routing
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.background}>
        <div className={classes.pageContainer}>
          <Login />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default withStyles(styles)(App);
