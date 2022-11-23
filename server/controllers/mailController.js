// const axios = require('axios')
// const { inProduction } = require('@util/common')

// const pateToken = process.env.PATE_API_TOKEN || ''

// const pateClient = axios.create({
//   baseURL: 'https://importer.cs.helsinki.fi/api/pate/',
//   params: {
//     token: pateToken,
//   },
// })

// const template = {
//   from: 'Tilannekuvalomake Robot',
// }

// const baseSettings = {
//   color: 'orange',
//   header: 'Sent by Tilannekuvalomake',
//   dryrun: false,
// }

// const sendEmail = async (options = {}) => {
//   if (!inProduction) throw new Error('Email sending is disabled in development mode.')
//   if (!pateToken) throw new Error('Email sending failed because pate token is missing.')
//   const result = await pateClient.post('/', options)
//   return result
// }

// const accessMessageText = (user, programme) => {
//   return `<p>User ${user} has been granted temporary access to the study programme ${programme} in the <a href="https://opetushallinto.cs.helsinki.fi/tilannekuva">self-assessment form</a> (Tilannekuvalomake).</p>
//     <p>If you have any questions about this event, please contact OSPA </p>
//     <p>(This is an automated notification to the director of the mentioned programme.)</p>`
// }

// const sendNewTempAccessNotification = ({ userFullName, programmeName, kojoEmail }) =>
//   sendEmail({
//     template,
//     emails: [
//       {
//         to: 'Toska <grp-toska@helsinki.fi>', // kojoEmail
//         subject: 'New user in Tilannekuvalomake',
//         text: accessMessageText(userFullName, programmeName),
//       },
//     ],
//     settings: {
//       ...baseSettings,
//       hideToska: true,
//       disableToska: true,
//     },
//   })

// module.exports = {
//   sendNewTempAccessNotification,
// }
