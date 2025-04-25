import React from 'react'
import { Route, Switch } from 'react-router-dom' //  Redirect

import AboutPage from './AboutPage'
import FormView from './FormView'
import AdminPage from './UsersPage'
import OverviewPage from './OverviewPage'
import ReportPage from './ReportPage'
import ComparisonPage from './ComparisonPage'

import ProgrammeLevelOverview from './EvaluationView/ProgrammeLevelOverview'
import EvaluationFormView from './EvaluationView/EvaluationFormView'
import FacultyLevelOverview from './EvaluationView/FacultyLevelOverview/index'
import DegreeReformFormView from './DegreeReformView/DegreeReformFormView'
import DegreeReformIndividualForm from './DegreeReformView/DegreeReformFormView/IndividualForm'
import DegreeReformOverview from './DegreeReformView/DegreeReformOverview'
import PastAnswersView from './EvaluationView/PastAnswersView/ProgrammeLevel'
import PastAnswersViewFaculty from './EvaluationView/PastAnswersView/FacultyLevel'
import ViewEvaluationAnswersForFaculty from './EvaluationView/PastAnswersView/EvaluationProgrammeSummary'
import CommitteeLevelOverview from './EvaluationView/CommitteeOverview'
import CommitteePrinting from './EvaluationView/CommitteeOverview/CommitteePrinting'

import FacultyFormView from './EvaluationView/FacultyForm'
import UniversityFormView from './EvaluationView/UniversityForm'
import ProgrammeLevelMetaOverview from './MetaEvaluationView/ProgrammeLevelOverview'
import ProgrammeLevelMetaForm from './MetaEvaluationView/ProgrammeForm'
import ProgrammeLevelAnswers from './MetaEvaluationView/ProgrammeLevelAnswers'
import FacultyMonitoringOverview from './FacultyMonitoringView/FacultyMonitoringOverview'
import ReformAnswers from './ReformAnswers/index'
import ErrorBoundary from './ErrorBoundary'
import Homepage from './Homepage'
import FacultyTrackingView from './FacultyMonitoringView/FacultyTrackingView/index'
import OverviewPageV1 from './V1/Overview'
import ProgrammeHomeView from './V1/ProgrammeHomeView'
import ProgrammeYearlyView from './V1/ProgrammeYearlyView'

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
        <Route
          exact
          path="/meta-evaluation/form/:form/:room"
          render={props => (
            <ProgrammeLevelMetaForm room={props.match.params.room} formString={props.match.params.form} />
          )}
        />

        <Route exact path="/faculty-monitoring" component={FacultyMonitoringOverview} />
        <Route
          exact
          path="/faculty-monitoring/:faculty"
          render={props => <FacultyTrackingView faculty={props.match.params.faculty} />}
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
        <Route exact path="/v1/overview" component={OverviewPageV1} />
        <Route exact path="/v1/programmes/:form/:programme" component={ProgrammeHomeView} />
        <Route exact path="/v1/programmes/:form/:programme/:year" component={ProgrammeYearlyView} />
      </Switch>
    </ErrorBoundary>
  </div>
)
