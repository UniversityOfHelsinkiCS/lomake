import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Checkbox } from 'semantic-ui-react'
import { colors } from 'Utilities/common'
import './Generic.scss'
// import SimpleTextarea from './SimpleTextarea'

const Selection = ({ label, required, number, extrainfo, options, lang }) => {
  const [selected, setSelected] = useState({})
  const [other, setOther] = useState('')
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  useEffect(() => {
    const data = {}
    options.forEach(option => {
      data[option] = false
    })
    setSelected(data)
  }, [options])

  const handleSelection = data => {
    const { id, checked } = data
    const updated = { ...selected }
    updated[id] = checked
    setSelected(updated)
  }

  const handleOther = ({ target }) => setOther(target.value)

  // To do: move to translations
  const t = {
    fi: {
      norppa: 'Norppa',
      howULearn: 'HowULearn',
      kandipalaute: 'Kandipalaute',
      thessa: 'Thessa',
      isb: 'ISB',
      uraseuranta: 'Uraseuranta',
      other: 'Muu, mikä',
      info: 'Lisää puuttuvat vaihtoehdot - Voit lisätä useamman',
    },
    en: {
      norppa: 'Norppa',
      howULearn: 'HowULearn',
      kandipalaute: 'Kandipalaute',
      thessa: 'Thessa',
      isb: 'ISB',
      uraseuranta: 'Uraseuranta',
      other: 'Muu, mikä',
      info: 'Lisää puuttuvat vaihtoehdot - Voit lisätä useamman',
    },
  }

  return (
    <>
      <h3>
        {number}. {label} {required && <span style={{ color: colors.red, marginLeft: '0.2em' }}>*</span>}
      </h3>
      <p
        className="hide-in-print-mode"
        style={{
          lineHeight: 2,
          backgroundColor: colors.background_blue,
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
        }}
      >
        Valitse sopivat vaihtoehdot
        <p className="form-question-extrainfo">{extrainfo}</p>
      </p>
      <div className="selection-group">
        {options.map(option => {
          return (
            <Checkbox
              id={option}
              label={t[lang][option]}
              onChange={(e, data) => handleSelection(data)}
              checked={selected[option]}
              disabled={viewOnly}
            />
          )
        })}
        <div className="form-textarea">
          <label>{t[lang].other}</label>
          {viewOnly ? (
            <>{other}</>
          ) : (
            <textarea id="other" value={other} onChange={handleOther} placeholder={t[lang].info} />
          )}
        </div>
      </div>
    </>
  )
}

export default Selection
