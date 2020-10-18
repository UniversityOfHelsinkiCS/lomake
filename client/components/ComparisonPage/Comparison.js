import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Grid, Radio } from 'semantic-ui-react'
import SingleProgramPieChart from './SingleProgramPieChart'
import PieChart from './PieChart'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import faculties from '../../facultyTranslations'


const Comparison = ({ 
  questionsList,
  usersProgrammes,
  allAnswers,
  facultiesByKey,
  year
}) => {
  const lang = useSelector((state) => state.language)
  const user = useSelector((state) => state.currentUser.data)
  const [compared, setCompared] = useState(faculties[lang][1].value)
  const [chosen, setChosen] = useState('')
  const [showEmpty, setShowEmpty] = useState(true)

  const handleChosenChange = (e, { value }) => {
    setChosen(value)
  }

  const handleComparedChange = (e, { value }) => {
    setCompared(value)
  }

  const programmeFaculty = (programmeName) => {
    if (!programmeName) return ''
    const programme = usersProgrammes.find((p) => p.name[lang] == programmeName)
    const facultyCode = facultiesByKey.get(programme.key)
    const faculty = faculties[lang].find((f) => f.key == facultyCode)
    return faculty.text
  }

  const comparisonFaculty = faculties[lang].find((f) => f.value === compared)

  const chosenAnswers = (question) => {
    const answers = allAnswers.get(question.id)
    return answers.filter((a) => a.name == chosen)
  } 

  const filteredByFaculty = usersProgrammes.filter((p) => {
    return facultiesByKey.get(p.key) === compared
  })

  const comparisonAnswers = (question) => {
    const filteredKeys = filteredByFaculty.map((p) => p.key)
    const answers = allAnswers.get(question.id)
    return answers.filter((a) => filteredKeys.includes(a.key))
  }

  const options = usersProgrammes.map((p) =>
    ({ key: p.key,
      value: p.name[lang] ? p.name[lang] : p.name['en'],
      text: p.name[lang] ? p.name[lang] : p.name['en']
    })
  )

  return (
    <div className="report-container">
      <Grid >
        <Grid.Column className="report-center-header" width={16}>
          {year} - {translations.reportHeader['comparison'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider"/>
      <Grid 
        centered 
        stackable 
        doubling
        columns={user.admin ? 3 : 2}
      >
        <Grid.Row className="report-comparison-filter-container">
          <Grid.Column className="report-comparison-header">
            <h4>{translations.chosenProgrammes[lang]}</h4>
            <Dropdown
              fluid
              selection
              search
              placeholder={translations.chooseProgramme[lang]}
              value={chosen}
              onChange={handleChosenChange}
              options={options}
            />
          </Grid.Column>
          <Grid.Column className="report-comparison-header">
            <h4>{translations.comparedProgrammes[lang]}</h4>
            <Dropdown
              fluid
              selection
              value={compared}
              onChange={handleComparedChange}
              options={faculties[lang].slice(1, faculties[lang].length)}
            />
            <small>{translations.noAccessToAll[lang]}</small>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="report-comparison-container">
          <Radio
            checked={showEmpty}
            onChange={() => setShowEmpty(!showEmpty)}
            label={translations.emptyAnswers[lang]}
            toggle
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div className="report-smiley-grid">
              {questionsList.map((question) =>
                (chosenAnswers(question) && !(question.no_light) &&
                  <SingleProgramPieChart
                    key={question.id}
                    question={question}
                    answers={chosenAnswers(question)}
                    programmeName={chosen}
                    programmeFaculty={programmeFaculty(chosen)}
                    showEmpty={showEmpty}
                  />
                )
              )}
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="report-smiley-grid">
              {questionsList.map((question) =>
                (comparisonAnswers(question) && !(question.no_light) &&
                  <PieChart
                    key={question.id}
                    question={question}
                    showEmpty={showEmpty}
                    answers={comparisonAnswers(question)}
                    chosenProgrammes={filteredByFaculty}
                    faculty={comparisonFaculty.text}
                    allProgrammes={filteredByFaculty}
                  />
                )
              )}
            </div>
          </Grid.Column>
          {user.admin && 
            <Grid.Column>
              <div className="report-smiley-grid">
                {questionsList.map((question) =>
                  (allAnswers.get(question.id) && !(question.no_light) &&
                    <PieChart
                      key={question.id}
                      question={question}
                      showEmpty={showEmpty}
                      answers={allAnswers.get(question.id)}
                      chosenProgrammes={usersProgrammes}
                      faculty={translations.university[lang]}
                      allProgrammes={usersProgrammes}
                    />
                  )
                )}
              </div>
            </Grid.Column>
          }
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default Comparison