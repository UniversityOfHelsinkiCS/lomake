import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Label, Popup, Segment } from 'semantic-ui-react'

import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import { editUserAction, deleteUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'
import { isAdmin, isInternationalUser, isSuperAdmin } from '@root/config/common'
import AccessGroupSelector from './AccessGroupSelector'
import AccessTable from './AccessTable'
import UserGroupSelector from './UserGroupSelector'
import CustomModal from '../Generic/CustomModal'

const AccessModal = ({
  user,
  setModalData,
  handleSearch,
  programmeFilter,
  onEmpty,
  filteredProgrammes,
  programmeCodesAndNames,
}) => {
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)

  if (!user || user.pending) return null

  const deleteUser = () => {
    dispatch(deleteUserAction(user.id))
  }

  const grantView = programme => {
    const updatedUser = {
      id: user.id,
      access: { ...user.access, [programme]: { ...user.access[programme], read: true } },
    }
    dispatch(editUserAction(updatedUser))
  }

  const getAccessTable = () => (
    <>
      {isAdmin(user) && <h4 style={{ color: colors.blue }}>{translations.hasAdminRights[lang]}</h4>}
      {isInternationalUser(user.specialGroup) && (
        <h4 style={{ color: colors.blue }}>{translations.hasInternationalRights[lang]}</h4>
      )}
      {user.access && Object.keys(user.access).length > 0 && (
        <AccessTable user={user} programmeCodesAndNames={programmeCodesAndNames} />
      )}
    </>
  )

  const getDeleteButton = () => {
    return (
      <Popup
        content={
          <Button data-cy="user-confirm-delete-button" color="red" onClick={deleteUser}>
            {translations.deleteConfirmation[lang]}
          </Button>
        }
        trigger={
          <Button
            data-cy="user-delete-button"
            className="user-delete-button"
            size="large"
            color="red"
            disabled={isSuperAdmin(user)}
          >
            {translations.deleteUser[lang]}
          </Button>
        }
        on="click"
        position="top center"
      />
    )
  }

  return (
    <CustomModal closeModal={() => setModalData(null)}>
      <Segment className="user-access-modal-segment">
        <h2>
          {user.firstname} {user.lastname}
        </h2>
        <p className="user-access-modal-details">
          {translations.userId[lang]}: {user.uid}
        </p>
        <p className="user-access-modal-details">
          {translations.email[lang]}: {user.email}
        </p>
      </Segment>
      <Segment className="user-access-modal-segment">
        <h3>{translations.userGroup[lang]}</h3>
        <UserGroupSelector user={user} />
        <h3>{translations.accessGroups[lang]}</h3>
        <AccessGroupSelector user={user} />
      </Segment>
      <Segment className="user-access-modal-segment">
        <h3>{translations.accessRights[lang]}</h3>
        {getAccessTable()}
        <ProgrammeFilter
          label={translations.programmeFilter[lang]}
          handleChange={handleSearch}
          filter={programmeFilter}
          onEmpty={onEmpty}
          lang={lang}
          size="large"
        />
        <div className="user-programme-list">
          {filteredProgrammes.map(p => (
            <Label
              data-cy={`${p.key}-item`}
              className="user-programme-list-item"
              key={p.key}
              onClick={() => grantView(p.key)}
            >
              {' '}
              <p>{p.name[lang]}</p>
            </Label>
          ))}
        </div>
      </Segment>
      <Segment className="user-access-modal-delete-container">{getDeleteButton()}</Segment>
    </CustomModal>
  )
}

export default AccessModal
