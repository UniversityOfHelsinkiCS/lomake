import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' },
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
  },
})

export default theme

export const customColors = {
  greenLight: '#22C55E',
  yellowLight: '#FFDA35',
  redLight: '#FF6C6C',
  grayLight: '#D8D9DA',
}
