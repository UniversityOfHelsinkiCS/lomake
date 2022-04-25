import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Popup, Radio } from 'semantic-ui-react'

import { editUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { isBasicUser, isAdmin, isSuperAdmin } from '../../../config/common'

const UserGroupSelector = ({ user }) => {
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser.data)

  const makeSuperAdminUser = () => {
    const updatedSpecialGroups = { ...user.specialGroups, superAdmin: true }
    delete updatedSpecialGroups.admin
    const updatedUser = {
      id: user.id,
      admin: false,
      specialGroup: updatedSpecialGroups,
    }
    dispatch(editUserAction(updatedUser))
  }

  const makeAdminUser = () => {
    const updatedSpecialGroups = { ...user.specialGroups, admin: true }
    delete updatedSpecialGroups.superAdmin
    const updatedUser = {
      id: user.id,
      admin: true,
      specialGroup: updatedSpecialGroups,
    }
    dispatch(editUserAction(updatedUser))
  }

  const makeBasicUser = () => {
    const updatedSpecialGroups = { ...user.specialGroups }
    delete updatedSpecialGroups.superAdmin
    delete updatedSpecialGroups.admin
    const updatedUser = {
      id: user.id,
      admin: false,
      specialGroup: updatedSpecialGroups,
    }
    dispatch(editUserAction(updatedUser))
  }

  const CustomRadioWithConfirmTrigger = ({ checked, label, disabled, confirmPrompt, onConfirm, dataCy }) => {
    return (
      <Popup
        trigger={<Radio data-cy={dataCy} disabled={disabled} label={label} name="radioGroup" checked={checked} />}
        content={
          <Button
            data-cy={`${dataCy}-confirm`}
            disabled={disabled || checked}
            color="red"
            content={disabled ? "You don't have the necessary rights to change to this user group" : confirmPrompt}
            onClick={onConfirm}
          />
        }
        on="click"
        position="top left"
      />
    )
  }

  return (
    <Form>
      <Form.Group inline>
        <Form.Field>
          <CustomRadioWithConfirmTrigger
            label={translations.accessBasic[lang]}
            disabled={isSuperAdmin(user) && !isSuperAdmin(currentUser)}
            checked={isBasicUser(user)}
            onConfirm={makeBasicUser}
            confirmPrompt={translations.makeBasicPrompt[lang]}
            dataCy="accessBasic"
          />
        </Form.Field>
        <Form.Field>
          <CustomRadioWithConfirmTrigger
            label={translations.accessAdmin[lang]}
            disabled={isSuperAdmin(user) && !isSuperAdmin(currentUser)}
            checked={isAdmin(user)}
            onConfirm={makeAdminUser}
            confirmPrompt={translations.makeAdminPrompt[lang]}
            dataCy="accessAdmin"
          />
        </Form.Field>
        <Form.Field>
          <CustomRadioWithConfirmTrigger
            label={translations.accessSuperAdmin[lang]}
            disabled={!isSuperAdmin(currentUser)}
            checked={isSuperAdmin(user)}
            onConfirm={makeSuperAdminUser}
            confirmPrompt={translations.makeSuperAdminPrompt[lang]}
            dataCy="accessSuperAdmin"
          />
        </Form.Field>
      </Form.Group>
    </Form>
  )
}

export default UserGroupSelector
