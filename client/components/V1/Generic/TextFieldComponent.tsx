import { TextField, Button, Box } from '@mui/material'

const TextFieldComponent = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
            <TextField multiline label="Testattava tekstikenttä" sx={{ width: '100%' }} />
            <Button variant='contained'>Tallenna</Button>
        </Box>

    )
}

export default TextFieldComponent