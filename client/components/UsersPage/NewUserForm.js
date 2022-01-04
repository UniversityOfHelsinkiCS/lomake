import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Checkbox, Input, Segment, Popup, Button } from 'semantic-ui-react'

import { createUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'

const INITIAL_FORM_DATA = {
  email: '',
  uid: '',
  firstname: '',
  lastname: '',
  admin: false,
}

export default ({ closeModal }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA })
  const users = useSelector(state => state.users.data)
  const lang = useSelector(state => state.language)

  if (!users || !lang) return null

  const handleFieldChange = event => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const isValidEmailAddress = address =>
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
      address
    )

  const isUidUnique = uid => {
    if (users.find(user => user.uid === uid)) {
      return false
    }
    return true
  }

  const validate = formData => {
    if (
      formData.email &&
      isValidEmailAddress(formData.email) &&
      formData.uid &&
      isUidUnique(formData.uid) &&
      formData.lastname &&
      formData.firstname
    )
      return true
    return false
  }

  const handleSubmit = () => {
    dispatch(createUserAction(formData))
    closeModal()
  }

  return (
    <Segment>
      <Form width={4}>
        <Form.Field
          className="user-form-field"
          data-cy="user-form-add-email"
          control={Input}
          label={translations.email[lang]}
          placeholder="Email"
          value={formData.email}
          onChange={handleFieldChange}
          name="email"
          error={Boolean(formData.email && !isValidEmailAddress(formData.email))}
          required
        />
        <Form.Field
          className="user-form-field"
          data-cy="user-form-add-user-id"
          control={Input}
          label={translations.userId[lang]}
          placeholder="rkeskiva"
          value={formData.uid}
          onChange={handleFieldChange}
          error={false}
          name="uid"
          required
        />
        <Form.Field
          className="user-form-field"
          data-cy="user-form-add-firstname"
          control={Input}
          label={translations.firstname[lang]}
          placeholder={translations.firstname[lang]}
          value={formData.firstname}
          onChange={handleFieldChange}
          error={false}
          name="firstname"
          required
        />
        <Form.Field
          className="user-form-field"
          data-cy="user-form-add-lastname"
          control={Input}
          label={translations.lastname[lang]}
          placeholder={translations.lastname[lang]}
          value={formData.lastname}
          onChange={handleFieldChange}
          error={false}
          name="lastname"
          required
        />
        <Form.Field
          className="user-form-field"
          control={Checkbox}
          data-cy="user-form-add-admin"
          label={translations.admin[lang]}
          checked={formData.admin}
          onChange={(e, d) => {
            setFormData({ ...formData, admin: d.checked })
          }}
        />
        <Form.Group>
          <Popup
            trigger={
              <div className="user-form-field">
                <Button
                  data-cy="user-form-add-user-button"
                  positive
                  disabled={!validate(formData)}
                  content={translations.addUser[lang]}
                  onClick={handleSubmit}
                  name="add-user-button"
                />
              </div>
            }
            position="top center"
            on="hover"
            disabled={validate(formData)}
            content={translations.checkUserData[lang]}
          />
        </Form.Group>
      </Form>
    </Segment>
  )
}
