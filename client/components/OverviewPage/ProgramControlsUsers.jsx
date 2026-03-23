import { useSelector } from 'react-redux'
import { Icon, Header, Grid, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const SwitchableBadge = ({ cyTag, currentAccess }) => {
  if (currentAccess) return <Icon className="users-green" data-cy={cyTag} name="check" size="large" />
  return <Icon className="users-red" data-cy={cyTag} name="close" size="large" />
}

const OwnerAccordionUserRow = ({ user, programme }) => {
  const read = user.access[programme] ? user.access[programme].read : false
  const write = user.access[programme] ? user.access[programme].write : false
  const admin = user.access[programme] ? user.access[programme].admin : false

  return (
    <Grid.Row key={user.id}>
      <Grid.Column style={{ textAlign: 'center' }} width={3}>
        {`${user.lastname}, ${user.firstname}`}
      </Grid.Column>
      <Grid.Column style={{ textAlign: 'center' }} width={4}>
        {user.email}
      </Grid.Column>
      <Grid.Column textAlign="center" width={2}>
        <SwitchableBadge currentAccess={read} cyTag={`read-${user.uid}${read ? '' : '-false'}`} />
      </Grid.Column>
      <Grid.Column textAlign="center" width={2}>
        <SwitchableBadge currentAccess={write} cyTag={`write-${user.uid}${write ? '' : '-false'}`} />
      </Grid.Column>
      <Grid.Column textAlign="center" width={2}>
        <SwitchableBadge currentAccess={admin} cyTag={`admin-${user.uid}${admin ? '' : '-false'}`} />
      </Grid.Column>
    </Grid.Row>
  )
}

const OwnerAccordionTable = ({ users, programme, t }) => {
  return (
    <Segment style={{ margin: '1em 0' }}>
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column style={{ textAlign: 'center' }} width={3}>
            <Header as="h4">{t('overview:name')}</Header>
          </Grid.Column>
          <Grid.Column style={{ textAlign: 'center' }} width={4}>
            <Header as="h4">Email</Header>
          </Grid.Column>
          <Grid.Column style={{ textAlign: 'center' }} width={2}>
            <Header as="h4">{t('overview:view')}</Header>
          </Grid.Column>
          <Grid.Column style={{ textAlign: 'center' }} width={2}>
            <Header as="h4">{t('overview:edit')}</Header>
          </Grid.Column>
          <Grid.Column style={{ textAlign: 'center' }} width={2}>
            <Header as="h4">{t('overview:owner')}</Header>
          </Grid.Column>
        </Grid.Row>
        {users.length === 0 ? (
          <Grid.Row>
            <Grid.Column style={{ textAlign: 'center' }} width={13}>
              {t('overview:noUsers')}
            </Grid.Column>
          </Grid.Row>
        ) : (
          users.map(user => <OwnerAccordionUserRow key={user.id} programme={programme} user={user} />)
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
        <OwnerAccordionTable programme={programme} t={t} users={joryMembers} />
      </div>
      <div style={{ margin: '3em' }}>
        <h2>{t('overview:userListOthers')}</h2>
        <OwnerAccordionTable programme={programme} t={t} users={otherUsers} />
      </div>
    </>
  )
}

export default OwnerAccordionUsers
