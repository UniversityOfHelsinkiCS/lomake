import { useSelector, useDispatch } from 'react-redux'
import DataComponent from './DataComponent'

import MeasuresTextField from './Generic/MeasuresTextField'
import { useEffect } from 'react'
import { getStudyProgrammes } from '../../util/redux/studyProgrammesReducer'




const Page = () => {
  // testaillen toimenpide tekstikenttää
  /*
  MVP
  1. Tuo koulutusohjelma toimenpiteet teksti sisään
  2. Näytä teksti
  3. Muokkaa tekstiä
  4. Sulje muokkaus muilta
  5. Tallenna teksti
  6. vapauta muokkaus muille
  */
  const dispatch = useDispatch()

  // tänne studyprogramme
  
  const studyprogramme = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  
  useEffect(() => {
    dispatch(getStudyProgrammes())
  }, [])

  return (
    <div>
      <h1>Page</h1>
      <br />
      <pre>
        {JSON.stringify(studyprogramme, null, 2)}
      </pre>

      {/* testaillen toimenpide tekstikenttää */}
      <div>
        <h1>TESTI TOIMENPITEET</h1>
        <MeasuresTextField />

      </div>

      <br />
      <br />
      <DataComponent />
      <DataComponent />
    </div>
  )
}

export default Page