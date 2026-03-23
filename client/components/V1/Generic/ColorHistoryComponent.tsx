import { Typography, Table, TableBody, TableHead, TableCell, TableRow, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { calculateColor, calculateValue } from '@/client/util/v1'
import { TrafficLight } from './TrafficLightComponent'
import { ProgrammeLevel } from '@/shared/lib/enums'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchKeyDataQuery } from '@/client/redux/keyData'

const ColorHistoryComponent = (props: any) => {
  const { t } = useTranslation()
  const lang = useAppSelector(state => state.language)
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)
  if (!props.programme || props.value == 'Ei dataa') {
    return null
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useFetchKeyDataQuery()

  const metadataItem = data.metadata.find(
    (item: any) => item.avainluvunNimi[lang] === props.title && item.ohjelmanTaso === props.level
  )

  const dataKey = metadataItem ? metadataItem.avainluvunArvo : null
  const programList = props.level === ProgrammeLevel.Bachelor ? data.kandiohjelmat : data.maisteriohjelmat

  const history = programList
    .filter((programme: any) => {
      const isMatchingProgram = programme.koulutusohjelmakoodi === props.programme.koulutusohjelmakoodi
      const hasValue = dataKey && programme.values[dataKey] !== undefined
      const isDifferentYear = programme.year < selectedYear - 1

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
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="lightSmall">{t('keyData:year')}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="lightSmall">{t('keyData:value')}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography data-cy="history-trafficlight" variant="lightSmall">
                  {t('keyData:trafficLight')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((data: any) => {
              const color = calculateColor(data.value, props.thresholds, props.color, props.unit)
              const valueText = calculateValue(data.value, props?.unit)
              const { year } = data
              return (
                <TableRow key={year}>
                  <TableCell align="center">
                    <Typography data-cy={`history-${metadataItem.avainluvunArvo}-${year}`} variant="lightSmall">
                      {year}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography data-cy={`history-${metadataItem.avainluvunArvo}-${year}-value`} variant="lightSmall">
                      {valueText}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    data-cy={`history-${metadataItem.avainluvunArvo}-${year}-${color}`}
                    sx={{ display: 'flex', justifyContent: 'center' }}
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
          color="secondary"
          data-cy="no-history"
          sx={{ mt: 4, justifyContent: 'center', display: 'flex' }}
          variant="italic"
        >
          {t('keyData:noHistory')}
        </Typography>
      )}
    </Box>
  )
}

export default ColorHistoryComponent
