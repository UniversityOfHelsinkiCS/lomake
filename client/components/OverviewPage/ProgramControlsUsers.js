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
      <Grid key={user.id}>
        <Grid spacing={3} style={{ textAlign: 'center' }}>
          {`${user.lastname}, ${user.firstname}`}
        </Grid>
        <Grid spacing={4} style={{ textAlign: 'center' }}>
          {user.email}
        </Grid>
        <Grid textAlign="center" spacing={2}>
          <SwitchableBadge cyTag={`read-${user.uid}${read ? '' : '-false'}`} currentAccess={read} />
        </Grid>
        <Grid textAlign="center" spacing={2}>
          <SwitchableBadge cyTag={`write-${user.uid}${write ? '' : '-false'}`} currentAccess={write} />
        </Grid>
        <Grid textAlign="center" spacing={2}>
          <SwitchableBadge cyTag={`admin-${user.uid}${admin ? '' : '-false'}`} currentAccess={admin} />
        </Grid>
      </Grid>
    </>
  )
}

const OwnerAccordionTable = ({ users, programme, t }) => {
  return (
    <Segment style={{ margin: '1em 0' }}>
      <Grid celled="internally">
        <Grid>
          <Grid spacing={3} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:name')}</Header>
          </Grid>
          <Grid spacing={4} style={{ textAlign: 'center' }}>
            <Header as="h4">Email</Header>
          </Grid>
          <Grid spacing={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:view')}</Header>
          </Grid>
          <Grid spacing={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:edit')}</Header>
          </Grid>
          <Grid spacing={2} style={{ textAlign: 'center' }}>
            <Header as="h4">{t('overview:owner')}</Header>
          </Grid>
        </Grid>
        {users.length === 0 ? (
          <Grid>
            <Grid spacing={13} style={{ textAlign: 'center' }}>
              {t('overview:noUsers')}
            </Grid>
          </Grid>
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
