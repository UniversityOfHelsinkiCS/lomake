const ITEM_NAME = 'fakeUser'

export const possibleUsers = [
  {
    uid: 'admin',
    employeeNumber: undefined,
    givenName: 'adminEtunimi',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hypersonstudentid: undefined,
    sn: 'admin',
  },
  {
    uid: 'cypressReadGroupMember',
    employeeNumber: 123,
    givenName: 'readGroupMember',
    mail: 'read-group-member@helsinki.fi',
    schacDateOfBirth: 19770501,
    hypersonstudentid: '0123456789',
    hyGroupCn: 'grp-lomake-testing-read',
    sn: 'readGroupMember',
  },
  {
    uid: 'cypressFacultyUser',
    employeeNumber: 456,
    givenName: 'faculty',
    mail: 'cypress-faculty-user@helsinki.fi',
    schacDateOfBirth: 19890101,
    hypersonstudentid: '1234567890',
  },
  {
    uid: 'cypressUser',
  },
  {
    uid: 'cypressAdminUser',
  },
]

export const setHeaders = (uid) => {
  const user = possibleUsers.find((u) => u.uid === uid)
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
