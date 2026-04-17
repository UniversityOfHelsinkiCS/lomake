import { z, ZodError } from 'zod'

// const LiikennevalotEnum = z.enum(['Ei arviota', 'Punainen', 'Keltainen', 'Vaaleanvihreä', 'Tummanvihreä'])

export const KandiohjelmatValuesSchema = z
  .object({
    // Perustiedot
    'Koulutusohjelman koodi': z.string(),
    'Koulutusohjelman nimi': z.string(),

    // Kandiohjelman avainluvut: 🚨 NONE OF THE 'Avainlvut' SHOULD BE OPTIONAL, but data.xlsx is still not ready
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
    'Opetusresurssien määrä': z.number().optional(),
    'Opetuksen tuottavuus': z.number().optional(),
    'Tilojen käyttö': z.number().optional(),
    'Jatkuvan oppimisen tulos': z.number().optional(),

    // Muut
    Vuosi: z.number().int(),
    Lisätietoja_fi: z.string().optional(),
    Lisätietoja_en: z.string().optional(),
    Lisätietoja_se: z.string().optional(),
    Lisätietoja_2_fi: z.string().optional(),
    Lisätietoja_2_en: z.string().optional(),
    Lisätietoja_2_se: z.string().optional(),
  })
  .strict() // to disallow extra keys,

export const MaisteriohjelmatValuesSchema = z
  .object({
    // Perustiedot
    'Koulutusohjelman koodi': z.string(),
    'Koulutusohjelman nimi': z.string(),

    // Maisteriohjelman avainluvut: 🚨 NONE OF THE 'Avainlvut' SHOULD BE OPTIONAL, but data.xlsx is still not ready
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
    'Opetusresurssien määrä': z.number().optional(),
    'Opetuksen tuottavuus': z.number().optional(),
    'Tilojen käyttö': z.number().optional(),
    'Jatkuvan oppimisen tulos': z.number().optional(),

    // Muut
    Vuosi: z.number().int(),
    Lisätietoja_fi: z.string().optional(),
    Lisätietoja_en: z.string().optional(),
    Lisätietoja_se: z.string().optional(),
    Lisätietoja_2_fi: z.string().optional(),
    Lisätietoja_2_en: z.string().optional(),
    Lisätietoja_2_se: z.string().optional(),
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
    additionalInfo2: z
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
      .regex(
        /^\d+(?:\.\d+)?;\d+(?:\.\d+)?;\d+(?:\.\d+)?;\d+(?:\.\d+)?$/,
        'Should be in format number;number;number;number. Use . as decimal separator'
      )
      .optional(), //🚨 SHOULD NOT BE OPTIONAL, but data.xlsx is not yet ready
    ohjelmanTaso: z.enum(['bachelor', 'master', 'doctoral']),
    liikennevalo: z.boolean(),
    mittarinRajat: z
      .string()
      .regex(/^\d+(?:\.\d+)?;\d+(?:\.\d+)?$/, 'Should be in format number;number. Use . as decimal separator')
      .optional(), //🚨 SHOULD NOT BE OPTIONAL, but data.xlsx is not yet ready
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
        se: z.string().optional(), // delete optionality when updated
        en: z.string().optional(), // delete optionality when updated
      })
      .strict(),
    avainluvunArvo: z.string(),
  })
  .strict() // to disallow extra keys

export const MetadataRawSchema = z
  .object({
    Yksikkö: z.literal('%').optional(),
    Kynnysarvot: z.string().optional(), // delete optionality when updated
    'Ohjelman taso': z.string(),
    'Mittarin rajat': z.string().optional(), // delete optionality when updated
    Liikennevalo: z.boolean(),
    Arviointialue_fi: z.string(),
    Arviointialue_en: z.string(),
    Arviointialue_se: z.string(),
    Määritelmä_fi: z.string(),
    Määritelmä_se: z.string().optional(), // delete optionality when updated
    Määritelmä_en: z.string().optional(), // delete optionality when updated
    'Avainluvun nimi_en': z.string(),
    'Avainluvun nimi_fi': z.string(),
    'Avainluvun nimi_se': z.string(),
  })
  .strict() // to disallow extra keys

export const DocumentFormSchema = z
  .object({
    title: z.string().min(3, 'title'),
    date: z.string().date('date'),
    participants: z.string().min(3, 'participants'),
    matters: z.string().min(100, 'matters'),
    schedule: z.string().min(3, 'schedule'),
    followupDate: z.string().date('date'),
  })
  .strict()

