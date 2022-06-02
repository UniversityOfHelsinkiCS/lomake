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
    hyGroupCn: 'grp-ospa;test-iam-group',
    sn: 'nah',
  },
  {
    uid: 'cypressToskaUser',
    employeeNumber: 125,
    givenName: 'toskaUser',
    mail: 'cypress-toska-user@helsinki.fi',
    schacDateOfBirth: 19990102,
    hyGroupCn: 'test-iam-group;grp-toska',
    sn: 'nah',
  },
  {
    uid: 'cypressJoryUser',
    employeeNumber: 126,
    givenName: 'joryUser',
    mail: 'cypress-jory-user@helsinki.fi',
    schacDateOfBirth: 19990103,
    hyGroupCn: 'hy-ttdk-tuk-jory;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressJoryReadUser',
    employeeNumber: 126,
    givenName: 'joryReadUser',
    mail: 'cypress-joryRead-user@helsinki.fi',
    schacDateOfBirth: 19990103,
    hyGroupCn: 'hy-ttdk-tuk-jory',
    sn: 'nah',
  },
  {
    uid: 'cypressDoctoralUser',
    employeeNumber: 127,
    givenName: 'doctoralUser',
    mail: 'cypress-doctoral-user@helsinki.fi',
    schacDateOfBirth: 19990104,
    hyGroupCn: 'hy-tohtorikoulutus-johtoryhma',
    sn: 'nah',
  },
  {
    uid: 'cypressPsykoUser',
    employeeNumber: 128,
    givenName: 'psykoUser',
    mail: 'cypress-psyko-user@helsinki.fi',
    schacDateOfBirth: 19990105,
    hyGroupCn: 'hy-ltdk-psyk-jory',
    sn: 'nah',
  },
  {
    uid: 'cypressLogoUser',
    employeeNumber: 129,
    givenName: 'logoUser',
    mail: 'cypress-logo-user@helsinki.fi',
    schacDateOfBirth: 19990106,
    hyGroupCn: 'hy-ltdk-logo-jory',
    sn: 'nah',
  },
  {
    uid: 'cypressRehtoriUser',
    employeeNumber: 130,
    givenName: 'rehtoriUser',
    mail: 'cypress-rehtori-user@helsinki.fi',
    schacDateOfBirth: 19990106,
    hyGroupCn: 'hy-rehtoraatti',
    sn: 'nah',
  },
  {
    uid: 'cypressTheologyFacultyUser',
    employeeNumber: 131,
    givenName: 'theologyFacultyUser',
    mail: 'cypress-theologyfaculty-user@helsinki.fi',
    schacDateOfBirth: 19990106,
    hyGroupCn: 'hy-ttdk-dekanaatti',
    sn: 'nah',
  },
  {
    uid: 'cypressKojoUser',
    employeeNumber: 132,
    givenName: 'kojoUser',
    mail: 'cypress-kojo-user@helsinki.fi',
    schacDateOfBirth: 19990107,
    hyGroupCn: 'hy-ttdk-tuk-jory;hy-ttdk-kandi-kojot',
    sn: 'nah',
  },
  {
    uid: 'cypressKosuUser',
    employeeNumber: 133,
    givenName: 'kosuUser',
    mail: 'cypress-kosu-user@helsinki.fi',
    schacDateOfBirth: 19990108,
    hyGroupCn: 'hy-ypa-opa-kosu-viikki', // 'hy-ypa-opa-kosu-viikki': ['H57', 'H55', 'H80', 'H90'],
    sn: 'nah',
  },
  {
    uid: 'cypressKojoDeanUser',
    employeeNumber: 135,
    givenName: 'kojoDeanUser',
    mail: 'cypress-kojo-dean-user@helsinki.fi',
    schacDateOfBirth: 19990109,
    hyGroupCn: 'hy-mltdk-mast-jory;hy-mltdk-maisteri-kojot;hy-mltdk-dekanaatti',
    sn: 'nah',
  },
  {
    uid: 'cypressKosuJoryUser',
    employeeNumber: 136,
    givenName: 'kosuJoryUser',
    mail: 'cypress-kosu-jory-user@helsinki.fi',
    schacDateOfBirth: 19990110,
    hyGroupCn: 'hy-mltdk-lsi-jory;hy-employees;hy-ypa-opa-kosu-kumpula',
    sn: 'nah',
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
