const ITEM_NAME = 'fakeUser'

export const possibleUsers = [
  {
    uid: 'admin',
    employeeNumber: undefined,
    givenName: 'adminEtunimi',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'grp-toska',
    sn: 'admin',
  },
  {
    uid: 'cypressReadGroupMember',
    employeeNumber: 123,
    givenName: 'readGroupMember',
    mail: 'read-group-member@helsinki.fi',
    schacDateOfBirth: 19770501,
    hyGroupCn: 'grp-lomake-testing-read',
    sn: 'readGroupMember',
  },
  {
    uid: 'cypressOspaUser',
    employeeNumber: 124,
    givenName: 'ospaUser',
    mail: 'cypress-ospa-user@helsinki.fi',
    schacDateOfBirth: 19990101,
    hyGroupCn: 'grp-ospa',
    sn: 'nah'
  },
  {
    uid: 'cypressToskaUser',
    employeeNumber: 125,
    givenName: 'toskaUser',
    mail: 'cypress-toska-user@helsinki.fi',
    schacDateOfBirth: 19990102,
    hyGroupCn: 'grp-toska',
    sn: 'nah'
  },
  {
    uid: 'cypressJoryUser',
    employeeNumber: 126,
    givenName: 'joryUser',
    mail: 'cypress-jory-user@helsinki.fi',
    schacDateOfBirth: 19990103,
    hyGroupCn: 'hy-ttdk-tuk-jory;hy-employees',
    sn: 'nah'
  },
  {
    uid: 'cypressJoryReadUser',
    employeeNumber: 126,
    givenName: 'joryReadUser',
    mail: 'cypress-joryRead-user@helsinki.fi',
    schacDateOfBirth: 19990103,
    hyGroupCn: 'hy-ttdk-tuk-jory',
    sn: 'nah'
  },
  {
    uid: 'cypressInternationalUser',
  },
  {
    uid: 'cypressUser',
  },
  {
    uid: 'cypressAdminUser',
  },
  {
    uid: 'cypressSuperAdminUser',
  },
]

export const cypressUids = possibleUsers.map(u => u.uid).filter(uid => uid.startsWith('cypress'))

export const setHeaders = uid => {
  const user = possibleUsers.find(u => u.uid === uid)
  if (!user) return

  localStorage.setItem(ITEM_NAME, JSON.stringify(user))
}

export const removeLoggedInUsersGroups = () => {
  const user = JSON.parse(localStorage.getItem(ITEM_NAME))

  localStorage.setItem(
    ITEM_NAME,
    JSON.stringify({
      ...user,
      hyGroupCn: '',
    })
  )
}

export const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem(ITEM_NAME) || '{}')
  return user
}

export const clearHeaders = () => {
  localStorage.removeItem(ITEM_NAME)
}
