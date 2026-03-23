import { useSelector } from 'react-redux'
import { colors } from '../../util/common'
import { useTranslation } from 'react-i18next'
import Textarea from './Textarea'
import MetaTrafficLights from './MetaTrafficLights'
import './Generic.scss'

const MetaEntity = ({ id, label, description, required, noColor, number, form, kludge }) => {
  const fieldName = `${id}_light`
  const { t } = useTranslation()
  const value = useSelector(({ form }) => form.data[fieldName])
  const bool = value !== 'gray'

  return (
    <div className="form-entity-area" style={{ marginBottom: '3.5em' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ flexBasis: '75%' }}>
          <h3>
            {number}. {label}{' '}
            {required ? (
              <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600', maxWidth: '' }}>*</span>
            ) : null}
          </h3>
        </div>
        {!noColor && <MetaTrafficLights form={form} id={id} />}
      </div>
      {bool ? <Textarea form={form} id={id} kludge={kludge} label={description} marginTop="0" /> : null}
      <br />
      <Textarea
        form={form}
        id={`${id}_comment`}
        kludge={kludge}
        label={`${t('formView:metaCommentLabel')}`}
        marginTop="0"
      />
    </div>
  )
}

export default MetaEntity
