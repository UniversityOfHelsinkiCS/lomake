import React from 'react'
import { Route, Switch } from 'react-router-dom'

import FormView from 'Components/FormView'

export default () => (
  <div className="content">
    <Switch>
      <Route path="/" component={FormView} />
    </Switch>
  </div>
)
