import { useDispatch, useSelector } from 'react-redux'
import { Button, Alert, Paper } from '@mui/material'

import { updateStudyprogrammes } from '../../redux/studyProgrammesReducer'

export default () => {
  const dispatch = useDispatch()
  const status = useSelector(state => state.studyProgrammes.updateStatus)

  const handleClick = () => {
    dispatch(updateStudyprogrammes())
  }

  return (
    <>
      {status ? <Alert severity="info">{status}</Alert> : null}
      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <h3>Päivitä koulutusohjelmat</h3>
        <div style={{ paddingBottom: '10px' }}>
          Nappulan painaminen päivittää tietokannasta kaikki koulutusohjelmat, tiedekunnat sekä yhteistyötiedekunnat
          perustuen{' '}
          <a
            href="https://github.com/UniversityOfHelsinkiCS/jami/blob/master/src/organisation/faculties.ts"
            rel="noreferrer"
            target="_blank"
          >
            data-tiedostoon
          </a>
          . Mikäli siis koulutusohjelman muut tiedot kuin koulutusohjelman koodi muuttuvat (esim. nimi tai
          yhteistyötiedekunta), ne voi päivittää täältä. Päivittämisellä ei ole vaikutusta jo annettuihin vastauksiin
          tai käyttäjien oikeuksiin. Poistuneita koulutusohjelmia ei poisteta tietokannasta.
        </div>
        <Button onClick={() => handleClick()} variant="outlined">
          Päivitä
        </Button>
      </Paper>
    </>
  )
}
