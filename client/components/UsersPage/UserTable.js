import React from 'react'
import { useSelector } from 'react-redux'
import { Grid, Header, Segment } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import User from 'Components/UsersPage/User'
import { isSuperAdmin } from '../../../config/common'

export default () => {
  const users = useSelector((state) => state.users.data)
  const user = useSelector(({ currentUser }) => currentUser.data)
  const history = useHistory()

  if (!user.admin) {
    history.push('/')
  }

  if (!users) return null

  return (
    <Grid celled="internally">
      <Grid.Row>
        <Grid.Column width={3}>
          <Header as="h4">Name</Header>
        </Grid.Column>
        <Grid.Column width={2}>
          <Header as="h4">User id</Header>
        </Grid.Column>
        <Grid.Column width={3}>
          <Header as="h4">Email</Header>
        </Grid.Column>
        <Grid.Column width={5}>
          <Header as="h4">Access</Header>
        </Grid.Column>
        <Grid.Column width={1}>
          <Header as="h4">Admin</Header>
        </Grid.Column>
        <Grid.Column width={1}>
          <Header as="h4">Hide</Header>
        </Grid.Column>
        {isSuperAdmin(user.uid) && (
          <Grid.Column width={1}>
            <Header as="h4">Hijack</Header>
          </Grid.Column>
        )}
      </Grid.Row>
      {users.map((u) => (
        <User user={u} key={u.id} />
      ))}
    </Grid>
  )
}
