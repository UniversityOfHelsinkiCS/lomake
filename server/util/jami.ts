import axios from 'axios'
import * as Sentry from '@sentry/node'
import { JAMI_URL, API_TOKEN, inProduction } from './common.js'
import { access } from 'fs'

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

    const { specialGroup, ...access } = iamAccess

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
