import React, { useEffect, useState } from 'react'
import { allLightIds } from 'Utilities/common'
import { colors } from 'Utilities/common'
import { Icon, Loader, Header } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import OwnerAccordionContent from './OwnerAccordionContent'
import './OverviewPage.scss'
import { Link } from 'react-router-dom'

const translations = {
  manageText: {
    fi: 'Hallitse',
    en: 'Manage',
    se: '',
  },
  noResultsText: {
    fi: 'Ohjelmia ei löytynyt. Kokeile toista filtteriä',
    en: 'No matching programmes found. Please try another filter',
    se: '',
  },
}

const lightEmojiMap = {
  green: 'smile outline',
  yellow: 'meh outline',
  red: 'frown outline',
}

const backgroundColorMap = {
  green: '#9dff9d',
  yellow: '#ffffb1',
  red: '#ff7f7f',
}

const SmileyTable = ({ setModalData, filteredProgrammes }) => {
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.tempAnswers)
  const languageCode = useSelector((state) => state.language)
  const [programExpanded, setProgramExpanded] = useState(null)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
  }, [])

  useEffect(() => {
    if (filteredProgrammes.length === 1) {
      setProgramExpanded(filteredProgrammes[0])
      return
    }

    if (!programExpanded) return

    setProgramExpanded(null)
  }, [filteredProgrammes])

  const transformIdToTitle = (id) => {
    const formatted = id.substring(0, id.length - 6).replace('_', ' ')

    return (
      <span
        style={{
          writingMode: 'vertical-lr',
        }}
      >
        {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
      </span>
    )
  }

  if (answers.pending || !answers.data) return <Loader active inline="centered" />

  if (filteredProgrammes.length === 0)
    return (
      <Header as="h2" disabled>
        {translations.noResultsText[languageCode]}
      </Header>
    )

  const ManageCell = ({ program }) => (
    <td
      style={{
        cursor: 'pointer',
        color: colors.theme_blue,
        textDecoration: 'underline',
      }}
    >
      {program !== programExpanded && (
        <span onClick={() => setProgramExpanded(program)}>
          {translations.manageText[languageCode]}
        </span>
      )}
    </td>
  )

  return (
    <table style={{ tableLayout: 'fixed' }}>
      <thead>
        <tr>
          <th colSpan="2" />
          {allLightIds.map((id) => (
            <th
              key={id}
              style={{
                wordWrap: 'break-word',
                textAlign: 'center',
                position: 'sticky',
                background: 'white',
              }}
            >
              {transformIdToTitle(id)}
            </th>
          ))}
          <th />
        </tr>
      </thead>
      <tbody>
        {filteredProgrammes.map((p) => {
          const programme = answers.data.find((a) => a.programme === p)
          return (
            <React.Fragment key={p}>
              <tr>
                <th colSpan="2">
                  <Link data-cy="smileytable-link-to-form" to={`/form/${encodeURIComponent(p)}`}>
                    {p}
                  </Link>
                </th>
                {allLightIds.map((q) => {
                  return programme && programme.data[q] ? (
                    <td key={`${p}-${q}`}>
                      <div
                        className="square"
                        style={{ background: backgroundColorMap[programme.data[q]] }}
                      >
                        <Icon
                          name={lightEmojiMap[programme.data[q]]}
                          style={{ cursor: 'pointer' }}
                          size="big"
                          onClick={() =>
                            setModalData({
                              header: programme.data[q.replace('light', 'text')],
                              programme: p,
                              content: q,
                              color: programme.data[q],
                            })
                          }
                        />
                      </div>
                    </td>
                  ) : (
                    <td key={`${p}-${q}`}>
                      <div className="square" style={{ background: 'whitesmoke' }} />
                    </td>
                  )
                })}
                <ManageCell program={p} />
              </tr>
              {programExpanded === p && <OwnerAccordionContent program={p} />}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

export default SmileyTable
