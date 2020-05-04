const db = require('@models')
const logger = require('@util/logger')

const getCurrentUser = (req, res) => {
  res.send(req.user)
}

const getLogoutUrl = async (req, res) => {
  try {
    const logoutUrl = req.headers.shib_logout_url || req.headers.logout_url
    const { returnUrl } = req.body
    if (logoutUrl) {
      return res
        .status(200)
        .send({ logoutUrl: `${logoutUrl}?return=${returnUrl || ''}` })
        .end()
    }
    return res
      .status(200)
      .send({ logoutUrl: returnUrl || '' })
      .end()
  } catch (err) {
    return res.status(500).json({ message: 'Error with logout', err })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({})
    res.json(users)
  } catch (e) {
    logger.error(e)
    res.status(500).json({ error: 'Database error' })
  }
}

const getProgrammesUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({})
    const programme = req.params.programme

    const filteredUsers = users.filter((u) => u.access[programme])

    res.json(filteredUsers)
  } catch (e) {
    logger.error(e)
    res.status(500).json({ error: 'Database error' })
  }
}

const editUser = async (req, res) => {
  try {
    const user = req.body

    const [rows, [updatedUser]] = await db.user.update(user, {
      returning: true,
      where: { id: req.params.id },
    })
    if (rows) return res.status(200).json(updatedUser)
    return res.status(400).json({ error: 'id not found.' })
  } catch (e) {
    logger.error(e.message)
    res.status(500).json({ error: 'Database error' })
  }
}

const editUserAccess = async (req, res) => {
  try {
    const programmeAccess = req.body

    const user = await db.user.findOne({ where: { id: req.params.id } })
    if (!user) return res.status(400).json({ error: 'id not found.' })

    /**
     * Trying to remove admin rights from given program...
     * Need to check that user is not the last admin for this programme.
     */
    if (req.body.admin === false) {
      const currentAdminCount = await db.user.count({
        where: {
          access: {
            [req.params.programme]: { admin: 'true' },
          },
        },
      })

      if (currentAdminCount <= 1) {
        return res.status(200).json(user)
      }
    }

    user.access = {
      ...user.access,
      [req.params.programme]: { ...user.access[req.params.programme], ...programmeAccess },
    }

    await user.save()

    return res.status(200).json(user)
  } catch (e) {
    logger.error(e.message)
    res.status(500).json({ error: 'Database error' })
  }
}

module.exports = {
  getCurrentUser,
  getLogoutUrl,
  getAllUsers,
  editUser,
  getProgrammesUsers,
  editUserAccess,
}
