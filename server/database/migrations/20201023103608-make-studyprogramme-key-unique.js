export const up = ({ context: queryInterface }) => {
  return queryInterface.addConstraint('studyprogrammes', {
    fields: ['key'],
    type: 'unique',
    name: 'keyUnique',
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeConstraint('studyprogrammes', 'keyUnique')
}