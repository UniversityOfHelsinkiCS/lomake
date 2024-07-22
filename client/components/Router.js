import React from 'react'
import { Route, Switch } from 'react-router-dom' //  Redirect

import AboutPage from 'Components/AboutPage'
import FormView from 'Components/FormView'
import AdminPage from 'Components/UsersPage'
import OverviewPage from 'Components/OverviewPage'
import ReportPage from 'Components/ReportPage'
import ComparisonPage from 'Components/ComparisonPage'

import ProgrammeLevelOverview from 'Components/EvaluationView/ProgrammeLevelOverview'
import EvaluationFormView from 'Components/EvaluationView/EvaluationFormView'
import FacultyLevelOverview from 'Components/EvaluationView/FacultyLevelOverview/index'
import DegreeReformFormView from 'Components/DegreeReformView/DegreeReformFormView'
import DegreeReformIndividualForm from 'Components/DegreeReformView/DegreeReformFormView/IndividualForm'
import DegreeReformOverview from 'Components/DegreeReformView/DegreeReformOverview'
import PastAnswersView from 'Components/EvaluationView/PastAnswersView/ProgrammeLevel'
import PastAnswersViewFaculty from 'Components/EvaluationView/PastAnswersView/FacultyLevel'
import ViewEvaluationAnswersForFaculty from 'Components/EvaluationView/PastAnswersView/EvaluationProgrammeSummary'
import CommitteeLevelOverview from 'Components/EvaluationView/CommitteeOverview'
import CommitteePrinting from 'Components/EvaluationView/CommitteeOverview/CommitteePrinting'

import FacultyFormView from 'Components/EvaluationView/FacultyForm'
import UniversityFormView from 'Components/EvaluationView/UniversityForm'
import ProgrammeLevelMetaOverview from 'Components/MetaEvaluationView/ProgrammeLevelOverview'
import ProgrammeLevelMetaForm from 'Components/MetaEvaluationView/ProgrammeForm'
import ProgrammeLevelAnswers from 'Components/MetaEvaluationView/ProgrammeLevelAnswers'
import ReformAnswers from './ReformAnswers/index'
import ErrorBoundary from './ErrorBoundary'
import Homepage from './Homepage'

export default () => (
  <div className="content">
    <ErrorBoundary>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/yearly" component={OverviewPage} />
        <Route exact path="/admin" component={AdminPage} />
        <Route exact path="/report" component={ReportPage} />
        <Route exact path="/comparison" component={ComparisonPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/yearly/form/:form/:room" render={props => <FormView room={props.match.params.room} />} />

        <Route exact path="/meta-evaluation" component={ProgrammeLevelMetaOverview} />
        <Route exact path="/meta-evaluation/answers" component={ProgrammeLevelAnswers} />
        <Route exact path="/meta-evaluation/doctor/answers" render={() => <ProgrammeLevelAnswers doctoral />} />
        <Route
          exact
          path="/meta-evaluation/form/:form/:room"
          render={props => (
            <ProgrammeLevelMetaForm room={props.match.params.room} formString={props.match.params.form} />
          )}
        />

        <Route exact path="/evaluation" component={ProgrammeLevelOverview} />
        <Route exact path="/evaluation-faculty" component={FacultyLevelOverview} />
        <Route exact path="/evaluation-university" component={CommitteeLevelOverview} />
        <Route exact path="/degree-reform" component={DegreeReformOverview} />
        <Route
          exact
          path="/degree-reform/form/:room"
          render={props => <DegreeReformFormView room={props.match.params.room} />}
        />
        <Route exact path="/individual" component={DegreeReformIndividualForm} />
        <Route
          exact
          path="/evaluation/form/:form/:room"
          render={props => <EvaluationFormView room={props.match.params.room} formString={props.match.params.form} />}
        />
        <Route
          exact
          path="/evaluation-faculty/form/:form/:room"
          render={props => <FacultyFormView room={props.match.params.room} formString={props.match.params.form} />}
        />
        <Route
          exact
          path="/evaluation-university/form/:form/:room"
          render={props => <UniversityFormView room={props.match.params.room} formString={props.match.params.form} />}
        />
        <Route exact path="/evaluation-university/printing" component={CommitteePrinting} />
        <Route
          exact
          path="/evaluation/previous-years/:programme"
          render={props => <PastAnswersView programmeKey={props.match.params.programme} />}
        />
        <Route
          exact
          path="/evaluation-faculty/previous-years/:faculty"
          render={props => <PastAnswersViewFaculty programmeKey={props.match.params.faculty} />}
        />
        <Route
          exact
          path="/evaluation-faculty/programme-evaluation-summary/:faculty"
          render={props => <ViewEvaluationAnswersForFaculty programmeKey={props.match.params.faculty} />}
        />
        <Route exact path="/reform-answers" component={ReformAnswers} />
      </Switch>
    </ErrorBoundary>
  </div>
)
