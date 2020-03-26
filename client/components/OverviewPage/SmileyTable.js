import React, { useEffect } from 'react'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { allLightIds, programmes } from 'Utilities/common'
import { useHistory } from 'react-router'
import { colors } from 'Utilities/common'
import { Icon, Loader, Header } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllAnswersAction } from 'Utilities/redux/allAnswersReducer'
import './OverviewPage.scss'

const noResultsText = {
  fi: 'Ohjelmia ei löytynyt. Kokeile toista filtteriä',
  en: 'No matching programmes found. Please try another filter',
  se: ''
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

const SmileyTable = ({ filter }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.allAnswers)
  const languageCode = useSelector((state) => state.language)

  useEffect(() => {
    dispatch(getAllAnswersAction())
  }, [])

  const handleRoomChange = async (room) => {
    dispatch(wsLeaveRoom(room))
    dispatch(wsJoinRoom(room))
    history.push('/form')
  }

  const filteredProgrammes = programmes.filter((prog) => {
    return prog.toLowerCase().includes(filter.toLowerCase())
  })

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
        {noResultsText[languageCode]}
      </Header>
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
        </tr>
      </thead>
      <tbody>
        {filteredProgrammes.map((p) => {
          const programme = answers.data.find((a) => a.programme === p)
          if (!programme)
            return (
              <tr key={p}>
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
                {allLightIds.map((q) => (
                  <td key={`${p}-${q}`} className="center aligned">
                    <div style={{ background: 'whitesmoke' }} />
                  </td>
                ))}
              </tr>
            )
          return (
            <tr key={p}>
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
                return programme.data[q] ? (
                  <td key={`${p}-${q}`}>
                    <div style={{ background: backgroundColorMap[programme.data[q]] }}>
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
                    <div style={{ background: 'whitesmoke' }} />
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default SmileyTable
