import { TextField, Button, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'


const TextFieldComponent = () => {
    const { t } = useTranslation()
    
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
            <TextField disabled multiline minRows={10} fullWidth label="Testattava tekstikenttä" />
            <Button variant='contained'>{t('edit')}</Button>
        </Box>

    )
}

export default TextFieldComponent