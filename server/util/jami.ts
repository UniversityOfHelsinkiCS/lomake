import axios from 'axios'
import Sentry from '@sentry/node'
import { JAMI_URL, API_TOKEN, inProduction } from './common.js'
import logger from './logger'

type User = any

const jamiClient = axios.create({
  baseURL: JAMI_URL,
  params: {
    token: API_TOKEN,
    noLogging: !inProduction,
  }
})

const getUserIamAccess = async (user: User, attempt = 1) => {
  if (user.iamGroups.length === 0) return {}

  const { id, iamGroups } = user

  try {
    const { data: iamAccess } = await jamiClient.post('/', {
      userId: id,
      iamGroups,
    })

    return iamAccess
  } catch (error: any) {
    if (attempt > 3) {
      logger.error('[Jami] error: ', error)
      Sentry.captureException(error)

      return {}
    }

    return getUserIamAccess(user, attempt + 1)
  }
}
