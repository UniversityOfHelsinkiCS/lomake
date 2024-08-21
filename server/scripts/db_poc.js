import 'module-alias/register'
import db from '../models/index.js'

require('dotenv').config()

const func = async () => {
  const start = new Date().valueOf()
  const user = await db.user.findOne({
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
