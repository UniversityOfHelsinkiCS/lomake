import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router'
import Form from 'Components/FormView/Form'
import meri_image from 'Assets/meri.jpg'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import questions from '../../questions'
import { colors } from 'Utilities/common'
import { Button } from 'semantic-ui-react'

const translations = {
  title: {
    en: 'DOCUMENTATION OF THE CURRENT STATUS OF DEGREE PROGRAMME',
    fi: 'KOULUTUSOHJELMAN TILANNEKUVAN DOKUMENTOINTI',
    se: 'DOKUMENTATION AV UTBILDNINGSPROGRAMMETS LÄGESBESKRIVNING'
  },
  p1: {
    en:
      'Please discuss the topics below in the steering group of the degree programme. The questions are intended to spark discussion, and the purpose is not to answer them as such.',
    fi:
      'Käykää koulutusohjelman johtoryhmässä keskustelua seuraavista aiheista. Aiheisiin liittyvät kysymykset on tarkoitettu keskustelua virittäviksi, eikä niihin sellaisenaan ole tarkoitus vastata.',
    se:
      'Diskutera formulärets teman i utbildningsprogrammets ledningsgrupp. Frågorna kring de olika temana är avsedda att stimulera till diskussion; de ska alltså inte besvaras som sådana.'
  },
  p2: {
    en:
      'Please provide an overall assessment of the programme’s current status (“Where are we now?”) with regard to each topic using the following system of emoji:',
    fi: 'Antakaa yleisarvio ”Missä mennään?” -kunkin aiheen kohdalla (liikennevalot):',
    se: 'Ge en allmän bedömning av läget för varje tema med hjälp av smilis'
  },
  positive: {
    en: 'No issues',
    fi: 'Kunnossa',
    se: 'I sin ordning'
  },
  neutral: {
    en: 'Challenges identified and development underway',
    fi: 'Haasteet tiedossa ja niiden kehittäminen työn alla',
    se: 'Utmaningarna har identifierats och utvecklingsarbete pågår'
  },
  negative: {
    en: 'Significant measures required/development areas not yet specified',
    fi: 'Vaatii merkittäviä toimenpiteitä / kehittämiskohteita ei ole tarkennettu',
    se: 'Kräver betydande åtgärder/utvecklingsobjekten har inte preciserats'
  }
}

const FormView = () => {
  const room = useSelector(({ room }) => room)
  const history = useHistory()
  const languageCode = useSelector((state) => state.language)

  if (!room) return <Redirect to="/" />
  return (
    <div className="the-form">
      <div style={{ marginBottom: '2em' }}>
        <Button onClick={() => history.push('/')} icon="arrow left" />
      </div>
      <img className="img-responsive" src={meri_image} />
      <div className="intro">
        <h1>
          {translations.title[languageCode]} {new Date().getFullYear()}
        </h1>
        <p style={{ color: colors.theme_blue }}>
          <b>{room}</b>
        </p>
        <p>{translations.p1[languageCode]}</p>
        <p>{translations.p2[languageCode]}</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={positiveEmoji} style={{ width: '40px', height: 'auto', marginRight: '5px' }} />{' '}
          {translations.positive[languageCode]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
          <img
            src={neutralEmoji}
            style={{
              width: '40px',
              height: 'auto',
              marginRight: '5px',
              marginTop: '5px',
              marginBottom: '5px'
            }}
          />{' '}
          {translations.neutral[languageCode]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
          <img src={negativeEmoji} style={{ width: '40px', height: 'auto', marginRight: '5px' }} />{' '}
          {translations.negative[languageCode]}
        </div>
      </div>
      <Form questions={questions} />
    </div>
  )
}

export default FormView
