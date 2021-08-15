import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon, Popup, Table } from 'semantic-ui-react'
import { basePath } from '../../../config/common'
import { Message } from 'semantic-ui-react'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { resetAdminTokenAction  } from 'Utilities/redux/accessTokenReducer'


export default () => {
  const dispatch = useDispatch()
  const allTokens = useSelector((state) => state.accessToken.allTokens)
  const studyProgrammes = useSelector((state) => state.studyProgrammes.data)
  const lang = useSelector((state) => state.language)

  if (!allTokens || !studyProgrammes) return null

  const filteredTokens = allTokens.filter((token) => token.programme)
  const sortedTokens = filteredTokens.sort((a, b) => a.programme.localeCompare(b.programme))

  const handleReset = (programmeKey, url) => {
    dispatch(resetAdminTokenAction(programmeKey, url))
  }

  return (
    <>
      <Message
        color="blue"
        icon="exclamation"
        content={translations.ownerMessage[lang]}
      />
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{translations.code[lang]}</Table.HeaderCell>
            <Table.HeaderCell>{translations.faculty[lang]}</Table.HeaderCell>
            <Table.HeaderCell>{translations.shareUrl[lang]}</Table.HeaderCell>
            <Table.HeaderCell>{translations.valid[lang]}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedTokens
            .filter((token) => token.type === 'ADMIN')
            .map((token) => {
              const code = token.url
              const programmeKey = token.programme
              const valid = token.valid
              const shareUrl = `${window.location.origin}${basePath}access/${code}`
              const programmeName = studyProgrammes.find((p) => p.key === programmeKey).name[lang]

              return (
                <Table.Row key={token.url}>
                  <Table.Cell>{programmeKey}</Table.Cell>
                  <Table.Cell>{programmeName}</Table.Cell>
                  <Table.Cell>{shareUrl}</Table.Cell>
                  <Table.Cell><Icon color={valid ? "green" : "red"} name={valid ? "check" : "close"} /></Table.Cell>
                  <Table.Cell>
                    {!valid &&
                      <Popup
                        on="click"
                        trigger={
                          <Button color="grey">
                            {translations.reset[lang]}
                          </Button>  
                        }
                        content={
                          <>
                            <p>
                              <strong>
                                {translations.resetConfirmationText[lang]}
                              </strong>
                            </p>
                            <Button
                              color="blue"
                              onClick={() => handleReset(programmeKey, code)}
                            >
                              {translations.confirmReset[lang]}
                            </Button>
                          </>
                        }
                      />
                    }
                  </Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table>
    </>
  )
}
