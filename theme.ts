import { createTheme, ThemeOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    regular: React.CSSProperties
    light: React.CSSProperties
    italic: React.CSSProperties
    regularSmall: React.CSSProperties
    lightSmall: React.CSSProperties
    small: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    regular?: React.CSSProperties
    light?: React.CSSProperties
    italic?: React.CSSProperties
    regularSmall?: React.CSSProperties
    lightSmall?: React.CSSProperties
    small?: React.CSSProperties
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' },
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
    // rem values calculated based on 14px default font size
    h1: {
      fontWeight: 700, // Bold 28px
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 700, // Bold 24px
      fontSize: '1.714rem',
    },
    h3: {
      fontWeight: 700, // Bold 20px
      fontSize: '1.429rem',
    },
    h4: {
      fontWeight: 700, // Bold 18px
      fontSize: '1.286rem',
    },
    h5: {
      fontWeight: 700, // Bold 16px
      fontSize: '1.143rem',
    },
    h6: {
      fontWeight: 700, // Bold 14px
      fontSize: '1rem',
    },
    regular: {
      fontWeight: 400, // Regular 16px
      fontSize: '1.143rem',
    },
    light: {
      fontWeight: 300, // Light 16px
      fontSize: '1.143rem',
    },
    italic: {
      fontStyle: 'italic', // Italic 16px
      fontWeight: 400,
      fontSize: '1.143rem',
    },
    regularSmall: {
      fontWeight: 400, // Regular 14px
      fontSize: '1rem',
    },
    lightSmall: {
      fontWeight: 300, // Light 14px
      fontSize: '1rem',
    },
    small: {
      fontWeight: 300, // Light 10px
      fontSize: '0.714rem',
    },
  },
}

const theme = createTheme(themeOptions)

export default theme

export const customColors = {
  greenLight: '#22C55E',
  yellowLight: '#FFDA35',
  redLight: '#FF6C6C',
  grayLight: '#D8D9DA',
  disabledText: '#818181',
}
