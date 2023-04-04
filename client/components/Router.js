import React from 'react'
import { Route, Switch } from 'react-router-dom' //  Redirect

import AboutPage from 'Components/AboutPage'
import FormView from 'Components/FormView'
import AdminPage from 'Components/UsersPage'
import OverviewPage from 'Components/OverviewPage'
import ReportPage from 'Components/ReportPage'
import ComparisonPage from 'Components/ComparisonPage'

import EvaluationOverview from 'Components/EvaluationView/EvaluationOverview'
import EvaluationFormView from 'Components/EvaluationView/EvaluationFormView'
import DegreeReformFormView from 'Components/DegreeReformView/DegreeReformFormView'
// import DegreeReformIndividualForm from 'Components/DegreeReformView/DegreeReformFormView/DegreeReformIndividual'
import DegreeReformOverview from 'Components/DegreeReformView/DegreeReformOverview'
import PastAnswersView from 'Components/EvaluationView/PastAnswersView'
import threeStepImage from '../assets/degreeReform/study_path.png'

export default () => (
  <div className="content">
    <Switch>
      <Route exact path="/" component={OverviewPage} />
      <Route exact path="/admin" component={AdminPage} />
      <Route exact path="/report" component={ReportPage} />
      <Route exact path="/comparison" component={ComparisonPage} />
      <Route exact path="/about" component={AboutPage} />
      <Route exact path="/form/:room" render={props => <FormView room={props.match.params.room} />} />

      <Route exact path="/evaluation" component={EvaluationOverview} />
      <Route exact path="/degree-reform" component={DegreeReformOverview} />
      <Route
        exact
        path="/degree-reform/form/:room"
        render={props => <DegreeReformFormView room={props.match.params.room} />}
      />
      {/* <Route exact path="/degree-reform-individual/form" component={DegreeReformIndividualForm} /> */}
      <Route
        exact
        path="/evaluation/form/:form/:room"
        render={props => <EvaluationFormView room={props.match.params.room} formString={props.match.params.form} />}
      />
      <Route
        exact
        path="/evaluation/previous-years/:programme"
        render={props => <PastAnswersView programmeKey={props.match.params.programme} />}
      />
      <Route
        exact
        path="/three-step"
        render={() => (
          <img src={threeStepImage} alt="Bolognan prosessin mukainen aito kolmiportainen tutkintorakenne" />
        )}
      />
    </Switch>
  </div>
)
