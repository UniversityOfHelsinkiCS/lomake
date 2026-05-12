import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

export const Banner = () => {
  const lang = useSelector(state => state.language)
  const message =
    lang === 'fi'
      ? 'Palvelussa on käyttökatko 12.5. klo 10-12. Pahoittelut häiriöstä.'
      : lang === 'se'
        ? 'Tjänsten är nere 12.5. kl 10-12. Ursäkta störningarna.'
        : 'The service is down on May 12 from 10 to 12. Sorry for the inconvenience.'
  return (
    <div style={{ width: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
      <Alert severity="error">{message}</Alert>
    </div>
  )
}
