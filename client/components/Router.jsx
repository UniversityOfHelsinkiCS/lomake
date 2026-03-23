import { Route, Routes } from 'react-router' //  Navigate

import AboutPage from './AboutPage'
import FormView from './FormView'
import AdminPage from './UsersPage'
import OverviewPage from './OverviewPage'
import ReportPage from './ReportPage'
import ComparisonPage from './ComparisonPage'
import Page404 from './Generic/Page404'

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
import InterventionProcedure from './V1/Generic/InterventionProcedure'
import QualityManagement from './V1/Generic/QualityManagement'

export default () => (
  <div className="content">
    <ErrorBoundary>
      <Routes>
        <Route element={<Homepage />} exact path="/" />
        <Route element={<OverviewPage />} exact path="/yearly" />
        <Route element={<AdminPage />} exact path="/admin" />
        <Route element={<ReportPage />} exact path="/report" />
        <Route element={<ComparisonPage />} exact path="/comparison" />
        <Route element={<AboutPage />} exact path="/about" />
        <Route element={<FormView />} exact path="/yearly/form/:form/:room" />

        <Route element={<ProgrammeLevelMetaOverview />} exact path="/meta-evaluation" />
        <Route element={<ProgrammeLevelAnswers />} exact path="/meta-evaluation/answers" />
        <Route element={<ProgrammeLevelMetaForm />} exact path="/meta-evaluation/form/:form/:room" />

        <Route element={<FacultyMonitoringOverview />} exact path="/faculty-monitoring" />
        <Route element={<FacultyTrackingView />} exact path="/faculty-monitoring/:faculty" />

        <Route element={<ProgrammeLevelOverview />} exact path="/evaluation" />
        <Route element={<FacultyLevelOverview />} exact path="/evaluation-faculty" />
        <Route element={<CommitteeLevelOverview />} exact path="/evaluation-university" />
        <Route element={<DegreeReformOverview />} exact path="/degree-reform" />
        <Route element={<DegreeReformFormView />} exact path="/degree-reform/form/:room" />
        <Route element={<DegreeReformIndividualForm />} exact path="/individual" />
        <Route element={<EvaluationFormView />} exact path="/evaluation/form/:form/:room" />
        <Route element={<FacultyFormView />} exact path="/evaluation-faculty/form/:form/:room" />
        <Route element={<UniversityFormView />} exact path="/evaluation-university/form/:form/:room" />
        <Route element={<CommitteePrinting />} exact path="/evaluation-university/printing" />
        <Route element={<PastAnswersView />} exact path="/evaluation/previous-years/:programme" />
        <Route element={<PastAnswersViewFaculty />} exact path="/evaluation-faculty/previous-years/:faculty" />
        <Route
          element={<ViewEvaluationAnswersForFaculty />}
          exact
          path="/evaluation-faculty/programme-summary/:faculty"
        />
        <Route element={<ReformAnswers />} exact path="/reform-answers" />
        <Route element={<OverviewPageV1 />} exact path="/v1/overview" />
        <Route element={<ProgrammeHomeView />} exact path="/v1/programmes/:form/:programme" />
        <Route element={<InterventionProcedure />} exact path="/V1/programmes/:form/:programme/document/new" />
        <Route element={<InterventionProcedure />} exact path="/V1/programmes/:form/:programme/document/:id" />
        <Route element={<QualityManagement />} exact path="/V1/programmes/:form/:programme/qualitydocument/new" />
        <Route element={<QualityManagement />} exact path="/V1/programmes/:form/:programme/qualitydocument/:id" />
        <Route element={<ProgrammeYearlyView />} exact path="/v1/programmes/:form/:programme/:year" />

        {/* Route for programmatic redirects */}
        <Route element={<Page404 />} exact path="/404" />

        {/* Catch-all route for undefined paths */}
        <Route element={<Page404 />} />
      </Routes>
    </ErrorBoundary>
  </div>
)
