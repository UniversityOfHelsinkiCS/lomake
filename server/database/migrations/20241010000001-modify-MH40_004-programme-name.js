export const up = async ({ context: queryInterface }) => {
  try {
    await queryInterface.sequelize.query(`UPDATE studyprogrammes SET name='{
    "fi": "Venäjän, Itä-Euroopan ja Euraasian tutkimuksen maisteriohjelma",
    "en": "Master''s Programme in Russian, Eastern European and Eurasian Studies",
    "se": "Magisterprogrammet i ryska, östeuropeiska och eurasiska studier"
      }' where key='MH40_004'`)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

export const down = async () => {}
