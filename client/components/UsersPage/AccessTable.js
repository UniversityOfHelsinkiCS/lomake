import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon, Label, Popup, Table } from 'semantic-ui-react'

import { editUserAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'


const AccessTable = ({ user, programmeCodesAndNames}) => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)

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

  return (
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
        {Object.entries(user.access).map(([programme, access] ) => (
          <Table.Row key={`${user.lastname}-${programme}`}>
            <Table.Cell>
              {programmeCodesAndNames.get(programme)} {access.year && <Label size='tiny'>{access.year}</Label>}
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
  )  
}

export default AccessTable