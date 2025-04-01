import { Typography, Table, TableBody, TableHead, TableCell, TableRow, Divider, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '@/client/util/store'
import { calculateColor, calculateValue } from '../Utils/util'
import { TrafficLight } from './TrafficLightComponent'

const ColorHistoryComponent = (props: any) => {
  if (!props.programme || props.value == 'Ei dataa') {
    return null
  }
  const { t } = useTranslation()
  const lang = useSelector((state: { language: string }) => state.language)
  const data = useSelector((state: RootState) => state.keyData.data.data)

  const metadataItem = data.metadata.find(
    (item: any) => item.avainluvunNimi[lang] === props.title && item.ohjelmanTaso === props.level,
  )
  const dataKey = metadataItem ? metadataItem.avainluvunArvo : null

  const selectedYear = useSelector((state: RootState) => state.filters.keyDataYear)

  const programList = data[`${props.level.toLowerCase()}ohjelmat`] || []

  const history = programList
    .filter((programme: any) => {
      const isMatchingProgram = programme.koulutusohjelmakoodi === props.programme.koulutusohjelmakoodi
      const hasValue = dataKey && programme.values[dataKey] !== undefined
      const isDifferentYear = programme.year !== selectedYear - 1

      return isMatchingProgram && hasValue && isDifferentYear
    })
    .map((programme: any) => ({
      year: programme.year + 1,
      value: dataKey ? programme.values[dataKey] : null,
    }))
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="italic">{t('keyData:yearlyDevelopment')}</Typography>
      <Table key={data.year} sx={{ mt: 2 }}>
        <TableHead>
          <TableCell align="center">
            <Typography variant="lightSmall">{t('keyData:year')}</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="lightSmall">{t('keyData:value')}</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="lightSmall">{t('keyData:trafficLight')}</Typography>
          </TableCell>
        </TableHead>
        <TableBody>
          {history.map((data: any) => {
            const color = calculateColor(data.value, props.thresholds, props.color, props.unit)
            const valueText = calculateValue(data.value, props?.unit)
            return (
              <TableRow key={data.year}>
                <TableCell align="center">
                  <Typography variant="lightSmall">{data.year}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="lightSmall">{valueText}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="lightSmall">
                    <TrafficLight color={color} />
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

export default ColorHistoryComponent
