import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateFormField } from '../../redux/formReducer'
import './Generic.scss'
import { formKeys } from '../../../config/data'

const TrafficLights = ({ id, form }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const fieldName = `${id}_light`
  const choose = (name, id) => dispatch(updateFormField(name, id, form))
  const value = useSelector(({ form }) => form.data[fieldName])
  const finnishUniFormData = useSelector(({ form }) => form.finnishUniFormData.data)
  const reduxViewOnly = useSelector(({ form }) => form.viewOnly)

  const isUniFormLanguageVersion = /((\/UNI_EN)|(\/UNI_SE))/.exec(window.location.href)
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const viewOnly = reduxViewOnly || isUniFormLanguageVersion

  const getClassName = color => {
    let tempValue = value
    if (form === formKeys.EVALUATION_COMMTTEES && finnishUniFormData) {
      tempValue = finnishUniFormData[fieldName]
    }
    if (tempValue === color) return `circle-big-${color}-selected${viewOnly ? '' : ' selected-animated'}`

    return `circle-big-${color}${viewOnly ? '' : ' unselected-animated'}`
  }

  return (
    <div style={{ margin: '1em 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
        <div title={`${t('positive')}`}>
          <div
            className={getClassName('green')}
            data-cy={`color-positive-${id}`}
            onClick={!viewOnly ? () => choose(fieldName, 'green') : undefined}
          />
        </div>
        <div title={`${t('neutral')}`}>
          <div
            className={getClassName('yellow')}
            data-cy={`color-neutral-${id}`}
            onClick={!viewOnly ? () => choose(fieldName, 'yellow') : undefined}
          />
        </div>
        <div title={`${t('negative')}`}>
          <div
            className={getClassName('red')}
            data-cy={`color-negative-${id}`}
            onClick={!viewOnly ? () => choose(fieldName, 'red') : undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default TrafficLights
