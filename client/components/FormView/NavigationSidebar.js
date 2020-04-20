import React from 'react'
import questions from '../../questions.json'
import { Message } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'
import { useSelector } from 'react-redux'
import { HashLink as Link } from 'react-router-hash-link'
import { useLocation } from 'react-router'
import { colors } from 'Utilities/common'

const replaceTitle = {
  'KOULUTUSOHJELMAN YLEISTILANNE': 'KOULUTUS-\nOHJELMAN YLEISTILANNE',
  'ONNISTUMISIA JA KEHITTÄMISTOIMENPITEITÄ': 'ONNISTUMISIA JA KEHITTÄMIS-\nTOIMENPITEITÄ',
  TOIMENPIDELISTA: 'TOIMENPIDE-\nLISTA',
  'DET ALLMÄNNA LÄGET INOM UTBILDNINGSPROGRAMMET':
    'DET ALLMÄNNA LÄGET INOM UTBILDNINGS-\nPROGRAMMET',
  'PERSONALRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSENLIGHET':
    'PERSONAL-\nRESURSERNAS OCH DE ANDRA RESURSERNAS TILLRÄCKLIGHET OCH ÄNDAMÅLSEN-\nLIGHET',
  'FAKULTETSÖVERSKRIDANDE PROGRAM': 'FAKULTET-\nSÖVER-\nSKRIDANDE PROGRAM',
  'FRAMGÅNGAR OCH UTVECKLINGSÅTGÄRDER': 'FRAMGÅNGAR OCH UTVECKLING-\nSÅTGÄRDER',
}

const NavigationSidebar = ({ programmeKey }) => {
  const languageCode = useSelector((state) => state.language)
  const location = useLocation()
  return (
    <div className="navigation-sidebar">
      <Message>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {questions.map((section, index) => {
            const titleFromJson = section.title[languageCode]
            const title = replaceTitle[titleFromJson] ? replaceTitle[titleFromJson] : titleFromJson
            const romanNumeral = romanize(index + 1)
            const active = location.hash === `#${romanNumeral}`
            return (
              <div key={title} style={{ fontWeight: active ? 'bold' : undefined }}>
                <span style={{ color: active ? colors.theme_blue : undefined }}>
                  {romanize(index + 1)}
                </span>
                <div style={{ margin: '1em 0' }}>
                  <Link to={`/form/${programmeKey}#${romanNumeral}`} style={{ color: 'black' }}>
                    {title}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </Message>
    </div>
  )
}

export default NavigationSidebar
