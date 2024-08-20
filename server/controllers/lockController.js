const logger = require('../util/logger')
const { getLockForHttp } = require('../websocket')

const getLock = async (req, res) => {
  try {
    const { field } = req.body
    const { room } = req.params

    const data = getLockForHttp(req.user, { field, room })
    if (!data) {
      return res.status(401).json({ error: 'Field locked....' })
    }

    return res.json(data)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'Error' })
  }
}

module.exports = {
  getLock,
}
