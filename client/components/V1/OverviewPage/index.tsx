import { useLocation, useHistory, } from "react-router"
import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { RootState } from '../../../util/store';
import { setFaculty, setYear, setLevel } from '../../../util/redux/filterReducer'

import DataComponent from "./DataComponent"
import YearFilter from "../Generic/YearFilterComponent"
import FacultyFilter from "../Generic/FacultyFilterComponent"
import LevelFilter from "../Generic/LevelFilterComponent"

const OverviewPage = () => {
  const location = useLocation()
  const history = useHistory()
  const searchParams = new URLSearchParams(location.search)

  const dispatch = useDispatch()
  const selectedFaculties = useSelector((state: RootState) => state.filters.faculty)
  const selectedLevel = useSelector((state: RootState) => state.filters.level)
  const selectedYear = useSelector((state: RootState) => state.filters.year)

  useEffect(() => {
    // This checks the URL for query parameters and updates the redux store accordingly
    const facultyParams = searchParams.get("faculties")?.split(",") || []
    const levelParam = searchParams.get("level")
    const yearParam = searchParams.get("year")

    if (facultyParams.length > 0) dispatch(setFaculty(facultyParams))
    if (levelParam) dispatch(setLevel(levelParam))
    if (yearParam) dispatch(setYear(yearParam))
  }, [dispatch])


  useEffect(() => {
    // This is called whenever the filters change and sets the URL accordingly
    history.push({
      pathname: location.pathname,
      search: `?faculties=${selectedFaculties.join(",")}&levels=${selectedLevel}&year=${selectedYear}`
    })
  }, [selectedFaculties, selectedLevel, selectedYear])


  return (
    <div className="content" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%", marginBottom: "2.5rem" }}>
        <h1 style={{ margin: 0 }}>VUOSISEURANTA</h1>

        <div style={{ display: "flex", gap: "1rem" }}>
          <LevelFilter />
          <FacultyFilter />
          <YearFilter />
        </div>
      </div>

      <DataComponent
        yearFilter={selectedYear}
        facultyFilter={selectedFaculties}
        programmeLevelFilter={selectedLevel}
      />
    </div>
  )
}

export default OverviewPage
