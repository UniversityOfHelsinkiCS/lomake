import { createTheme, ThemeOptions, Theme } from '@mui/material/styles'
import { CSSProperties } from '@mui/material/styles/createTypography'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    regular: CSSProperties
    light: CSSProperties
    italic: CSSProperties
    regularSmall: CSSProperties
    lightSmall: CSSProperties
    small: CSSProperties
  }

  interface TypographyVariantsOptions {
    regular?: CSSProperties
    light?: CSSProperties
    italic?: CSSProperties
    regularSmall?: CSSProperties
    lightSmall?: CSSProperties
    small?: CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    regular: true
    light: true
    italic: true
    regularSmall: true
    lightSmall: true
    small: true
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700, // Bold 16px / H6
          fontSize: '1.143rem',
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontWeight: 400, // Regular 16px
            fontSize: '1.143rem',
          },
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
