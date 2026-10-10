import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

export const Banner = () => {
  const lang = useSelector(state => state.language)
  const message =
    lang === 'fi'
      ? 'Palvelussa voi olla tilapäisiä käyttökatkoja 13.10. Pahoittelut häiriöstä.'
      : lang === 'se'
        ? 'Tjänsten kan vara tillfälligt otillgänglig 13.10. Ursäkta störningarna.'
        : 'The service may be temporarily unavailable on October 13. Sorry for the inconvenience.'
  return (
    <div style={{ width: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
      <Alert severity="error">{message}</Alert>
    </div>
  )
}
