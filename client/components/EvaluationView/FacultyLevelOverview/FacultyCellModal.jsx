import React from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Icon } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { useAppSelector } from '@/client/util/hooks'

const FacultyCellModal = ({ modalData, setAccordionsOpen, accordionsOpen, t }) => {
  const lang = useSelector(state => state.language)
  const data = useAppSelector(state => state.organisation.data)

  return (
    <>
      <div
        style={{
          paddingBottom: '1em',
        }}
      >
        {modalData.programme}
      </div>
      <div
        style={{
          fontSize: '1.2em',
        }}
      >
        {modalData?.content?.answer ? (
          <Accordion className="modal-accordion-container" exclusive={false}>
            {modalData.content
              ? Object.entries(modalData.content)
                .sort((a, b) => {
                  if (a[0] === 'green' && b[0] === 'yellow') return -1
                  if (a[0] === 'yellow' && b[0] === 'red') return -1
                  if (a[0] === 'green' && b[0] === 'red') return -1
                  if (a[0] === 'yellow' && b[0] === 'green') return 1
                  if (a[0] === 'red' && b[0] === 'green') return 1
                  if (a[0] === 'red' && b[0] === 'yellow') return 1
                  return 0
                })
                .map(([key, value]) => {
                  return (
                    <div key={`${key}-${value}`}>
                      <Accordion.Title
                        className={`accordion-title-${key}`}
                        active={accordionsOpen[key] === true}
                        onClick={() => setAccordionsOpen({ ...accordionsOpen, [key]: !accordionsOpen[key] })}
                      >
                        <Icon name="angle down" />
                        <span
                          style={{
                            fontSize: '22px',
                          }}
                        >
                          {' '}
                          {t(`overview:${key}ModalAccordion`)}
                        </span>
                      </Accordion.Title>
                      {value.map(answerContent => {
                        const programmeName = data
                          .find(f => f.code === modalData.facultyKey)
                          .programmes.find(p => p.key === answerContent.programme).name[lang]
                        return (
                          <Accordion.Content
                            className={`accordion-content-${key}`}
                            key={answerContent.programme}
                            active={accordionsOpen[key] === true}
                          >
                            <h4>{programmeName}</h4>
                            <ReactMarkdown>{answerContent.answer}</ReactMarkdown>
                          </Accordion.Content>
                        )
                      })}
                    </div>
                  )
                })
              : null}
          </Accordion>
        ) : (
          <ReactMarkdown>{modalData.content}</ReactMarkdown>
        )}
      </div>
    </>
  )
}

export default FacultyCellModal
