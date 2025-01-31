import DataComponent from "./DataComponent"


const OverviewPage = () => {
  return (
    <div className="content">
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%" }}>
        {/* TODO: TRANSLATE */}
        <h1>VUOSISEURANTA</h1>
        
        <span>filter</span>
        <span>filter</span>
        <span>filter</span>
      </div>
      <DataComponent />
    </div>
  )
}

export default OverviewPage
