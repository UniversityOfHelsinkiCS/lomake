import { createTheme, ThemeOptions, Theme } from '@mui/material/styles'
import { CSSProperties } from '@mui/material/styles/createTypography'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    regular: CSSProperties
    light: CSSProperties
    italic: CSSProperties
    regularSmall: CSSProperties
    lightSmall: CSSProperties
  }

  interface TypographyVariantsOptions {
    regular?: CSSProperties
    light?: CSSProperties
    italic?: CSSProperties
    regularSmall?: CSSProperties
    lightSmall?: CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    regular: true
    light: true
    italic: true
    regularSmall: true
    lightSmall: true
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' },
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
    fontSize: 16,
    // rem values calculated based on 14px default font size (comes from semantic)
    h1: {
      fontWeight: 700, // Bold 28px
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 700, // Bold 25px
      fontSize: '1.786rem',
    },
    h3: {
      fontWeight: 700, // Bold 22px
      fontSize: '1.571rem',
    },
    h4: {
      fontWeight: 700, // Bold 18.5px
      fontSize: '1.321rem',
    },
    h5: {
      fontWeight: 700, // Bold 17px
      fontSize: '1.214rem',
    },
    h6: {
      fontWeight: 700, // Bold 16px
      fontSize: '1.143rem',
    },
    regular: {
      lineHeight: 1.5,
      fontWeight: 400, // Regular 17px
      fontSize: '1.214rem',
    },
    light: {
      lineHeight: 1.5,
      fontWeight: 300, // Light 17px
      fontSize: '1.214rem',
      color: '#000',
    },
    italic: {
      lineHeight: 1.5,
      fontWeight: 300,
      fontStyle: 'italic', // Italic 17px
      fontSize: '1.214rem',
      color: '#000',
    },
    regularSmall: {
      lineHeight: 1.5,
      fontWeight: 400, // Regular 16px
      fontSize: '1.143rem',
    },
    lightSmall: {
      lineHeight: 1.5,
      fontWeight: 300, // Light 16px
      fontSize: '1.143rem',
      color: '#000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700, // Bold 17px / H5
          fontSize: '1.214rem',
          textTransform: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          padding: '1.25rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500, // Bold 16px / H6
          fontSize: '1.143rem',
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          fontFamily: 'Lato',
        },
      },
    },
  },
}

const theme = createTheme(themeOptions) as Theme

export default theme

export const customColors = {
  greenLight: '#22C55E',
  yellowLight: '#FFDA35',
  redLight: '#FF6C6C',
  grayLight: '#D8D9DA',
  disabledText: '#818181',
}
