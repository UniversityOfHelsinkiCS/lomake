export const up = ({ context: queryInterface }) => {
    return Promise.all([
        queryInterface.renameColumn('reports', 'actions', 'studyprogramme_measures'),
        queryInterface.renameColumn('reports', 'faculty_actions', 'faculty_measures')
    ])
}

export const down = ({ context: queryInterface }) => {
    return Promise.all([
        queryInterface.renameColumn('reports', 'studyprogramme_measures', 'actions'),
        queryInterface.renameColumn('reports', 'faculty_measures', 'faculty_actions')
    ])
}

