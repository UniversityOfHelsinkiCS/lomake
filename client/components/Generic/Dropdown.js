import React from 'react'

const Dropdown = ({ id, onChange, label, options }) => {
  const handleChange = () => {
    console.warn('123 Not yet implemented')
  }
  return (
    <div className="form-dropdown">
      <label>{label}</label>
      <select id={id} onChange={onChange || handleChange} defaultValue="Select:">
        <option disabled> Select: </option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default Dropdown
