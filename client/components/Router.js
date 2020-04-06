import React from 'react'
import { Route, Switch } from 'react-router-dom'

import FormView from 'Components/FormView'
import UsersPage from 'Components/UsersPage'
import OverviewPage from 'Components/OverviewPage'
import ClaimAccessPage from 'Components/ClaimAccessPage'

export default () => (
  <div className="content">
    <Switch>
      <Route exact path="/" component={OverviewPage} />
      <Route exact path="/users" component={UsersPage} />
      <Route
        exact
        path="/form/:room"
        render={(props) => <FormView room={props.match.params.room} />}
      />
      <Route
        exact
        path="/access/:url"
        render={(props) => <ClaimAccessPage url={props.match.params.url} />}
      />
      <Route path="*" render={() => <div>Page not found!</div>} />
    </Switch>
  </div>
)
