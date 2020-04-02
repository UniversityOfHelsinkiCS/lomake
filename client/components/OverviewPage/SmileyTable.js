import React, { useEffect, useState } from 'react'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { allLightIds } from 'Utilities/common'
import { useHistory } from 'react-router'
import { colors } from 'Utilities/common'
import { Icon, Loader, Header, Input, Grid, Segment, Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import './OverviewPage.scss'

const translations = {
  manageText: {
    fi: 'Hallitse',
    en: 'Manage',
    se: ''
  },
  noResultsText: {
    fi: 'Ohjelmia ei löytynyt. Kokeile toista filtteriä',
    en: 'No matching programmes found. Please try another filter',
    se: ''
  }
}

const lightEmojiMap = {
  green: 'smile outline',
  yellow: 'meh outline',
  red: 'frown outline'
}

const backgroundColorMap = {
  green: '#9dff9d',
  yellow: '#ffffb1',
  red: '#ff7f7f'
}

const SmileyTable = ({ filter, setModalData, filteredProgrammes }) => {
  const history = useHistory()
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

  const handleRoomChange = async (room) => {
    dispatch(wsLeaveRoom(room))
    dispatch(wsJoinRoom(room))
    history.push('/form')
  }

  const transformIdToTitle = (id) => {
    const formatted = id.substring(0, id.length - 6).replace('_', ' ')

    return (
      <span
        style={{
          writingMode: 'vertical-lr'
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
        textDecoration: 'underline'
      }}
    >
      {program !== programExpanded && (
        <span onClick={() => setProgramExpanded(program)}>
          {translations.manageText[languageCode]}
        </span>
      )}
    </td>
  )

  const mockUserData = [
    { name: 'Testi Testilä', email: 'testi.testila@helsinki.fi', canView: true, canEdit: false },
    { name: 'Useri Superi', email: 'useri.superi@helsinki.fi', canView: true, canEdit: true }
  ]

  // this is bit of a hack for demo - might be worth it to implement later properly using CSS Grid
  const ManageRows = ({ program }) => (
    <>
      <tr>
        <td colSpan={18}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '2em' }}>
              Share this URL to grant <b>view only</b> access
            </div>
            <Input
              style={{ width: '400px' }}
              action={{
                color: 'blue',
                labelPosition: 'right',
                icon: 'copy',
                content: 'Copy'
              }}
              defaultValue="http://cs.helsinki.fi/lomake/c0opq"
            />
            <div
              style={{
                cursor: 'pointer',
                color: 'red',
                textDecoration: 'underline',
                marginLeft: '2em'
              }}
            >
              Reset
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={18}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '4.5em' }}>
              Share this URL to grant <b>edit</b> access
            </div>
            <Input
              style={{ width: '400px' }}
              action={{
                color: 'blue',
                labelPosition: 'right',
                icon: 'copy',
                content: 'Copy'
              }}
              defaultValue="http://cs.helsinki.fi/lomake/aK04bg"
            />
            <div
              style={{
                cursor: 'pointer',
                color: 'red',
                textDecoration: 'underline',
                marginLeft: '2em'
              }}
            >
              Reset
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={18}>
          <Segment style={{ marginTop: '1em', marginBottom: '1em' }}>
            <Grid celled="internally">
              <Grid.Row>
                <Grid.Column width={2}>
                  <Header as="h4">Name</Header>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header as="h4">Email</Header>
                </Grid.Column>
                <Grid.Column width={1}>
                  <Header as="h4">View</Header>
                </Grid.Column>
                <Grid.Column width={1}>
                  <Header as="h4">Edit</Header>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header as="h4"></Header>
                </Grid.Column>
              </Grid.Row>
              {mockUserData.map((user) => (
                <Grid.Row key={user.id}>
                  <Grid.Column width={2}>{user.name}</Grid.Column>
                  <Grid.Column width={3}>{user.email}</Grid.Column>
                  <Grid.Column textAlign="center" width={1}>
                    <Icon
                      name={user.canView ? 'check' : 'close'}
                      color={user.canView ? 'green' : 'red'}
                      size="large"
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="center" width={1}>
                    <Icon
                      name={user.canEdit ? 'check' : 'close'}
                      color={user.canEdit ? 'green' : 'red'}
                      size="large"
                    />
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <span
                      style={{
                        cursor: 'pointer',
                        color: 'red',
                        textDecoration: 'underline'
                      }}
                    >
                      Revoke access
                    </span>
                  </Grid.Column>
                </Grid.Row>
              ))}
            </Grid>
          </Segment>
        </td>
      </tr>
    </>
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
                background: 'white'
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
                  <span
                    onClick={() => handleRoomChange(p)}
                    style={{
                      cursor: 'pointer',
                      color: colors.theme_blue,
                      textDecoration: 'underline'
                    }}
                  >
                    {p}
                  </span>
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
                              color: programme.data[q]
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
              {programExpanded === p && <ManageRows program={p} />}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

export default SmileyTable
