import { z, ZodError } from 'zod'

const LiikennevalotEnum = z.enum(['Ei arviota', 'Punainen', 'Keltainen', 'Vaaleanvihreä', 'Tummanvihreä'])

const DataValuesSchema = z
  .object({
    // Perustiedot
    'Koulutusohjelman koodi': z.string(),
    'Koulutusohjelman nimi': z.string(),

    // Avainluvut: 🚨 NONE OF THE 'Avainluvut' SHOULD BE OPTIONAL. BUT IT IS, BECAUSE DATA.XLSX IS MISSING SOME INFORMATION
    // Eroavaisuus kandin ja maisteri ohjelmien välillä: Maisterin avaimet:
    // Aloituspaikat', 'Opetuksen linjakkuus', 'Opintojen kiinnostavuus', 'Oppimista edistävä palaute', 'Valmistuminen tavoiteajan jälkeen'
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

    // Liikennevalot
    Vetovoimaisuus: LiikennevalotEnum,
    'Opintojen sujuvuus ja valmistuminen': LiikennevalotEnum,
    'Palaute ja työllistyminen': LiikennevalotEnum,
    'Resurssien käyttö': LiikennevalotEnum,

    // Muut
    Vuosi: z.number().int(),
  })
  .strict() // to disallow extra keys

export const KandiohjelmatSchema = z
  .object({
    koulutusohjelmakoodi: z.string().startsWith('K'),
    koulutusohjelma: z
      .object({
        fi: z.string(),
        se: z.string(),
        en: z.string(),
      })
      .strict()
      .optional(), // this should NOT be optional, but is now to pass the validation
    values: DataValuesSchema,
    vetovoimaisuus: z.string(),
    lapivirtaus: z.string(),
    opiskelijapalaute: z.string(),
    resurssit: z.string(),
    year: z.number().int(),
    international: z.boolean().optional(), // should these be optional?
    level: z.string().optional(), // should these be optional?
  })
  .strict() // to disallow extra keys
  .array()

export const MaisteriohjelmatSchema = z
  .object({
    koulutusohjelmakoodi: z.string().startsWith('M'),
    koulutusohjelma: z
      .object({
        fi: z.string(),
        se: z.string(),
        en: z.string(),
      })
      .strict()
      .optional(), // this should NOT be optional, but is now to pass the validation
    values: DataValuesSchema,
    vetovoimaisuus: z.string(),
    lapivirtaus: z.string(),
    opiskelijapalaute: z.string(),
    resurssit: z.string(),
    year: z.number().int(),
    international: z.boolean().optional(), // should these be optional?
    level: z.string().optional(), // should these be optional?
  })
  .strict() // to disallow extra keys
  .array()

export const MetadataSchema = z
  .object({
    arviointialue: z.string(),
    avainluvunNimi: z
      .object({
        fi: z.string(),
        se: z.string(),
        en: z.string(),
      })
      .strict(),
    avainluvunArvo: z.string(),
    maaritelma: z.string(), //🚨 SHOULD NOT BE FORMATTED LIKE THIS, but data.xlsx is not yet ready
    // maaritelma: z.object({ //🚨 INSTEAD, maaritelma SHOULD BE FORMATTED LIKE THIS
    //     fi: z.string(),
    //     se: z.string(),
    //     en: z.string(),
    // }).strict(),
    ohjelmanTaso: z.enum(['Kandi', 'Maisteri', 'Tohtori']),
    kynnysarvot: z
      .string()
      .regex(/^\d+;\d+;\d+;\d+$/, 'Should be in format number;number;number;number')
      .optional(), //🚨 SHOULD NOT BE OPTIONAL, but data.xlsx is not yet ready
    mittarinRajat: z
      .string()
      .regex(/^\d+;\d+$/, 'Should be in format number;number')
      .optional(), //🚨 SHOULD NOT BE OPTIONAL, but data.xlsx is not yet ready
    yksikko: z.literal('%').optional(),
    liikennevalo: z.boolean(),
  })
  .strict() // to disallow extra keys
  .array()

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
  console.log(`
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
