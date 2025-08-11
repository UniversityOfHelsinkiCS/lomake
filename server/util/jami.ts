import axios from 'axios'
import * as Sentry from '@sentry/node'
import { JAMI_URL, API_TOKEN, inProduction } from './common.js'
import { access } from 'fs'
import { KeyboardDoubleArrowLeftRounded } from '@mui/icons-material'


console.log(JAMI_URL, "jami")
const jamiClient = axios.create({
  baseURL: JAMI_URL,
  params: {
    token: API_TOKEN,
    noLogging: !inProduction,
  }
})

export const getIamAccess = async (iamGroups: string[], attempt = 1): Promise<Record<string, Record<string, string>>> => {
  try {
    const { data: iamAccess } = await jamiClient.post('/', {
      userId: "",
      iamGroups,
    })

    let { specialGroup, ...access } = iamAccess

    console.log("Här är vi", iamGroups)

    const lomakeKatselmus = [
      'hy-rehtoraatti',
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
      'grp-katselmus-projektiryhma',
      'grp-katselmus-ohjausryhma',
      'grp-a01807-svenskaarenden',
      'grp-tilannekuvaoymp',
      'grp-koordinaatioryhma',
      'yhy-ypa-hr-henkilostopaallikot',
    ]

    if (iamGroups.includes('hy-ypa-opa-ospa')) specialGroup = { admin: true, ...specialGroup }
    else if (iamGroups.some((group) => lomakeKatselmus.includes(group))) {
      const organisation = await getOrganisationData()

      const access: any = {}
      organisation.forEach((faculty: any) => {
        faculty.programmes.forEach((program: any) => {
          access[program.key] = { read: true, write: false, admin: false }
        })
      })
      return access
    }

    return { specialGroup, access: { ...access } }
  } catch (error: any) {
    if (attempt > 3) {
      console.log('[Jami] error: ', error)
      Sentry.captureException(error)

      return {}
    }

    return getIamAccess(iamGroups, attempt + 1)
  }
}


export const getOrganisationData = async () => {
  const { data } = await jamiClient.get('/organisation-data')
  return data
}

export const getJoryMapFromJami = async () => {
  const { data } = await jamiClient.get('/jory-map')

  return data
}

export const testJami = async () => {
  try {
    await jamiClient.get('/ping', { timeout: 4000 })
    console.log('JAMI connected')
  } catch (error) {
    console.log(error)
    console.log(JAMI_URL)
    console.log('JAMI not responding :(')
    console.log('Are you sure you are using the latest JAMI image?')
  }
}
