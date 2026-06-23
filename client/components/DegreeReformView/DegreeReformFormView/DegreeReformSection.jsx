import { InView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { basePath, colors } from '../../../util/common'
import { Chip, List, ListItem } from '@mui/material'

const Section = ({ id, title, number, children, programmeKey, formType }) => {
  const { t } = useTranslation('formView')
  let historyState = `${window.location.origin}${basePath}${formType}/form/${programmeKey}#${number}`
  if (formType === 'degree-reform-individual') {
    historyState = `${window.location.origin}${basePath}individual`
  }

  const scaleNames = [
    {
      number: '1',
      text: 'stronglyDisagree',
    },
    { number: '2', text: 'partiallyDisagree' },
    { number: '3', text: 'neitherNor' },
    { number: '4', text: 'partiallyAgree' },
    { number: '5', text: 'stronglyAgree' },
  ]
  return (
    <>
      <div data-cy={`form-section-${number}`} id={number ?? '0'}>
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
                <ListItem
                  key={scaleName.id}
                  sx={{ marginRight: '1em', padding: '!important 0.21428571em 0', fontSize: '1.1em' }}
                >
                  <Chip label={scaleName.number} />
                  {t(scaleName.text)}
                </ListItem>
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
