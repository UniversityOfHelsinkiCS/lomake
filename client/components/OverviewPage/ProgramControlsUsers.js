import React from 'react'
import { useSelector } from 'react-redux'
import { Icon, Header, Grid, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

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

const OwnerAccordionTable = ({ users, programme, t }) => {
  return (
    <Segment style={{ margin: '1em 0' }}>
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={3} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:name')}</Header>
          </Grid.Column>
          <Grid.Column width={4} style={{ textAlign: 'center' }}>
            <Header as="h4">Email</Header>
          </Grid.Column>
          <Grid.Column width={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:view')}</Header>
          </Grid.Column>
          <Grid.Column width={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:edit')}</Header>
          </Grid.Column>
          <Grid.Column width={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:owner')}</Header>
          </Grid.Column>
        </Grid.Row>
        {users.length === 0 ? (
          <Grid.Row>
            <Grid.Column width={13} style={{ textAlign: 'center' }}>
              {t('overview:noUsers')}
            </Grid.Column>
          </Grid.Row>
        ) : (
          users.map(user => <OwnerAccordionUserRow user={user} programme={programme} key={user.id} />)
        )}
      </Grid>
    </Segment>
  )
}

const OwnerAccordionUsers = ({ programme, joryIam }) => {
  const { t } = useTranslation()
  const users = useSelector(state => state.programmesUsers)

  if (!users.data || users.pending) return null

  // split jory members to their own table
  const otherUsers = []
  const joryMembers = users.data.reduce((members, user) => {
    if (user.iamGroups?.length > 0 && user.iamGroups.includes(joryIam)) {
      return members.concat([user])
    }
    otherUsers.push(user)
    return members
  }, [])

  joryMembers.sort((a, b) => a.lastname.localeCompare(b.lastname, 'fi'))
  otherUsers.sort((a, b) => a.lastname.localeCompare(b.lastname, 'fi'))

  return (
    <>
      <div style={{ margin: '3em' }}>
        <h2>{t('overview:userListJory')}</h2>
        <OwnerAccordionTable users={joryMembers} programme={programme} t={t} />
      </div>
      <div style={{ margin: '3em' }}>
        <h2>{t('overview:userListOthers')}</h2>
        <OwnerAccordionTable users={otherUsers} programme={programme} t={t} />
      </div>
    </>
  )
}

export default OwnerAccordionUsers
