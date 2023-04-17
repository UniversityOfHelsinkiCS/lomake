import CsvDownload from 'Components/Generic/CsvDownload'
import React from 'react'
import PDFDownload from './PDFDownload'

const Downloads = ({ programme }) => {
  return (
    <div className="hide-in-print-mode" style={{ marginTop: '2em', display: 'flex' }}>
      <div
        data-cy="csv-download"
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: '1em',
          padding: '0.3em 0',
          paddingRight: '1em',
          borderRight: '1px solid #ccc',
        }}
      >
        <CsvDownload programme={programme} view="form" wantedData="written" />
        <CsvDownload programme={programme} view="form" wantedData="colors" />
      </div>
      <div style={{ padding: '0.3em 0' }}>
        <PDFDownload />
      </div>
    </div>
  )
}

export default Downloads
