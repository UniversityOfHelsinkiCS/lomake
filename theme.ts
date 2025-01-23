import { createTheme } from '@mui/material/styles'

interface CustomPalette {
  greenLight: string
  yellowLight: string
  redLight: string
}

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    custom?: CustomPalette
  }
}

const theme = createTheme({
  palette: {
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' },
    custom: {
      greenLight: '#22C55E',
      yellowLight: '#FFDA35',
      redLight: '#FF6C6C',
    },
  },
})

export default theme
