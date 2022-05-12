const shibbolethHeaders = [
  'uid',
  'givenname', // First name
  'mail', // Email
  'sn', // Last name
]

const shibbolethCharsetMiddleware = (req, _, next) => {
  shibbolethHeaders.forEach(header => {
    if (!req.headers[header]) return
    req.headers[header] = Buffer.from(req.headers[header], 'latin1').toString('utf8')
  })
  next()
}

module.exports = shibbolethCharsetMiddleware
