import axios from 'axios'
import * as Sentry from '@sentry/node'
import { JAMI_URL, API_TOKEN, inProduction } from './common.js'
import { ProgrammeLevel } from '@/shared/lib/enums.js'
import logger from './logger.js'
import { lomakeKatselmus, universityWideWritingGroups } from '../../config/IAMConfig'
import { studentIams } from '../../config/common.js'

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

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
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
  },
})

export const getIamAccess = async (iamGroups: string[], attempt = 1): Promise<Access> => {
  try {
    const { data: iamAccess } = await jamiClient.post('/', {
      userId: '',
      iamGroups,
    })

    // eslint-disable-next-line prefer-const
    let lomakeAccess: Record<string, OrganisationAccess> = {}

    if (iamGroups.some(group => lomakeKatselmus.includes(group))) {
      const organisation = await getOrganisationData()

      organisation.forEach((faculty: Faculty) => {
        faculty.programmes.forEach((program: Programme) => {
          lomakeAccess[program.key] = { read: true, write: false, admin: false }
        })
      })
    }

    if (iamGroups.some(group => universityWideWritingGroups.includes(group))) {
      const organisation = await getOrganisationData()
      organisation.forEach((faculty: Faculty) => {
        faculty.programmes.forEach((program: Programme) => {
          lomakeAccess[program.key] = { read: true, write: true, admin: false }
        })
      })
    }

    // eslint-disable-next-line prefer-const
    let { specialGroup, ...access } = iamAccess

    // If user has jory and student access, allow write to the programmes specified for the user in Jami
    if (iamGroups.find(iam => /hy-[a-z-]+-jory/.test(iam)) && iamGroups.some(group => studentIams.includes(group))) {
      if (access) {
        Object.keys(access).forEach((code: string) => {
          access[code] = { read: true, write: true, admin: false }
        })
      }
    }

    if (iamGroups.includes('grp-ko-laadunhallinta')) specialGroup = { admin: true, ...specialGroup }

    return { specialGroup, access: { ...lomakeAccess, ...access } }
  } catch (error: any) {
    if (attempt > 3) {
      logger.error('[Jami] error: ', error)
      Sentry.captureException(error)

      return {}
    }

    return getIamAccess(iamGroups, attempt + 1)
  }
}

export const getOrganisationData = async (): Promise<Faculty[]> => {
  const { data } = await jamiClient.get('/organisation-data')
  return data
}

export const getJoryMapFromJami = async (): Promise<Record<string, string | string[]>> => {
  const { data } = await jamiClient.get('/jory-map')
  return data
}

export const testJami = async () => {
  try {
    await jamiClient.get('/ping', { timeout: 4000 })
    logger.info('JAMI connected')
  } catch (error) {
    logger.error(error)
    logger.error(JAMI_URL)
    logger.error('JAMI not responding :(')
    logger.error('Are you sure you are using the latest JAMI image?')
  }
}
