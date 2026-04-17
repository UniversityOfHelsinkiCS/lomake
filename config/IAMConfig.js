const doctoralIams = ['hy-tine']

// expired hy-tutkijakoulut-dshealth-jory
const doctoralWritingIams = ['hy-ypa-tutto-toht', 'hy-tutkijakoulu-johtokunta']

const isUniversityWideWritingGroups = [
  'hy-ypa-kopa-keskusta-1',
  'hy-ypa-kopa-keskusta-2',
  'hy-ypa-kopa-keskusta-3',
  'hy-ypa-kopa-kruununhaka-1',
  'hy-ypa-kopa-kruununhaka-2',
  'hy-ypa-kopa-kruununhaka-3',
  'hy-ypa-kopa-kumpula-1',
  'hy-ypa-kopa-kumpula-2',
  'hy-ypa-kopa-meilahti-1',
  'hy-ypa-kopa-meilahti-2',
  'hy-ypa-kopa-viikki-1',
  'hy-ypa-kopa-viikki-2',
  'hy-kopa-koulutusasiantuntijat',
]

const lomakeKatselmus = [
  'hy-ttdk-dekanaatti',
  'hy-oiktdk-dekanaatti',
  'hy-ltdk-dekanaatti',
  'hy-humtdk-dekanaatti',
  'hy-mltdk-dekanaatti',
  'hy-ftdk-dekanaatti',
  'hy-bytdk-dekanaatti',
  'hy-ktdk-dekanaatti',
  'hy-valttdk-dekanaatti',
  'hy-sskh-rehtoraatti',
  'hy-mmtdk-dekanaatti',
  'hy-eltdk-dekanaatti',
  'hy-ypa-toimi-helsinki',
  'hy-ypa-opa-oymp-jory',
  'grp-a01807-svenskaarenden',
  'grp-koordinaatioryhma',
  'hy-ypa-hr-henkilostopaallikot',
  'hy-ypa-hr-kestavahyvinvointi',
]

const superAdminGroups = ['grp-toska']

const adminGroups = ['grp-ko-laadunhallinta']

const IAMsToTable = [
  ...doctoralIams,
  ...doctoralWritingIams,
  ...isUniversityWideWritingGroups,
  ...adminGroups,
  ...superAdminGroups,
  ...lomakeKatselmus,
  'hy-employee',
]

export {
  doctoralIams,
  doctoralWritingIams,
  isUniversityWideWritingGroups,
  superAdminGroups,
  adminGroups,
  IAMsToTable,
  lomakeKatselmus,
}
