import { Typography, Table, TableBody, TableHead, TableCell, TableRow, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { calculateColor, calculateValue } from '@/client/util/v1'
import { TrafficLight } from './TrafficLightComponent'
import { ProgrammeLevel } from '@/shared/lib/enums'
import { useAppSelector } from '@/client/util/hooks'

const ColorHistoryComponent = (props: any) => {
  if (!props.programme || props.value == 'Ei dataa') {
    return null
  }
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language)
  const data = useAppSelector(state => state.keyData.data.data)

  const metadataItem = data.metadata.find(
    (item: any) => item.avainluvunNimi[lang] === props.title && item.ohjelmanTaso === props.level,
  )

  const dataKey = metadataItem ? metadataItem.avainluvunArvo : null

  const selectedYear = useAppSelector(state => state.filters.keyDataYear)

  const programList = props.level === ProgrammeLevel.Bachelor ? data[`kandiohjelmat`] : data[`maisteriohjelmat`]

  const history = programList
    .filter((programme: any) => {
      const isMatchingProgram = programme.koulutusohjelmakoodi === props.programme.koulutusohjelmakoodi
      const hasValue = dataKey && programme.values[dataKey] !== undefined
      const isDifferentYear = programme.year !== selectedYear - 1

      return isMatchingProgram && hasValue && isDifferentYear
    })
    .map((programme: any) => ({
      year: programme.year,
      value: dataKey ? programme.values[dataKey] : null,
    }))

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography variant="italic">{t('keyData:yearlyDevelopment')}</Typography>
      {history.length > 0 ? (
        <Table key={data.year} sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="lightSmall">{t('keyData:year')}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="lightSmall">{t('keyData:value')}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="lightSmall" data-cy="history-trafficlight">
                  {t('keyData:trafficLight')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((data: any) => {
              const color = calculateColor(data.value, props.thresholds, props.color, props.unit)
              const valueText = calculateValue(data.value, props?.unit)
              const year = data.year
              return (
                <TableRow key={year}>
                  <TableCell align="center">
                    <Typography variant="lightSmall" data-cy={`history-${metadataItem.avainluvunArvo}-${year}`}>
                      {year}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="lightSmall" data-cy={`history-${metadataItem.avainluvunArvo}-${year}-value`}>
                      {valueText}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    data-cy={`history-${metadataItem.avainluvunArvo}-${year}-${color}`}
                  >
                    <TrafficLight color={color} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <Typography
          variant="italic"
          color="secondary"
          sx={{ mt: 4, justifyContent: 'center', display: 'flex' }}
          data-cy="no-history"
        >
          {t('keyData:noHistory')}
        </Typography>
      )}
    </Box>
  )
}

export default ColorHistoryComponent
