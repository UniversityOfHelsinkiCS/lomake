export const up = ({ context: queryInterface }) => {
  return queryInterface.renameColumn('users', 'name', 'firstname')
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.renameColumn('users', 'firstname', 'name')
}