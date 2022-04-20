const { inProduction } = require('@util/common')

const IAMmiddleware = async (req, res, next) => {
  if (req.path.includes('socket.io')) return next()
  if (!inProduction && req.path.includes('/cypress/')) return next()

  const { user } = req

  next()
}

module.exports = IAMmiddleware
