export const up = ({ context: queryInterface }) => {
  return queryInterface.addConstraint('users', {
    fields: ['uid'],
    type: 'unique',
    name: 'uidUnique',
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeConstraint('users', 'uidUnique')
}
