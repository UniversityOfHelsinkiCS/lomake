import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Popup, Radio } from 'semantic-ui-react'

import { editUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'


const UserGroupSelector = ({ user }) => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)

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

export default UserGroupSelector