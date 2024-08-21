module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('users', 'name', 'firstname')
  },

  down: queryInterface => {
    return queryInterface.renameColumn('users', 'firstname', 'name')
  },
}
