import { z, ZodError } from 'zod'

export const KandiohjelmatValuesSchema = z
  .object({
    // Perustiedot
    'Koulutusohjelman koodi': z.string(),
    'Koulutusohjelman nimi': z.string(),

    Hakupaine: z.number().optional(),
    'Ensisijaiset hakijat': z.number().optional(),
    'Aloituspaikkojen täyttö': z.number().optional(),
    'Opintonsa aloittaneet': z.number().optional(),
    Tutkinnot: z.number().optional(),
    'Tavoiteajassa valmistuminen': z.number().optional(),
    'Opintojen eteneminen': z.number().optional(),
    'Läsnäolevien kasautuminen': z.number().optional(),
    'Opiskelijoiden hyvinvointi': z.number().optional(),
    'Opintojen ohjaus': z.number().optional(),
    'Opetuksen laatu': z.number().optional(),
    Palauteaktiivisuus: z.number().optional(),

    // Muut
    Vuosi: z.number().int(),
    Lisätietoja_fi: z.string().optional(),
    Lisätietoja_en: z.string().optional(),
    Lisätietoja_se: z.string().optional(),
  })
  .strict() // to disallow extra keys,

export const MaisteriohjelmatValuesSchema = z
  .object({
    // Perustiedot
    'Koulutusohjelman koodi': z.string(),
    'Koulutusohjelman nimi': z.string(),

    Hakijat: z.number().optional(),
    Hakupaine: z.number().optional(),
    Aloituspaikat: z.number().optional(),
    'Opintonsa aloittaneet': z.number().optional(),
    Tutkinnot: z.number().optional(),
    'Tavoiteajassa valmistuminen': z.number().optional(),
    'Valmistuminen tavoiteajan jälkeen': z.number().optional(),
    'Läsnäolevien kasautuminen': z.number().optional(),
    'Opetuksen linjakkuus': z.number().optional(),
    'Oppimista edistävä palaute': z.number().optional(),
    'Opintojen kiinnostavuus': z.number().optional(),
    Työllistyminen: z.number().optional(),

    // Muut
    Vuosi: z.number().int(),
    Lisätietoja_fi: z.string().optional(),
    Lisätietoja_en: z.string().optional(),
    Lisätietoja_se: z.string().optional(),
  })
  .strict() // to disallow extra keys,

export const KeyDataProgrammeSchema = z
  .object({
    koulutusohjelmakoodi: z.string(),
    koulutusohjelma: z
      .object({
        fi: z.string(),
        se: z.string(),
        en: z.string(),
      })
      .strict(),
    values: z.record(z.string(), z.any()),
    year: z.number().int(),
    international: z.boolean().optional(),
    level: z.string().optional(),
    additionalInfo: z
      .object({
        fi: z.string().optional(),
        se: z.string().optional(),
        en: z.string().optional(),
      })
      .strict(),
  })
  .strict() // to disallow extra keys

export const MetadataSchema = z
  .object({
    yksikko: z.literal('%').optional(),
    kynnysarvot: z
      .string()
      .regex(/^\d+;\d+;\d+;\d+$/, 'Should be in format number;number;number;number')
      .optional(),
    ohjelmanTaso: z.enum(['bachelor', 'master', 'doctoral']),
    liikennevalo: z.boolean(),
    mittarinRajat: z
      .string()
      .regex(/^\d+;\d+$/, 'Should be in format number;number')
      .optional(),
    arviointialue: z.string(),
    avainluvunNimi: z
      .object({
        fi: z.string(),
        se: z.string(),
        en: z.string(),
      })
      .strict(),
    maaritelma: z
      .object({
        fi: z.string(),
        se: z.string().optional(),
        en: z.string().optional(),
      })
      .strict(),
    avainluvunArvo: z.string(),
  })
  .strict() // to disallow extra keys

export const MetadataRawSchema = z
  .object({
    Yksikkö: z.literal('%').optional(),
    Kynnysarvot: z.string().optional(),
    'Ohjelman taso': z.string(),
    'Mittarin rajat': z.string().optional(),
    Liikennevalo: z.boolean(),
    Arviointialue_fi: z.string(),
    Arviointialue_en: z.string(),
    Arviointialue_se: z.string(),
    Määritelmä_fi: z.string(),
    Määritelmä_se: z.string().optional(),
    Määritelmä_en: z.string().optional(),
    'Avainluvun nimi_en': z.string(),
    'Avainluvun nimi_fi': z.string(),
    'Avainluvun nimi_se': z.string(),
  })
  .strict() // to disallow extra keys

export const DocumentFormSchema = z.object({
  title: z.string().min(3, 'title'),
  date: z.string().date('date'),
  participants: z.string().min(3, 'participants'),
  matters: z.string().min(100, 'matters'),
  schedule: z.string().min(3, 'schedule'),
  followupDate: z.string().date('date'),
}).strict()

export const InterventionProcedureCloseSchema = z.object({
  reason: z.string(),
  additionalInfo: z.string(),
}).strict()

export const logZodError = (error: ZodError) => {
  let parsedErrors: any[] = []
  let typesOfErrors: { [key: string]: number } = {}

  error.errors.forEach(e => {
    parsedErrors.push(e)

    if (e.code in typesOfErrors) {
      typesOfErrors[e.code]++
    } else {
      typesOfErrors[e.code] = 1
    }
  })

  // Pretty formatted log message
  console.error(`
      ❌ Validation Error Report ❌
      --------------------------------
      🔹 Total Errors: ${error.errors.length}
      
      🔹 Types of Errors:
      ${Object.entries(typesOfErrors)
      .map(([type, count]) => `    - ${type}: ${count}`)
      .join('\n')}
  
      ${parsedErrors
      .map(
        (e, index) => `
      ${index + 1}. 🔻 Path: ${e.path.join('.') || 'N/A'}
          🔹 Error Type: ${e.code}
          🔹 Expected: ${JSON.stringify(e.expected, null, 2)}
          🔹 Received: ${JSON.stringify(e.received, null, 2)}
          🔹 Error message: ${e.message}`,
      )
      .join('\n')}
    
      --------------------------------
      `)
}

export { ZodError }
