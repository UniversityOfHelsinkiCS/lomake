import React from 'react'
import { Route, Switch } from 'react-router-dom'

import FormView from 'Components/FormView'
import UsersPage from 'Components/UsersPage'

export default () => (
  <div className="content">
    <Switch>
      <Route exact path="/" component={FormView} />
      <Route exact path="/users" component={UsersPage} />
      <Route path="*" render={() => <div>Page not found!</div>} />
    </Switch>
  </div>
)
