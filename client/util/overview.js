import * as React from 'react'
import { isAdmin } from '@root/config/common'

const getOverviewProgrammesToShow = (programmes, access) => {
  const usersPermissionsEntries = Object.entries(access)
  let properAccess = usersPermissionsEntries.filter(e => e[1].write).map(e => e[0])
  if (properAccess.length === 0 || properAccess[0].startsWith('H') || properAccess[0] === 'UNI') {
    properAccess = usersPermissionsEntries.filter(e => e[1].read).map(e => e[0])
  }
  return programmes.filter(program => properAccess.includes(program.key))
}

export const useVisibleOverviewProgrammes = ({ currentUser, programmes, showAllProgrammes, faculty, dropdownFilter }) =>
  React.useMemo(() => {
    if (isAdmin(currentUser.data)) {
      return programmes
    }
    if (currentUser.data.access || currentUser.specialGroup) {
      if (
        (!showAllProgrammes && faculty !== 'UNI') ||
        (!showAllProgrammes && dropdownFilter.length > 0 && faculty === 'UNI')
      ) {
        return getOverviewProgrammesToShow(programmes, currentUser.data.access)
      }
      return programmes
    }

    return []
  }, [programmes, currentUser.data, showAllProgrammes, faculty, dropdownFilter])

export const deleteWhenMoreThanOneExport = 0
