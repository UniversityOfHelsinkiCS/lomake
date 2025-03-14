export const up = async ({ context: queryInterface }) => {
  const now = new Date()
  try {
    await queryInterface.bulkInsert('studyprogrammes', [
      {
        key: 'KH30_003',
        name: JSON.stringify({
          fi: 'Soveltavan psykologian kandiohjelma',
          en: "Bachelor's Programme in Applied Psychology",
          se: 'Kandidatprogrammet i tillämpad psykologi',
        }),
        level: 'bachelor',
        international: false,
        locked: false,
        claimed: false,
        primary_faculty_id: 3,
        created_at: now,
        updated_at: now,
      },
      {
        key: 'MH30_006',
        name: JSON.stringify({
          fi: 'Terveydenhuollon kehittämisen maisteriohjelma',
          en: "Master's Programme in Health Care Development",
          se: 'Magisterprogrammet i hälsovårdsutveckling',
        }),
        level: 'master',
        international: false,
        locked: false,
        claimed: false,
        primary_faculty_id: 3,
        created_at: now,
        updated_at: now,
      },
    ])
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

export const down = async ({ context: queryInterface }) => {
  try {
    await queryInterface.bulkDelete('studyprogrammes', {
      key: ['KH30_003', 'MH30_006'],
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
