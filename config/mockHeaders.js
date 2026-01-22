const ITEM_NAME = 'fakeUser'

const possibleUsers = [
  {
    uid: 'vesuvesu',
    employeeNumber: undefined,
    givenName: 'Acual student',
    mail: 'vesuvesu@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-sivari',
    sn: 'AcualStudent',
  },
  {
    uid: 'thairaks',
    employeeNumber: undefined,
    givenName: 'Acual dekaani fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-employees;grp-katselmus-humtdk;hy-humtdk-dekanaatti',
    sn: 'AcualPerson',
  },
  {
    uid: 'klemstro',
    employeeNumber: undefined,
    givenName: 'Acual kojo fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-mltdk-tkt-jory;hy-mltdk-kandi-kojot;hy-employees;grp-katselmus-mltdk;grp-katselmus-humtdk',
    sn: 'AcualKojo',
  },
  {
    uid: 'niklande',
    employeeNumber: undefined,
    givenName: 'Acual no kojo fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-mltdk-tkt-jory;hy-mltdk-bsc-jory;hy-employees',
    sn: 'AcualNonKojo',
  },
  {
    uid: 'superAdmin',
    employeeNumber: undefined,
    givenName: 'superAdmin',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'grp-toska;hy-employees',
    sn: 'superAdmin',
  },
  {
    uid: 'cypressSuperAdminUser',
    employeeNumber: undefined,
    givenName: 'cypressSuperAdminUser',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'grp-toska;hy-employees',
    sn: 'cypressSuperAdminUser',
  },
  {
    uid: 'cypressReadingRightsUser',
    employeeNumber: undefined,
    givenName: 'no rights',
    mail: 'no-rights@fake.helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-rehtoraatti;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressNoRightsUser',
    employeeNumber: undefined,
    givenName: 'no rights',
    mail: 'no-rights@fake.helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: '',
    sn: 'nah',
  },
  {
    uid: 'cypressUser',
    employeeNumber: 124,
    givenName: 'user',
    mail: 'cypress-user@helsinki.fi',
    schacDateOfBirth: 19990100,
    hyGroupCn: 'hy-mltdk-tkt-jory;hy-mltdk-kandi-kojot;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressOspaUser',
    employeeNumber: 124,
    givenName: 'ospaUser',
    mail: 'cypress-ospa-user@helsinki.fi',
    schacDateOfBirth: 19990101,
    hyGroupCn: 'hy-ypa-opa-ospa;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressToskaUser',
    employeeNumber: 125,
    givenName: 'toskaUser',
    mail: 'cypress-toska-user@helsinki.fi',
    schacDateOfBirth: 19990102,
    hyGroupCn: 'grp-toska;hy-employees',
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
    hyGroupCn: 'hy-ttdk-tuk-jory;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressDoctoralUser',
    employeeNumber: 127,
    givenName: 'doctoralUser',
    mail: 'cypress-doctoral-user@helsinki.fi',
    schacDateOfBirth: 19990104,
    hyGroupCn: 'hy-tohtorikoulutus-johtoryhma;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressDoctoralWritingUser',
    employeeNumber: 127,
    givenName: 'doctoralUser',
    mail: 'cypress-doctoral-writing-user@helsinki.fake.fi',
    schacDateOfBirth: 19990104,
    hyGroupCn: 'hy-ypa-tutto-toht;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressPsykoUser',
    employeeNumber: 128,
    givenName: 'psykoUser',
    mail: 'cypress-psyko-user@helsinki.fi',
    schacDateOfBirth: 19990105,
    hyGroupCn: 'hy-ltdk-psyk-jory;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressLogoUser',
    employeeNumber: 129,
    givenName: 'logoUser',
    mail: 'cypress-logo-user@helsinki.fi',
    schacDateOfBirth: 19990106,
    hyGroupCn: 'hy-ltdk-logo-jory;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressRehtoriUser',
    employeeNumber: 130,
    givenName: 'rehtoriUser',
    mail: 'cypress-rehtori-user@helsinki.fi',
    schacDateOfBirth: 19990106,
    hyGroupCn: 'hy-rehtoraatti;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressTheologyFacultyUser',
    employeeNumber: 131,
    givenName: 'theologyFacultyUser',
    mail: 'cypress-theologyfaculty-user@helsinki.fi',
    schacDateOfBirth: 19990106,
    hyGroupCn: 'hy-ttdk-dekanaatti;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressKojoUser',
    employeeNumber: 132,
    givenName: 'kojoUser',
    mail: 'cypress-kojo-user@helsinki.fi',
    schacDateOfBirth: 19990107,
    hyGroupCn: 'hy-ttdk-tuk-jory;hy-ttdk-kandi-kojot;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressKosuUser',
    employeeNumber: 133,
    givenName: 'kosuUser',
    mail: 'cypress-kosu-user@helsinki.fi',
    schacDateOfBirth: 19990108,
    hyGroupCn: 'hy-ypa-opa-kosu-viikki;hy-employees', // 'hy-ypa-opa-kosu-viikki': ['H57', 'H55', 'H80', 'H90'],
    sn: 'nah',
  },
  {
    uid: 'cypressKojoDeanUser',
    employeeNumber: 135,
    givenName: 'kojoDeanUser',
    mail: 'cypress-kojo-dean-user@helsinki.fi',
    schacDateOfBirth: 19990109,
    hyGroupCn: 'hy-mltdk-mast-jory;hy-mltdk-maisteri-kojot;hy-mltdk-dekanaatti;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressKosuJoryUser',
    employeeNumber: 136,
    givenName: 'kosuJoryUser',
    mail: 'cypress-kosu-jory-user@helsinki.fi',
    schacDateOfBirth: 19990110,
    hyGroupCn: 'hy-mltdk-lsi-jory;hy-employees;hy-ypa-opa-kosu-kumpula;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressDoctoralKosuAndRegularKosuUser',
    employeeNumber: 127,
    givenName: 'doctoralUser',
    mail: 'cypress-doctoral-kosu-regular-kosu-user@helsinki.fi',
    schacDateOfBirth: 19990111,
    hyGroupCn: 'hy-ypa-tutto-toht;hy-ypa-opa-kosu-kumpula;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressRandomRightsUser',
    employeeNumber: 137,
    givenName: 'randomRightsUser',
    mail: 'cypress-random-rights-user@helsinki.fi',
    schacDateOfBirth: 19990112,
    hyGroupCn:
      'hy-mltdk-geok-jory;random-iam-group-should-have-no-effect;hy-employees;random-iam-group-should-have-no-effect;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressFacultyKatselmusUser',
    employeeNumber: 556677,
    givenName: 'facultyKatselmusUser',
    mail: 'cypress-faculty-katselmus-rights-user@helsinki.fi',
    schacDateOfBirth: 19970112,
    hyGroupCn: 'hy-mltdk-geok-jory;grp-katselmus-mltdk;hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressDeanKatselmusUser',
    employeeNumber: 223344,
    givenName: 'Acual dekaani fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-employees;grp-katselmus-humtdk;hy-humtdk-dekanaatti',
    sn: 'AcualFakePerson',
  },
  {
    uid: 'cypressKatselmusProjektiryhmaUser',
    employeeNumber: 223344,
    givenName: 'Acual projektiryhma, fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'grp-katselmus-projektiryhma;grp-katselmus-mltdk;hy-employees',
    sn: 'AcualFakePerson',
  },
  {
    uid: 'cypressKatselmusUniversityUser',
    employeeNumber: 223344,
    givenName: 'Acual university worker, fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn:
      'hy-employees;grp-katselmus-valttdk;grp-koordinaatioryhma;hy-ypa-tutto-toht;grp-katselmus-projektiryhma;hy-tutkijakoulu-johtokunta',
    sn: 'AcualFakePerson',
  },
  {
    uid: 'cypressHyEmployeeUser',
    employeeNumber: 223344,
    givenName: 'Acual university worker, fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-employees',
    sn: 'nah',
  },
  {
    uid: 'cypressHyTineUser',
    employeeNumber: 223344,
    givenName: 'Acual university worker, fake user',
    mail: 'grp-toska+mockadmin@helsinki.fi',
    schacDateOfBirth: undefined,
    hyGroupCn: 'hy-tine;hy-employees',
    sn: 'nah',
  },
]

const cypressUids = possibleUsers.map(user => user.uid).filter(uid => uid.startsWith('cypress'))

const setHeaders = uid => {
  const user = possibleUsers.find(u => u.uid === uid)

  if (!user) return

  localStorage.setItem(ITEM_NAME, JSON.stringify(user))
}

const removeLoggedInUsersGroups = () => {
  const user = JSON.parse(localStorage.getItem(ITEM_NAME))

  localStorage.setItem(
    ITEM_NAME,
    JSON.stringify({
      ...user,
      hyGroupCn: '',
    }),
  )
}

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem(ITEM_NAME) || '{}')
  return user
}

const clearHeaders = () => {
  localStorage.removeItem(ITEM_NAME)
}

export { possibleUsers, cypressUids, setHeaders, removeLoggedInUsersGroups, getHeaders, clearHeaders }
