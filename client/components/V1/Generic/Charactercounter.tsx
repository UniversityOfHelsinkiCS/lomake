import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const CharacterCounter = ({ count, maxLength }: { count: number; maxLength: number }) => {
  const { t } = useTranslation()
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      <Typography
        component="span"
        sx={{
          color: count >= maxLength ? 'error.main' : 'text.secondary',
          fontSize: '1rem',
        }}
      >
        {count >= maxLength ? t(`error:maxLength`, { maxLength }) : `${count}/${maxLength}`}
      </Typography>
    </Box>
  )
}

export default CharacterCounter
