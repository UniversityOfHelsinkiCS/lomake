import React from 'react'
import { useSelector } from 'react-redux'
import { Grid, Header, Segment } from 'semantic-ui-react'

import User from 'Components/UsersPage/User'

export default () => {
  const users = useSelector((state) => state.users.data)

  if (!users) return null

  return (
    <Segment>
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={2}>
            <Header as="h4">Name</Header>
          </Grid.Column>
          <Grid.Column width={1}>
            <Header as="h4">User id</Header>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as="h4">Email</Header>
          </Grid.Column>
          <Grid.Column width={1}>
            <Header as="h4">Access</Header>
          </Grid.Column>
          <Grid.Column width={1}>
            <Header as="h4">Admin</Header>
          </Grid.Column>
          <Grid.Column width={1}>
            <Header as="h4">Irrelevant</Header>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
        {users.map((u) => (
          <User user={u} key={u.id} />
        ))}
      </Grid>
    </Segment>
  )
}
