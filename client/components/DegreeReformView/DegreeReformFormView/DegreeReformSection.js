import React from 'react'
import { InView } from 'react-intersection-observer'
import { basePath, colors } from 'Utilities/common'
import { List, Label } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const Section = ({ id, title, number, children, programmeKey, formType }) => {
  const { t } = useTranslation('formView')
  let historyState = `${window.location.origin}${basePath}${formType}/form/${programmeKey}#${number}`
  if (formType === 'degree-reform-individual') {
    historyState = `${window.location.origin}${basePath}individual`
  }

  const scaleNames = [
    {
      number: '1',
      text: 'veryDifferent',
      id: 'very-different',
    },
    { number: '2', text: 'someWhatDifferent', id: 'somewhat-different' },
    { number: '3', text: 'neitherNor', id: 'neither' },
    { number: '4', text: 'someWhatAgree', id: 'somewhat-same' },
    { number: '5', text: 'veryAgree', id: 'very-same' },
  ]
  return (
    <>
      <div data-cy={`form-section-${number}`} id={number || '0'}>
        <InView
          as="div"
          onChange={inView => {
            if (inView) {
              window.history.pushState({}, '', historyState)
            }
          }}
        >
          <h2
            className="form-section-header"
            style={{
              fontSize: '2em',
              padding: '1.5em 0.5em',
              margin: '4em 0em 1em 0em',
              background: 'rgb(204 230 255)',
              borderRadius: '5px',
              color: colors.grey,
            }}
          >
            {title}
          </h2>
          {id !== 10 && id !== 0 ? (
            <List style={{ display: 'flex', flexDirection: 'column' }}>
              {scaleNames.map(scaleName => (
                <List.Item style={{ marginRight: '1em', padding: '!important 0.21428571em 0' }} key={scaleName.id}>
                  <Label horizontal>{scaleName.number}</Label>
                  <span> {t(scaleName.text)} </span>
                </List.Item>
              ))}
            </List>
          ) : null}
        </InView>
      </div>
      {children}
    </>
  )
}

export default Section
