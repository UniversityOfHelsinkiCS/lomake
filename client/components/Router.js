import React from 'react'
import { Route, Switch } from 'react-router-dom'

import FormView from 'Components/FormView'
import UsersPage from 'Components/UsersPage'
import AnalyticsPage from 'Components/AnalyticsPage'
import ClaimAccessPage from 'Components/ClaimAccessPage'
import OwnerPage from 'Components/OwnerPage'

export default () => (
  <div className="content">
    <Switch>
      <Route exact path="/" component={FormView} />
      <Route exact path="/users" component={UsersPage} />
      <Route exact path="/analytics" component={AnalyticsPage} />
      <Route
        exact
        path="/access/:url"
        render={(props) => <ClaimAccessPage url={props.match.params.url} />}
      />
      <Route exact path="/owner" component={OwnerPage} />
      <Route path="*" render={() => <div>Page not found!</div>} />
    </Switch>
  </div>
)
