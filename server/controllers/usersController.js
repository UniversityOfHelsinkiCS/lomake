const db = require('@models')
const logger = require('@util/logger')

const getCurrentUser = async (req, res) => {
  if (req.user) {
    try {
      const now = new Date()
      await db.user.update({ lastLogin: now }, {
        where: {
          uid: req.user.uid
        }
      })
      
    } catch (error) {
      logger.error(`Failed to update the last login for user: ${req.user.uid}`)
    }
  }
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

const createUser = async (req, res) => {
  try {
    const user = req.body
    const newUser = await db.user.create({
      uid: user.uid,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      admin: user.admin,
      wideReadAccess: false,
      specialGroups: {}
    })

    if (newUser) return res.status(200).json(newUser)
  } catch (e) {
    logger.error(e.message)
    res.status(500).json({ error: 'Database error' })
  }
}

const editUserAccess = async (req, res) => {
  try {
    let body = req.body
    let newProgrammeAccess

    const user = await db.user.findOne({ where: { id: req.params.id } })
    if (!user) return res.status(400).json({ error: 'id not found.' })

    /**
     * Trying to remove admin rights from given program...
     * Need to check that user is not the last admin for this programme.
     */
    if (body.admin === false) {
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

    /**
     * Dont allow adjusting read/write permissions of admin user:
     */
    if (user.access[req.params.programme].admin && body.admin !== false) {
      return res.status(200).json(user)
    }

    if (body['admin'] === true) {
      newProgrammeAccess = {
        read: true,
        write: true,
        admin: true,
      }
    }

    if (body['admin'] === false) {
      newProgrammeAccess = {
        read: true,
        write: true,
        admin: false,
      }
    }

    if (body['write'] === true) {
      newProgrammeAccess = {
        read: true,
        write: true,
      }
    }

    if (body['write'] === false) {
      newProgrammeAccess = {
        read: true,
        write: false,
      }
    }

    if (body['read'] === true) {
      newProgrammeAccess = {
        read: true,
      }
    }

    if (body['read'] === false) {
      newProgrammeAccess = {
        read: false,
        write: false,
      }
    }

    user.access = {
      ...user.access,
      [req.params.programme]: { ...user.access[req.params.programme], ...newProgrammeAccess },
    }

    await user.save()

    return res.status(200).json(user)
  } catch (e) {
    logger.error(e.message)
    res.status(500).json({ error: 'Database error' })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { lastname = '-', firstname } = await db.user.findOne({
      where: {
        id: req.params.id
      }, 
      raw: true
    })

    await db.user.destroy({
      where: {
        id: req.params.id
      }
    })

    logger.info(`User ${firstname} ${lastname} deleted by ${req.user.firstname} ${req.user.lastname}`)
    return res.status(200).send(req.params.id)
  } catch (e) {
    logger.error(e.message)
    res.status(500).json({ error: 'Database error' })
  }
}

const getUserOrganizations = async (req, res) => {
  try {
    const params = req.params

    const userInfo = await db.user.findOne({ where: { uid: params.username } })

    if (!userInfo) {
      res.send({})
    } else {
      res.send(userInfo.access)
    }
  } catch (e) {
    res.status(500).json({ error: 'Database error ' })
  }
}

module.exports = {
  getCurrentUser,
  getLogoutUrl,
  getAllUsers,
  editUser,
  createUser,
  getProgrammesUsers,
  editUserAccess,
  deleteUser,
  getUserOrganizations,
}
