import React from 'react'
import { InView } from 'react-intersection-observer'
import { basePath, colors } from 'Utilities/common'
import { List, Label } from 'semantic-ui-react'

const Section = ({ title, number, children, programmeKey, formType }) => {
  let historyState = `${window.location.origin}${basePath}${formType}/form/${programmeKey}#${number}`
  if (formType === 'degree-reform-individual') {
    historyState = `${window.location.origin}${basePath}${formType}/form/`
  }

  const scaleNames = [
    {
      number: '1',
      text: 'Täysin eri mieltä',
      id: 'very-different',
    },
    { number: '2', text: 'Osittain eri mieltä', id: 'somewhat-different' },
    { number: '3', text: 'Ei samaa eikä eri mieltä', id: 'neither' },
    { number: '4', text: 'Osittain samaa mieltä', id: 'somewhat-same' },
    { number: '5', text: 'Täysin samaa mieltä', id: 'very-same' },
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
          {number !== 0 && number !== 'XI' ? (
            <List style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {scaleNames.map(scaleName => (
                <List.Item style={{ marginRight: '1em', padding: '!important 0.21428571em 0' }} key={scaleName.id}>
                  <Label horizontal>{scaleName.number}</Label>
                  <span> {scaleName.text} </span>
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
