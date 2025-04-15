import { STRING } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('reports', 'studyprogramme_key', {
    type: STRING,
    allowNull: false,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('reports', 'studyprogramme_key')
}
