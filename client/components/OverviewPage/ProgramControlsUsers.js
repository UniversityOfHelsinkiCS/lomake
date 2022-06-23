import React from 'react'
import { useSelector } from 'react-redux'
import { Icon, Header, Grid, Segment } from 'semantic-ui-react'

import { overviewPageTranslations as translations } from 'Utilities/translations'

const SwitchableBadge = ({ cyTag, currentAccess }) => {
  if (currentAccess) return <Icon data-cy={cyTag} name="check" className="users-green" size="large" />
  return <Icon data-cy={cyTag} name="close" className="users-red" size="large" />
}

const OwnerAccordionUserRow = ({ user, programme }) => {
  const read = user.access[programme] ? user.access[programme].read : false
  const write = user.access[programme] ? user.access[programme].write : false
  const admin = user.access[programme] ? user.access[programme].admin : false

  return (
    <>
      <Grid.Row key={user.id}>
        <Grid.Column width={3} style={{ textAlign: 'center' }}>
          {`${user.lastname}, ${user.firstname}`}
        </Grid.Column>
        <Grid.Column width={4} style={{ textAlign: 'center' }}>
          {user.email}
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge cyTag={`read-${user.uid}${read ? '' : '-false'}`} currentAccess={read} />
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge cyTag={`write-${user.uid}${write ? '' : '-false'}`} currentAccess={write} />
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge cyTag={`admin-${user.uid}${admin ? '' : '-false'}`} currentAccess={admin} />
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

const OwnerAccordionTable = ({ users, lang, programme }) => {
  return (
    <Segment style={{ margin: '1em 0' }}>
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={3} style={{ textAlign: 'center' }}>
            <Header as="h4">{translations.nameHeader[lang]}</Header>
          </Grid.Column>
          <Grid.Column width={4} style={{ textAlign: 'center' }}>
            <Header as="h4">Email</Header>
          </Grid.Column>
          <Grid.Column width={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{translations.viewHeader[lang]}</Header>
          </Grid.Column>
          <Grid.Column width={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{translations.editHeader[lang]}</Header>
          </Grid.Column>
          <Grid.Column width={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{translations.ownerHeader[lang]}</Header>
          </Grid.Column>
        </Grid.Row>
        {users.data.length === 0 ? (
          <Grid.Row>
            <Grid.Column width={13} style={{ textAlign: 'center' }}>
              {translations.noUsers[lang]}
            </Grid.Column>
          </Grid.Row>
        ) : (
          users.data.map(user => <OwnerAccordionUserRow user={user} programme={programme} key={user.id} />)
        )}
      </Grid>
    </Segment>
  )
}

const isJory = groups => {
  // eslint-disable-next-line consistent-return
  groups.forEach(iam => {
    if (iam.includes('jory')) return true
  })
  return false
}

const OwnerAccordionUsers = ({ programme }) => {
  const lang = useSelector(state => state.language)
  const users = useSelector(state => state.programmesUsers)

  if (!users.data || users.pending) return null

  // split jory members to their own table
  const joryMembers = users.data.reduce((members, user) => {
    if (user.iamGroups && isJory(user.iamGroups)) {
      return members.concat(user)
    }
    return members
  }, [])

  const others = users.data.filter(user => !joryMembers.incudes(user))
  // eslint-disable-next-line no-console
  console.log('allUsers', users.data)
  // eslint-disable-next-line no-console
  console.log('joryMembers', joryMembers)
  // eslint-disable-next-line no-console
  console.log('otherMembers', others)

  return (
    <>
      <div style={{ margin: '3em' }}>
        <h2>{translations.userListJory[lang]}</h2>
        <OwnerAccordionTable users={users} programme={programme} lang={lang} />
      </div>
      <div style={{ margin: '3em' }}>
        <h2>{translations.userListOthers[lang]}</h2>
        <OwnerAccordionTable users={users} programme={programme} lang={lang} />
      </div>
    </>
  )
}

export default OwnerAccordionUsers
