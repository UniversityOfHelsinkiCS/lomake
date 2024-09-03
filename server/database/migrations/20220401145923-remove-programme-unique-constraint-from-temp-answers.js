export const up = ({ context: queryInterface }) => {
  return queryInterface.removeConstraint('temp_answers', 'programmeUnique')
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.addConstraint('temp_answers', {
    fields: ['programme'],
    type: 'unique',
    name: 'programmeUnique',
  })
}