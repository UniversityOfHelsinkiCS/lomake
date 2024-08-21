import axios from 'axios'
import { inProduction } from '../util/common.js'

const pateToken = process.env.PATE_API_TOKEN || ''
const pateUrl = process.env.PATE_URL || ''

const pateClient = axios.create({
  baseURL: pateUrl,
  params: {
    token: pateToken,
  },
})

const template = {
  from: 'Tilannekuvalomake Robot',
}

const baseSettings = {
  color: 'orange',
  header: 'Sent by Tilannekuvalomake',
  dryrun: false,
}

const sendEmail = async (options = {}) => {
  if (!inProduction) throw new Error('Email sending is disabled in development mode.')
  if (!pateToken) throw new Error('Email sending failed because pate token is missing.')
  const result = await pateClient.post('/', options)
  return result
}

const accessMessageText = (user, programme) => {
  return `<p>Käyttäjä  ${user} on saanut väliaikaisen käyttöoikeuden koulutusohjelmaan ${
    programme.fi ?? programme.en
  } <a href="https://opetushallinto.cs.helsinki.fi/tilannekuva">tilannekuvalomakkeella</a>.</p>
    <p>Tämä on automaattinen tiedote, tiedustelut: ospa@helsinki.fi</p>
    <p>User ${user} has been granted temporary access to the study programme ${
      programme.en ?? programme.fi
    } in the <a href="https://opetushallinto.cs.helsinki.fi/tilannekuva">self-assessment form</a>.</p>
    <p>This is an automated notification, inquiries: ospa@helsinki.fi</p>`
}

const sendNewTempAccessNotification = (userFullName, programme, kojoEmail) =>
  sendEmail({
    template,
    emails: [
      {
        to: kojoEmail,
        subject: 'New access right in Tilannekuvalomake',
        text: accessMessageText(userFullName, programme),
      },
    ],
    settings: {
      ...baseSettings,
      hideToska: true,
      disableToska: false,
    },
  })

export default { sendNewTempAccessNotification }
