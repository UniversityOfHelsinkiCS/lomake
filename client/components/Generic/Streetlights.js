import React from 'react'

const Streetlights = ({ label }) => {
  return (
    <div className="form-streetlights">
      <label>{label}</label>
      <div>
        <div>
          <input id="green" name="light" type="radio" />
          <label for="green">GREEN</label>
        </div>
        <div>
          <input id="yellow" name="light" type="radio" />
          <label for="yellow">YELLOW</label>
        </div>
        <div>
          <input id="red" name="light" type="radio" />
          <label for="red">RED</label>
        </div>
      </div>
    </div>
  )
}

export default Streetlights
