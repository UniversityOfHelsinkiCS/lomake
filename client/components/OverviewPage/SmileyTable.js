import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Header, Icon, Loader, Grid } from 'semantic-ui-react'
import { colors } from 'Utilities/common'
import { getAnswersAction } from 'Utilities/redux/oldAnswersReducer'
import { getProgrammeOwners } from 'Utilities/redux/studyProgrammesReducer'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import questions from '../../questions.json'
import OwnerAccordionContent from './OwnerAccordionContent'
import SmileyTableCell from './SmileyTableCell'
import './SmileyTable.scss'

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

const replaceTitle = {
  successes_and_development_needs: 'successes_and_needs',
  review_of_last_years_situation_report: 'review_of_last_year',
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
    const idToUse = replaceTitle[id] || id
    const formatted = idToUse.replace(/_/g, ' ')

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

  if (answers.pending || !answers.data || !oldAnswers.data)
    return <Loader active inline="centered" />

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
    <div
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
    </div>
  )

  const ClaimedIcon = ({ programme }) => {
    if (!currentUser.admin) return null

    if (programme.claimed) {
      return (
        <Icon
          title={
            programmeOwners
              ? programmeOwners[programme.key]
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

  const tableIds = questions.reduce((acc, cur) => {
    const questionObjects = cur.parts.reduce((acc, cur) => {
      if (
        cur.id.includes('information_needed') ||
        cur.id.includes('information_used') ||
        cur.type === 'TITLE'
      ) {
        return acc
      }

      return [...acc, { id: cur.id, type: cur.no_light ? 'ENTITY_NOLIGHT' : cur.type }]
    }, [])

    return [...acc, ...questionObjects]
  }, [])

  return (
    <div className="smiley-grid">
      <div className="sticky-header" />
      {tableIds.map((idObject) => (
        <div
          key={idObject.id}
          className="sticky-header"
          style={{
            wordWrap: 'break-word',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {transformIdToTitle(idObject.id)}
        </div>
      ))}
      <div className="sticky-header" />
      {filteredProgrammes.map((p) => {
        const programme = selectedAnswers.find((a) => a.programme === p.key)
        const targetURL = `/form/${p.key}`
        return (
          <React.Fragment key={p.key}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link data-cy={`smileytable-link-to-${p.key}`} to={targetURL}>
                {p.name[languageCode] ? p.name[languageCode] : p.name['en']}
              </Link>
              {/*<ClaimedIcon programme={p} />*/}
            </div>
            {tableIds.map((idObject, qi) => (
              <SmileyTableCell
                key={`${p.key}-${idObject.id}`}
                programmesKey={p.key}
                programmesAnswers={programme && programme.data ? programme.data : {}}
                questionId={idObject.id}
                questionType={idObject.type}
                questionIndex={qi}
                setModalData={setModalData}
              />
            ))}
            {hasManagementAccess(p.key) && <ManageCell program={p} />}
            {/*programExpanded === p && <OwnerAccordionContent programKey={p.key} />*/}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default SmileyTable
