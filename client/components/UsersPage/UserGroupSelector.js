import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Popup, Radio } from 'semantic-ui-react'

import { editUserAction } from 'Utilities/redux/usersReducer'
import { isSuperAdmin, isSpecialGroupUser, isInternationalUser } from '../../../config/common'
import { usersPageTranslations as translations } from 'Utilities/translations'


const UserGroupSelector = ({ user }) => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const allProgrammes = useSelector((state) => state.studyProgrammes.data)


  const makeAdminUser = () => {
    // Removed wideReadAccess, because we dont want users to have multiple usergroups. (admin and wideReadAccess or special group)
    const updatedUser = {
      id: user.id,
      specialGroup: {},
      wideReadAccess: false,
      admin: true,
    }
    dispatch(editUserAction(updatedUser))
  }

  const makeBasicUser = () => {
    let userObject = user
    if (isInternationalUser(user.specialGroup) || user.admin) {
      allProgrammes.forEach((p) => {
        if (p.international) {
          delete userObject.access[p.key]
        }
      })
    }
    const updatedUser = {
      id: user.id,
      specialGroup: {},
      wideReadAccess: false,
      admin: false,
      access: userObject.access
    }
    dispatch(editUserAction(updatedUser))
  }

  const makeSpecialGroupUser = (group) => {
    let newAccess = user.access
    // If the chosen special group is "international" add access to international
    // programmes and mark the user as "international"
    if (group === 'international') {
      allProgrammes.forEach((p) => {
        if (p.international) {
          newAccess = { ...newAccess, [p.key]: { ...newAccess[p.key], read: true }}
        }
      })
    }
    const updatedUser = {
      id: user.id,
      specialGroup: { ...user.specialGroup, [group]: true },
      access: newAccess,
      admin: false,
      wideReadAccess: false
    }
    dispatch(editUserAction(updatedUser))
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
            checked={!user.wideReadAccess && !isSpecialGroupUser(user.specialGroup) && !user.admin}
            onConfirm={makeBasicUser}
            disabled={user.wideReadAccess}
            confirmPrompt={translations.makeBasicPrompt[lang]}
            dataCy="accessBasic"
          />
          <CustomRadioWithConfirmTrigger
            label={translations.accessInternational[lang]}
            checked={isInternationalUser(user.specialGroup)}
            onConfirm={() => makeSpecialGroupUser('international')}
            disabled={user.wideReadAccess}
            confirmPrompt={translations.makeInternationalPrompt[lang]}
            dataCy="accessInternationalGroup"
          />
          {/* Comment the wide reading access out until it is being used 
            <Form.Field>
            <CustomRadioWithConfirmTrigger
              label={translations.accessWideRead[lang]}
              checked={user.wideReadAccess}
              disabled={true}
              dataCy="accessWideRead"
            />
          </Form.Field> */}
          <CustomRadioWithConfirmTrigger
            label={translations.accessAdmin[lang]}
            checked={user.admin}
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