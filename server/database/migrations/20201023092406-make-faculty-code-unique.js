export const up = ({ context: queryInterface }) => {
  return queryInterface.addConstraint('faculties', {
    fields: ['code'],
    type: 'unique',
    name: 'codeUnique',
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeConstraint('faculties', 'codeUnique')
}
