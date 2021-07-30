import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Message, Segment } from 'semantic-ui-react'

import { updateStudyprogrammes } from 'Utilities/redux/studyProgrammesReducer'


export default () => {
  const dispatch = useDispatch()
  const status = useSelector((state) => state.studyProgrammes.updateStatus)

  const handleClick = () => {
    dispatch(updateStudyprogrammes())
  } 

  return (
    <>
      {status && <Message color="blue">{status}</Message>}
      <Segment padded>
        <h3>Päivitä koulutusohjelmat</h3>
        <div style={{ paddingBottom: "10px" }}>
          Nappulan painaminen poistaa tietokannasta kaikki koulutusohjelmat, tiedekunnat sekä yhteistyötiedekunnat. 
          Tämän jälkeen ohjelmat tallennetaan uudestaan tietokantaan siinä muodossa, kuin ne on tallennettu <a href="https://github.com/UniversityOfHelsinkiCS/lomake/blob/master/config/data.js" target="_blank">
            data-tiedostoon
          </a>. Mikäli siis koulutusohjelman muut tiedot kuin koulutusohjelman koodi muuttuvat (esim. nimi tai yhteistyötiedekunta),
          ne voi päivittää täältä. Päivittämisellä ei ole vaikutusta jo annettuihin vastauksiin tai käyttäjien oikeuksiin. 
        </div>
        <Button color="blue" onClick={() => handleClick()}>Päivitä</Button>
      </Segment>
    </>
  )
}
