const fakeShibboMiddleware = (req, res, next) => {
  req.headers.shib_logout_url = 'https://helsinki.fi'
  req.headers.mail = 'pekka.m.testaaja@helsinki.fi'
  req.headers.uid = 'pemtest'
  req.headers.givenname = 'Pekka'
  req.headers.sn = 'Testääjä'
  next()
}

module.exports = fakeShibboMiddleware
