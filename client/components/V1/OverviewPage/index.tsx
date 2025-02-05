import { useLocation } from "react-router"

import DataComponent from "./DataComponent"
import YearSelectComponent from "../Generic/YearSelectComponent"
import FacultySelectComponent from "../Generic/FacultySelectComponent"
import LevelSelectComponent from "../Generic/LevelSelectComponent"

const OverviewPage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const programLevel = searchParams.get("level")
  const faculty = searchParams.get("faculty")
  const year = searchParams.get("year")

  return (
    <div className="content" style={{padding: "2rem"}}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%", marginBottom: "2.5rem" }}>
        {/* TODO: TRANSLATE */}
        {/* TODO: Check global stylings for h1 */}
        <h1 style={{margin: 0}}>VUOSISEURANTA</h1>

        {/* Filters */}
        <LevelSelectComponent />
        <FacultySelectComponent />
        <YearSelectComponent />
      </div>

      <DataComponent programLevel={programLevel} faculty={faculty} year={parseInt(year)}/>
    </div>
  )
}

export default OverviewPage
