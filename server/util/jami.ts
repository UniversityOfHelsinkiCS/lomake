import axios from 'axios'
import * as Sentry from '@sentry/node'
import { JAMI_URL, API_TOKEN, inProduction } from './common.js'
import { access } from 'fs'
import { KeyboardDoubleArrowLeftRounded } from '@mui/icons-material'
import { ProgrammeLevel } from '@/shared/lib/enums.js'

interface Faculty {
  readonly code: string
  readonly name: string
  readonly programmes: Readonly<Programme[]>
}

type Programme = {
  readonly key: string
  readonly name: string
  readonly level: ProgrammeLevel
  readonly companionFaculties: Readonly<string[]>
  readonly international: boolean
}

interface Access {
  specialGroup?: SpecialGroup
  access?: Record<string, OrganisationAccess>
}

type SpecialGroup = {
  [key: string]: boolean
}

type OrganisationAccess = {
  read?: boolean
  write?: boolean
  admin?: boolean
}

const jamiClient = axios.create({
  baseURL: JAMI_URL,
  params: {
    token: API_TOKEN,
    noLogging: !inProduction,
  }
})

export const getIamAccess = async (iamGroups: string[], attempt = 1): Promise<Access> => {
  try {
    const { data: iamAccess } = await jamiClient.post('/', {
      userId: "",
      iamGroups,
    })

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
      'grp-katselmus-projektiryhma',
      'grp-katselmus-ohjausryhma',
      'grp-a01807-svenskaarenden',
      'grp-tilannekuvaoymp',
      'grp-koordinaatioryhma',
      'yhy-ypa-hr-henkilostopaallikot',
    ]

    let lomakeAccess: Record<string, OrganisationAccess> = {}

    if (iamGroups.some((group) => lomakeKatselmus.includes(group))) {
      const organisation: Faculty[] = await getOrganisationData()

      organisation.forEach((faculty: Faculty) => {
        faculty.programmes.forEach((program: Programme) => {
          lomakeAccess[program.key] = { read: true, write: false, admin: false }
        })
      })
    }

    let { specialGroup, ...access } = iamAccess

    if (iamGroups.includes('hy-ypa-opa-ospa')) specialGroup = { admin: true, ...specialGroup }

    return { specialGroup, access: { ...lomakeAccess, ...access } }
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

export const getJoryMapFromJami = async (): Promise<Faculty[]> => {
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
