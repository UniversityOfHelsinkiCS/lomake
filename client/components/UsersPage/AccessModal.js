import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, Icon, Label, Popup, Radio, Segment, Table } from 'semantic-ui-react'

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
      <Icon
        data-cy={cyTag}
        name="close"
        className="users-red"
        size="large"
        onClick={() => grant()}
      />
    )
  }

  const grantAdmin = () => {
    // Removed wideReadAccess, because we dont want users to have two usergroups. (admin and wideReadAccess)
    dispatch(editUserAction({ id: user.id, admin: true, wideReadAccess: false }))
  }

  const removeAdmin = () => dispatch(editUserAction({ id: user.id, admin: false }))

  const CustomRadioWithConfirmTrigger = ({
    checked,
    label,
    disabled,
    confirmPrompt,
    onConfirm,
    dataCy,
  }) => {
    return (
      <Popup
        trigger={
          <Radio
            data-cy={dataCy}
            disabled={disabled}
            label={label}
            name="radioGroup"
            checked={checked}
          />
        }
        content={
          <Button
            data-cy={`${dataCy}-confirm`}
            disabled={disabled || checked}
            color="red"
            content={
              disabled ? 'Please use the IAM group for managing  wide read access' : confirmPrompt
            }
            onClick={onConfirm}
          />
        }
        on="click"
        position="top left"
      />
    )
  }

  const UserGroupSelector = () => {
    return (
      <Form>
        <Form.Group inline>
          <Form.Field>
            <CustomRadioWithConfirmTrigger
              label={translations.accessBasic[lang]}
              checked={!user.wideReadAccess && !user.admin}
              onConfirm={removeAdmin}
              disabled={user.wideReadAccess}
              confirmPrompt={translations.makeBasicPrompt[lang]}
              dataCy="accessBasic"
            />
          </Form.Field>
          <Form.Field>
            <CustomRadioWithConfirmTrigger
              label={translations.accessInternational[lang]}
              checked={user.specialGroup === 'international'}
              dataCy="accessInternational"
            />
          </Form.Field>
          {/* Comment the wide reading access out until it is being used 
            <Form.Field>
            <CustomRadioWithConfirmTrigger
              label={translations.accessWideRead[lang]}
              checked={user.wideReadAccess}
              disabled={true}
              dataCy="accessWideRead"
            />
          </Form.Field> */}
          <Form.Field>
            <CustomRadioWithConfirmTrigger
              label={translations.accessAdmin[lang]}
              checked={user.admin}
              onConfirm={grantAdmin}
              confirmPrompt={translations.makeAdminPrompt[lang]}
              dataCy="accessAdmin"
            />
          </Form.Field>
        </Form.Group>
      </Form>
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
            className="user-delete-button"
            size="large"
            color="red"
            disabled={isSuperAdmin(user.uid)}
          >
            {translations.deleteUser[lang]}
          </Button>
        }
        on="click"
        position='top center'
      />
    )
  }

  return (
    <CustomModal
    title={''}
    closeModal={() => setModalData(null)}
    borderColor={""}
  >
    <>
      <Segment className="user-access-modal-segment">
        <h2>{user.firstname} {user.lastname}</h2>
        <p className="user-access-modal-details">{translations.userId[lang]}: {user.uid}</p>
        <p className="user-access-modal-details">{translations.email[lang]}: {user.email}</p>
      </Segment>
      <Segment className="user-access-modal-segment">
        <h3>{translations.userGroup[lang]}</h3>
        <UserGroupSelector />
      </Segment>
      <Segment className="user-access-modal-segment">

      {user.access && Object.keys(user.access).length > 0 &&
        <Table className="user-access-modal-segment">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={5}>
                {translations.programme[lang]}
              </Table.HeaderCell>
              <Table.HeaderCell width={3}>
                {translations.readAccess[lang]}
              </Table.HeaderCell>
              <Table.HeaderCell width={3}>
                {translations.writeAccess[lang]}
              </Table.HeaderCell>
              <Table.HeaderCell width={3}>
                {translations.ownerAccess[lang]}
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
                <Popup
                  trigger={<Button>{translations.removeAccessToProgramme[lang]}</Button>}
                  content={
                    <Button
                      data-cy="removePermissions-button"
                      color="red"
                      content={translations.removeAllAccess[lang]}
                      onClick={() => removeView(programme)}
                    />
                  }
                  on="click"
                  position="top center"
                />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      }
        <h3>{translations.addRights[lang]}</h3>
        <div >
          <ProgrammeFilter
            label={translations.programmeFilter[lang]}
            handleChange={handleSearch}
            filter={programmeFilter}
            onEmpty={onEmpty}
            lang={lang}
            size="large"      
          />
        </div>
        <div className="user-programme-list">
          {filteredProgrammes.map((p) => (
            <Label
              className="user-programme-list-item"
              key={p.key}
              onClick={() => grantView(p.key)}
            > <p>
              {p.name[lang]}
            </p>
            </Label>
          ))}
        </div>
      </Segment>
      <Segment className="user-access-modal-delete-container">
        <DeleteButton/>
      </Segment>
    </>
  </CustomModal>
  )
}

export default AccessModal