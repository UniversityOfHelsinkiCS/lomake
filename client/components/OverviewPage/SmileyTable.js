import React, { useEffect, useState } from 'react'
import { allLightIds } from 'Utilities/common'
import { colors } from 'Utilities/common'
import { Icon, Loader, Header } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import { getAnswersAction } from 'Utilities/redux/oldAnswersReducer'
import OwnerAccordionContent from './OwnerAccordionContent'
import './OverviewPage.scss'
import { Link } from 'react-router-dom'
import questions from '../../questions.json'
import { getProgrammeOwners } from 'Utilities/redux/studyProgrammesReducer'

const translations = {
  openManageText: {
    fi: 'Hallitse',
    en: 'Manage',
    se: '',
  },
  closeManageText: {
    fi: 'Piilota',
    en: 'Hide',
    se: '',
  },
  noResultsText: {
    fi: 'Yhtään ohjelmaa ei löytynyt. Kokeile muuttaa hakua.',
    en: 'No matching programmes were found. Please try a different filter.',
    se: '',
  },
  programmeClaimed: {
    fi: 'Tämä ohjelma on vastaanotettu',
    en: 'This programme has been claimed',
    se: '',
  },
  programmeNotClaimed: {
    fi: 'Tätä ohjelmaa ei ole vastaanotettu',
    en: 'This programme has not been claimed',
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

const SmileyTable = ({ setModalData, filteredProgrammes, year }) => {
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const languageCode = useSelector((state) => state.language)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const programmeOwners = useSelector((state) => state.studyProgrammes.programmeOwners)
  const [programExpanded, setProgramExpanded] = useState(null)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    dispatch(getAnswersAction())
    if (currentUser.admin) dispatch(getProgrammeOwners())
  }, [])

  useEffect(() => {
    if (filteredProgrammes.length === 1) {
      setProgramExpanded(filteredProgrammes[0].key)
      return
    }

    if (!programExpanded) return

    setProgramExpanded(null)
  }, [filteredProgrammes])

  const transformIdToTitle = (id) => {
    const formatted = id.substring(0, id.length - 6).replace(/_/g, ' ')

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

  const selectedAnswers =
    year === new Date().getFullYear()
      ? answers.data
      : oldAnswers.data.filter((a) => a.year === year)

  if (filteredProgrammes.length === 0)
    return (
      <Header as="h2" disabled>
        {translations.noResultsText[languageCode]}
      </Header>
    )

  const hasManagementAccess = (program) => {
    if (currentUser.admin) return true
    return Object.entries(currentUser.access).find(
      (access) => access[0] === program && access[1].admin === true
    )
  }

  const ManageCell = ({ program }) => (
    <td
      style={{
        cursor: 'pointer',
        color: colors.theme_blue,
        textDecoration: 'underline',
      }}
    >
      {program !== programExpanded ? (
        <span data-cy={`${program.key}-manage`} onClick={() => setProgramExpanded(program)}>
          {translations.openManageText[languageCode]}
        </span>
      ) : (
        <span onClick={() => setProgramExpanded(null)}>
          {translations.closeManageText[languageCode]}
        </span>
      )}
    </td>
  )

  const ClaimedIcon = ({ claimed }) => {
    if (!currentUser.admin) return null

    if (claimed) {
      return (
        <Icon
          title={
            programmeOwners
              ? programmeOwners[p.key]
              : translations['programmeClaimed'][languageCode]
          }
          color="green"
          name="thumbs up"
        />
      )
    }
    return (
      <Icon
        title={translations['programmeNotClaimed'][languageCode]}
        color="red"
        name="thumbs down"
      />
    )
  }

  return (
    <div style={{ overflowX: 'auto', width: '100vw', display: 'flex', justifyContent: 'center' }}>
      <table style={{ tableLayout: 'fixed', maxWidth: '1100px' }}>
        <thead>
          <tr>
            <th colSpan="2" style={{ background: 'white', position: 'sticky' }} />
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
            <th
              style={{
                position: 'sticky',
                background: 'white',
              }}
            />
          </tr>
        </thead>
        <tbody>
          {filteredProgrammes.map((p) => {
            const programme = selectedAnswers.find((a) => a.programme === p.key)
            const targetURL = `/form/${p.key}`
            return (
              <React.Fragment key={p.key}>
                <tr>
                  <th colSpan="2">
                    <Link data-cy={`smileytable-link-to-${p.key}`} to={targetURL}>
                      {p.name[languageCode] ? p.name[languageCode] : p.name['en']}
                    </Link>
                    <ClaimedIcon claimed={p.claimed} />
                  </th>
                  {allLightIds.map((q, qi) => {
                    return programme && programme.data[q] ? (
                      <td key={`${p.key}-${q}`}>
                        <div
                          data-cy={`${p.key}-${qi}`}
                          className="square"
                          style={{ background: backgroundColorMap[programme.data[q]] }}
                        >
                          <Icon
                            name={lightEmojiMap[programme.data[q]]}
                            style={{ cursor: 'pointer' }}
                            size="big"
                            onClick={() =>
                              setModalData({
                                header: questions.reduce((acc, cur) => {
                                  if (acc) return acc
                                  const header = cur.parts.reduce((acc, cur) => {
                                    if (acc) return acc

                                    if (cur.id === q.replace('_light', ''))
                                      return cur.description[languageCode]

                                    return acc
                                  }, '')

                                  if (header) return header

                                  return acc
                                }, ''),
                                programme: p.key,
                                content: programme.data[q.replace('light', 'text')],
                                color: programme.data[q],
                              })
                            }
                          />
                        </div>
                      </td>
                    ) : (
                      <td key={`${p.key}-${q}`}>
                        <div
                          data-cy={`${p.key}-${qi}`}
                          className="square"
                          style={{ background: 'whitesmoke' }}
                        />
                      </td>
                    )
                  })}
                  {hasManagementAccess(p.key) && <ManageCell program={p} />}
                </tr>
                {programExpanded === p && <OwnerAccordionContent programKey={p.key} />}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SmileyTable
