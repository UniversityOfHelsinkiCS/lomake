import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Popup, Radio } from 'semantic-ui-react'

import { editUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { isBasicUser, isAdmin } from '../../../config/common'

const UserGroupSelector = ({ user }) => {
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)

  const makeAdminUser = () => {
    // Removed wideReadAccess, because we dont want users to have multiple usergroups.
    const updatedUser = {
      id: user.id,
      wideReadAccess: false,
      admin: true,
    }
    dispatch(editUserAction(updatedUser))
  }

  const makeBasicUser = () => {
    const updatedUser = {
      id: user.id,
      wideReadAccess: false,
      admin: false,
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
            content={disabled ? 'Please use the IAM group for managing  wide read access' : confirmPrompt}
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
            checked={isBasicUser(user)}
            onConfirm={makeBasicUser}
            disabled={user.wideReadAccess}
            confirmPrompt={translations.makeBasicPrompt[lang]}
            dataCy="accessBasic"
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
            checked={isAdmin(user)}
            onConfirm={makeAdminUser}
            disabled={user.wideReadAccess}
            confirmPrompt={translations.makeAdminPrompt[lang]}
            dataCy="accessAdmin"
          />
        </Form.Field>
      </Form.Group>
    </Form>
  )
}

export default UserGroupSelector
