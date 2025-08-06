import { isAdmin } from '../../config/common.js'
import User from '../models/user.js'

const currentUser = async (req, _, next) => {
  if (req.path.includes('/cypress/')) return next()

  if (isAdmin(req.user)) {
    const loggedInAs = req.headers['x-admin-logged-in-as']
    if (loggedInAs) {
      const fakeUser = await User.findOne({ where: { uid: loggedInAs } })

      req.user = fakeUser
    }
  }
  return next()
}

export default currentUser
