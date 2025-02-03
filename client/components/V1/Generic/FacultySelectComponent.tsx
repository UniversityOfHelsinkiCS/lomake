import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const faculties = [
    'Matemaattis-luonnontieteellinen',
    'Humanistinen',
    'Oikeustieteellinen',
];

const getStyles = (faculty: string, facultyName: readonly string[], theme: Theme) => {
    return {
        fontWeight: facultyName.includes(faculty)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const FacultySelectComponent = () => {
    const theme = useTheme();
    const [facultyName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof facultyName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <FormControl sx={{ width: 250 }}>
                <Select
                    multiple
                    displayEmpty
                    value={facultyName}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Placeholder</em>;
                        }

                        return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem disabled value="">
                        <em>Placeholder</em>
                    </MenuItem>
                    {faculties.map((faculty) => (
                        <MenuItem
                            key={faculty}
                            value={faculty}
                            style={getStyles(faculty, facultyName, theme)}
                        >
                            {faculty}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default FacultySelectComponent