export const QualityDocumentFormSchema = z
  .object({
    title: z.string().min(3, 'title'),
    curriculumDevelopmentChangesExample1: z.string().max(1500).optional(),
    curriculumDevelopmentCommunicationExample1: z.string().max(1500).optional(),
    curriculumDevelopmentFeedbackSourceExample1: z.string().max(1500).optional(),
    curriculumDevelopmentNameExample1: z.string().optional(),
    curriculumDevelopmentChangesExample2: z.string().max(1500).optional(),
    curriculumDevelopmentCommunicationExample2: z.string().max(1500).optional(),
    curriculumDevelopmentFeedbackSourceExample2: z.string().max(1500).optional(),
    curriculumDevelopmentNameExample2: z.string().optional(),
    curriculumDevelopmentChangesExample3: z.string().max(1500).optional(),
    curriculumDevelopmentCommunicationExample3: z.string().max(1500).optional(),
    curriculumDevelopmentFeedbackSourceExample3: z.string().max(1500).optional(),
    curriculumDevelopmentNameExample3: z.string().optional(),
    guidancePoliciesChangesExample1: z.string().max(1500).optional(),
    guidancePoliciesCommunicationExample1: z.string().max(1500).optional(),
    guidancePoliciesFeedbackSourceExample1: z.string().max(1500).optional(),
    guidancePoliciesNameExample1: z.string().optional(),
    guidancePoliciesChangesExample2: z.string().max(1500).optional(),
    guidancePoliciesCommunicationExample2: z.string().max(1500).optional(),
    guidancePoliciesFeedbackSourceExample2: z.string().max(1500).optional(),
    guidancePoliciesNameExample2: z.string().optional(),
    guidancePoliciesChangesExample3: z.string().max(1500).optional(),
    guidancePoliciesCommunicationExample3: z.string().max(1500).optional(),
    guidancePoliciesFeedbackSourceExample3: z.string().max(1500).optional(),
    guidancePoliciesNameExample3: z.string().optional(),
    learningObjectivesAssessment: z.string().optional(),
    learningObjectivesAssessmentChangesExample1: z.string().max(1500).optional(),
    learningObjectivesAssessmentCommunicationExample1: z.string().max(1500).optional(),
    learningObjectivesAssessmentFeedbackSourceExample1: z.string().max(1500).optional(),
    learningObjectivesAssessmentNameExample1: z.string().optional(),
    learningObjectivesAssessmentChangesExample2: z.string().max(1500).optional(),
    learningObjectivesAssessmentCommunicationExample2: z.string().max(1500).optional(),
    learningObjectivesAssessmentFeedbackSourceExample2: z.string().max(1500).optional(),
    learningObjectivesAssessmentNameExample2: z.string().optional(),
    learningObjectivesAssessmentChangesExample3: z.string().max(1500).optional(),
    learningObjectivesAssessmentCommunicationExample3: z.string().max(1500).optional(),
    learningObjectivesAssessmentFeedbackSourceExample3: z.string().max(1500).optional(),
    learningObjectivesAssessmentNameExample3: z.string().optional(),
    learningObjectivesAssessmentRegularity: z.enum([
      'lessFrequently',
      'perCurriculumCycle',
      'annually',
      'everySemester',
      'moreFrequently',
    ]),
    feedbackSources: z
      .array(
        z
          .object({
            name: z.string().max(50),
            regularity: z.enum(['lessFrequently', 'perCurriculumCycle', 'annually', 'everySemester', 'moreFrequently']),
            description: z.string().optional(),
          })
          .strict()
      )
      .min(1, 'feedbackSources'),
    feedbackUtilizationExamples: z.string().max(1500).optional(),
  })
  .strict()

export const InterventionProcedureCloseSchema = z
  .object({
    reason: z.string(),
    additionalInfo: z.string(),
  })
  .strict()

export const logZodError = (error: ZodError) => {
  const parsedErrors: any[] = []
  const typesOfErrors: Record<string, number> = {}

  error.errors.forEach(e => {
    parsedErrors.push(e)

    if (e.code in typesOfErrors) {
      typesOfErrors[e.code]++
    } else {
      typesOfErrors[e.code] = 1
    }
  })

  // Pretty formatted log message
  // eslint-disable-next-line no-console
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
      ${index + 1}. 🔻 Path: ${e.path.join('.') ?? 'N/A'}
          🔹 Error Type: ${e.code}
          🔹 Expected: ${JSON.stringify(e.expected, null, 2)}
          🔹 Received: ${JSON.stringify(e.received, null, 2)}
          🔹 Error message: ${e.message}`
        )
        .join('\n')}
    
      --------------------------------
      `)
}

export { ZodError }
