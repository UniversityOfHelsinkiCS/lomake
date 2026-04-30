const doctoralIams = ['hy-tine']

// expired hy-tutkijakoulut-dshealth-jory
const doctoralWritingIams = ['hy-ypa-tutto-toht', 'hy-tutkijakoulu-johtokunta']

const universityWideWritingGroups = [
  'hy-ypa-kopa-koulutuspaallikot',
  'hy-kopa-koulutusasiantuntijat',
  'hy-ypa-kopa-johtoryhma',
]

const lomakeKatselmus = [
  'hy-sskh-rehtoraatti',
  'hy-ypa-toimi-helsinki',
  'hy-ypa-opa-oymp-jory',
  'grp-a01807-svenskaarenden',
  'grp-koordinaatioryhma',
  'hy-ypa-hr-henkilostopaallikot',
  'hy-ypa-hr-kestavahyvinvointi',
]

const dekanaatti = [
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
]

const superAdminGroups = ['grp-toska']

const adminGroups = ['grp-ko-laadunhallinta']

const IAMsToTable = [
  ...doctoralIams,
  ...doctoralWritingIams,
  ...universityWideWritingGroups,
  ...adminGroups,
  ...superAdminGroups,
  ...lomakeKatselmus,
  ...dekanaatti,
  'hy-employees',
]

export {
  doctoralIams,
  doctoralWritingIams,
  superAdminGroups,
  adminGroups,
  IAMsToTable,
  lomakeKatselmus,
  universityWideWritingGroups,
}
