import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'

import { editUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'

const AccessGroupSelector = ({ user }) => {
  const dispatch = useDispatch()
  const [initialAccessGroups, setInitialAccessGroups] = useState([])
  const [accessGroups, setAccessGroups] = useState([])
  const lang = useSelector(state => state.language)
  const faculties = useSelector(state => state.faculties.data)
  const allProgrammes = useSelector(state => state.studyProgrammes.data)

  useEffect(() => {
    setInitialAccessGroups(Object.keys(user.specialGroup))
    setAccessGroups(Object.keys(user.specialGroup))
  }, [])

  const getOptions = () => {
    // Add special groups as options
    const options = [
      { key: 'allProgrammes', value: 'allProgrammes', text: translations.allProgrammes[lang] },
      { key: 'international2020', value: 'international2020', text: translations.accessInternational2020[lang] },
      { key: 'international', value: 'international', text: translations.accessInternational[lang] },
      { key: 'doctoral', value: 'doctoral', text: translations.accessDoctoral[lang] },
    ]
    // Add faculties as options
    return options.concat(
      faculties.map(f => ({
        key: f.code,
        value: f.code,
        text: f.name[lang],
      }))
    )
  }

  const onChange = (_, { value }) => {
    setAccessGroups(value)
  }

  const editAccess = () => {
    // update special groups to contain the faculties etc.
    let updatedGroup = {}
    accessGroups.forEach(group => (updatedGroup = { ...updatedGroup, [group]: true }))

    let updatedAccess = user.access

    // If the new groups does not have some access group which originally was there
    // remove access for that group
    initialAccessGroups.forEach(group => {
      if (!accessGroups.includes(group)) {
        if (group === 'international2020' || group === 'international') {
          allProgrammes.forEach(programme => {
            if (programme.international) {
              delete updatedAccess[programme.key]
            }
          })
        } else if (group === 'doctoral') {
          allProgrammes.forEach(programme => {
            if (programme.level === 'doctoral') {
              console.log({ programme })
              delete updatedAccess[programme.key]
            }
          })
        } else if (group === 'allProgrammes') {
          allProgrammes.forEach(programme => {
            delete updatedAccess[programme.key]
          })
        } else {
          const faculty = faculties.find(f => f.code === group)
          faculty.ownedProgrammes.forEach(programme => {
            delete updatedAccess[programme.key]
          })
        }
      }
    })

    if (accessGroups.length) {
      // And add access to all programmes that belong to the chosen special groups
      accessGroups.forEach(group => {
        if (group === 'international2020') {
          allProgrammes.forEach(programme => {
            if (programme.international) {
              updatedAccess = {
                ...updatedAccess,
                [programme.key]: { ...user.access[programme.key], read: true, year: 2020 },
              }
            }
          })
        } else if (group === 'international') {
          allProgrammes.forEach(programme => {
            if (programme.international) {
              updatedAccess = { ...updatedAccess, [programme.key]: { ...user.access[programme.key], read: true } }
            }
          })
        } else if (group === 'doctoral') {
          allProgrammes.forEach(programme => {
            if (programme.level === 'doctoral') {
              updatedAccess = { ...updatedAccess, [programme.key]: { ...user.access[programme.key], read: true } }
            }
          })
        } else if (group === 'allProgrammes') {
          allProgrammes.forEach(programme => {
            updatedAccess = { ...updatedAccess, [programme.key]: { ...user.access[programme.key], read: true } }
          })
        } else {
          const faculty = faculties.find(f => f.code === group)
          faculty.ownedProgrammes.forEach(programme => {
            updatedAccess = { ...updatedAccess, [programme.key]: { ...user.access[programme.key], read: true } }
          })
        }
      })
    }

    const updatedUser = {
      id: user.id,
      specialGroup: updatedGroup,
      access: updatedAccess,
    }
    dispatch(editUserAction(updatedUser))
  }

  return (
    <div>
      <Dropdown
        className="user-access-modal-group-selector"
        data-cy="user-access-group-selector"
        name="access-group-selector"
        fluid
        options={getOptions()}
        onChange={onChange}
        value={accessGroups}
        multiple
        selection
      />
      <Button
        className="user-access-modal-save-button"
        color="blue"
        onClick={() => editAccess()}
        data-cy="access-group-save-button"
      >
        {translations.save[lang]}
      </Button>
    </div>
  )
}

export default AccessGroupSelector
