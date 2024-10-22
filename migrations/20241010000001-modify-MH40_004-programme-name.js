/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.query(`UPDATE studyprogrammes SET name='{
      "fi": "Venäjän, Euraasian ja itäisen Euroopan tutkimuksen maisteriohjelma",
      "en": "Master''s Programme in Russian, Eurasian and Eastern European Studies",
      "se": "Magisterprogrammet i ryska, eurasiska och östeuropeiska studier"
        }' where key='MH40_004'`),

  down: queryInterface => {},
}
