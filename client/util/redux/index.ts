import { configureStore } from '@reduxjs/toolkit'
import { handleRequest, RTKApi } from '../apiConnection'
import webSocketMiddleware from '../webSocket'

import form from './formReducer'
import room from './roomReducer'
import currentUser from './currentUserReducer'
import filters from './filterReducer'
import users from './usersReducer'
import tempAnswers from './tempAnswersReducer'
import oldAnswers from './oldAnswersReducer'
import language from './languageReducer'
import previousAnswers from './previousAnswersReducer'
import programmesUsers from './programmesUsersReducer'
import studyProgrammes from './studyProgrammesReducer'
import deadlines from './deadlineReducer'
import currentEditors from './currentEditorsReducer'
import faculties from './facultyReducer'
import summaries from './summaryReducer'
import reformAnswers from './reformAnswerReducer'
import monitoring from './facultyMonitoringReducer'
import keyData from './keyDataSlice'
import reports from './reportsSlice'
import documents from './documentsSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
// import organisation from './organisation'

const store = configureStore({
  reducer: {
    form,
    room,
    currentUser,
    filters,
    users,
    tempAnswers,
    oldAnswers,
    language,
    previousAnswers,
    programmesUsers,
    studyProgrammes,
    deadlines,
    currentEditors,
    faculties,
    summaries,
    reformAnswers,
    monitoring,
    keyData,
    reports,
    documents,
    // organisation,
    [RTKApi.reducerPath]: RTKApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(RTKApi.middleware)
      .concat(webSocketMiddleware, handleRequest),
  devTools: process.env.NODE_ENV !== 'production',
})

setupListeners(store.dispatch)

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default store
