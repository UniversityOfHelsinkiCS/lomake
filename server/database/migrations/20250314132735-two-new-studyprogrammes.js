export const up = async ({ context: queryInterface }) => {
  const now = new Date()
  try {
    const faculty = await queryInterface.sequelize.query(`SELECT id FROM faculties WHERE code = 'H30'`, {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })

    const facultyId = faculty[0]?.id

    if (!facultyId) {
      // Faculty doesn't exist yet - this is expected in a fresh database before seeding
      // Skip the insertion silently since seeding will recreate the data from JAMI
      // eslint-disable-next-line no-console
      console.log('Migration skipped: Faculty H30 not found. This is expected before seeding.')
      return
    }

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
        locked_forms: JSON.stringify({
          yearly: false,
          'degree-reform': false,
          evaluation: false,
          'evaluation-faculty': false,
        }),
        claimed: false,
        primary_faculty_id: facultyId,
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
        locked_forms: JSON.stringify({
          yearly: false,
          'degree-reform': false,
          evaluation: false,
          'evaluation-faculty': false,
        }),
        claimed: false,
        primary_faculty_id: facultyId,
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
