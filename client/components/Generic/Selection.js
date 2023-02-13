import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Checkbox } from 'semantic-ui-react'
import { colors } from 'Utilities/common'
import './Generic.scss'
// import SimpleTextarea from './SimpleTextarea'

const Selection = ({ label, description, required, number, extrainfo, options, lang }) => {
  const [selected, setSelected] = useState({})
  const [other, setOther] = useState('')
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const ids = Object.keys(options)

  useEffect(() => {
    const data = {}
    ids.forEach(id => {
      data[id] = false
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
      select: 'Valitse sopivat vaihtoehdot',
      other: 'Muu, mikä',
      info: 'Lisää puuttuvat vaihtoehdot - Voit lisätä useamman',
    },
    en: {
      select: 'Valitse sopivat vaihtoehdot',
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
        {description}
        <p className="form-question-extrainfo">{t[lang].select}</p>
        <p className="form-question-extrainfo">{extrainfo}</p>
      </p>
      <div className="selection-group">
        {ids.map(id => {
          return (
            <Checkbox
              id={id}
              label={options[id][lang]}
              onChange={(e, data) => handleSelection(data)}
              checked={selected[id]}
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
