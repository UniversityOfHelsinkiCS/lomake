import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Icon, Popup, Table } from 'semantic-ui-react'

import CustomModal from '../Generic/CustomModal'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import { isSuperAdmin } from '../../../config/common'
import { editUserAction, deleteUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'


const AccessModal = ({
  user,
  setModalData,
  handleSearch,
  programmeFilter,
  onEmpty,
  lang,
  filteredProgrammes,
  programmeCodesAndNames
}) => {
  const dispatch = useDispatch()
  if (!user || user.pending) return null


  const deleteUser = () => {
    dispatch(deleteUserAction(user.id))
  }

  const grantOwner = (programme) => {
    const updatedUser = { id: user.id, access: { ...user.access, [programme]: { admin: true, read: true, write: true }}}
    dispatch(editUserAction(updatedUser))
  }

  const removeOwner = (programme) => {
    const updatedUser = { id: user.id, access: { ...user.access, [programme]: { ...user.access[programme], admin: false }}}
    dispatch(editUserAction(updatedUser))
  }

  const grantEdit = (programme) => {
    const updatedUser = { id: user.id, access: { ...user.access, [programme]: { ...user.access[programme], write: true }}}
    dispatch(editUserAction(updatedUser))
  }

  const removeEdit = (programme) => {
    const updatedUser = { id: user.id, access: { ...user.access, [programme]: { ...user.access[programme], write: false, admin: false }}}
    dispatch(editUserAction(updatedUser))
  }

  const grantView = (programme) => {
    const updatedUser = { id: user.id, access: { ...user.access, [programme]: { ...user.access[programme], read: true }}}
    dispatch(editUserAction(updatedUser))
  }

  const removeView = (programme) => {
    let userObject = user
    delete userObject.access[programme]
    const updatedUser = { id: user.id, access: userObject.access }
    dispatch(editUserAction(updatedUser))
  }

  const getSwitchableBadge = ({ cyTag, currentAccess, grant, remove, disabled = false }) => {
    if (currentAccess)
      return (
        <Popup
          trigger={<Icon data-cy={cyTag} name="check" className="users-green" size="large" />}
          content={
            <Button
              data-cy="removePermissions-button"
              disabled={disabled}
              color="red"
              content={translations.removeAccess[lang]}
              onClick={() => remove()}
            />
          }
          on="click"
          position="top center"
        />
      )
    return (
      <Popup
        trigger={<Icon data-cy={cyTag} name="close" className="users-red" size="large" />}
        content={
          <Button
            data-cy="grantPermissions-button"
            color="green"
            content={translations.grantAccess[lang]}
            onClick={() => grant()}
          />
        }
        on="click"
        position="top center"
      />
    )
  }

  const DeleteButton = () => {
    return (
      <Popup
        content={
          <Button
            color="red"
            onClick={deleteUser}
          >
            {translations.deleteConfirmation[lang]}
          </Button>
        }
        trigger={
          <Button 
            compact
            style={{ marginLeft: 'auto', marginTop: 'auto' }}
            color={isSuperAdmin(user.uid) ? "grey" : "red"}
            disabled={isSuperAdmin(user.uid)}
          >
            {translations.deleteUser[lang]}
          </Button>
        }
        on="click"
      />
    )
  }

  return (
    <CustomModal
    title={`${user.firstname} ${user.lastname}`}
    closeModal={() => setModalData(null)}
    borderColor={""}
  >
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={5}>
              Programme
            </Table.HeaderCell>
            <Table.HeaderCell width={3}>
              Read
            </Table.HeaderCell>
            <Table.HeaderCell width={3}>
              Write
            </Table.HeaderCell>
            <Table.HeaderCell width={3}>
              Admin
            </Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(user.access).map((programme) => (
            <Table.Row key={`${user.lastname}-${programme}`}>
              <Table.Cell>
                {programmeCodesAndNames.get(programme)}
              </Table.Cell>
              <Table.Cell>
              {getSwitchableBadge({
                cyTag: `read-${user.uid}`,
                currentAccess: user.access[programme] ? user.access[programme].read : false,
                grant: () => grantView(programme),
                remove: () => removeView(programme)
              })}
              </Table.Cell>
              <Table.Cell>
              {getSwitchableBadge({
                cyTag: `write-${user.uid}`,
                currentAccess: user.access[programme] ? user.access[programme].write : false,
                grant: () => grantEdit(programme),
                remove: () => removeEdit(programme)
              })}
              </Table.Cell>
              <Table.Cell>
              {getSwitchableBadge({
                cyTag: `read-${user.uid}`,
                currentAccess: user.access[programme] ? user.access[programme].admin : false,
                grant: () => grantOwner(programme),
                remove: () => removeOwner(programme)
              })}
              </Table.Cell>
              <Table.Cell>
                <Button onClick={() => removeView(programme)}>
                  Poista oikeus
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="user-access-modal-delete-container">
        <ProgrammeFilter
          label={translations.programmeFilter[lang]}
          handleChange={handleSearch}
          filter={programmeFilter}
          onEmpty={onEmpty}
          lang={lang}            
        />
        <DeleteButton/>
      </div>
      <div>
        {filteredProgrammes.map((p) => (
          <div
            key={p.key}
            style={{ borderBottom: "1px solid gray", width: "80%" }}
          >
            <p>
              {p.name[lang]}
              <Button
                onClick={() => grantView(p.key)}
                size="tiny"
                color="blue"
                compact
              >
                Lisää lukuoikeus
              </Button>

            </p>
          </div>
        ))}
      </div>
    </>
  </CustomModal>
  )
}

export default AccessModal