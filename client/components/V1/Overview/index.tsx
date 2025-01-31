import DataComponent from "./DataComponent"
import { useLocation } from "react-router"

const OverviewPage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const programLevel = searchParams.get("level")
  const faculty = searchParams.get("faculty")
  const year = searchParams.get("year")

  return (
    <div className="content">
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%" }}>
        {/* TODO: TRANSLATE */}
        <h1>VUOSISEURANTA</h1>

        <span>filter</span>
        <span>filter</span>
        <span>filter</span>
      </div>

      <DataComponent programLevel={programLevel} faculty={faculty} year={parseInt(year)}/>
    </div>
  )
}

export default OverviewPage
