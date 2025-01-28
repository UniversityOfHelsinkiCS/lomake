import { TextField, Button, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const MeasuresTextField = () => {
    const { t } = useTranslation()

    const [content, setContent] = useState<string>('')
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const handleStopEditing = () => {
        setIsEditing(false)
    }

    const handleStartEditing = () => {
        setIsEditing(true)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
            <TextField
                disabled={!isEditing}
                type='text'
                defaultValue={content}
                variant='outlined'
                multiline
                minRows={8}
                fullWidth
                label="Testattava tekstikenttä"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            {
                isEditing ?
                    <Button
                        variant='contained'
                        onClick={handleStopEditing}>
                        {t('stopEditing')}
                    </Button>
                    :
                    <Button
                        variant='contained'
                        onClick={handleStartEditing}>
                        {t('edit')}
                    </Button>
            }
        </Box >

    )
}

export default MeasuresTextField