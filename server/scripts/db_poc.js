import 'module-alias/register'
import User from '../models/user.js'

require('dotenv').config()

const func = async () => {
  const start = new Date().valueOf()
  const user = await User.findOne({
    where: {
      uid: 'mluukkai',
    },
  })
  const end = new Date().valueOf()
  // eslint-disable-next-line no-console
  console.log(`query took ${(end - start) / 1000} sec, ${user ? user.uid : 'none'}`)
  process.exit()
}

func()
