import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Label, Popup, Radio, Segment } from 'semantic-ui-react'

import AccessTable from './AccessTable'
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
  filteredProgrammes,
  programmeCodesAndNames
}) => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)

  if (!user || user.pending) return null

  const deleteUser = () => {
    dispatch(deleteUserAction(user.id))
  }

  const grantView = (programme) => {
    const updatedUser = { id: user.id, access: { ...user.access, [programme]: { ...user.access[programme], read: true }}}
    dispatch(editUserAction(updatedUser))
  }

  const grantAdmin = () => {
    // Removed wideReadAccess, because we dont want users to have two usergroups. (admin and wideReadAccess)
    dispatch(editUserAction({ id: user.id, admin: true, wideReadAccess: false }))
  }

  const removeAdmin = () => {
    dispatch(editUserAction({ id: user.id, admin: false }))
  }

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

      {user.access && Object.keys(user.access).length > 0 && (
        <AccessTable
          user={user}
          programmeCodesAndNames={programmeCodesAndNames}
        />
      )}
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