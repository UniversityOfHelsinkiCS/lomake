import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

/*
This is a purpose built component for filtering faculties.
Most of the code for this component is taken straight from the MUI documentation of their Select component.
*/

const faculties = [
    'Kaikki tiedekunnat',
    'Matemaattis-luonnontieteellinen',
    'Humanistinen',
    'Oikeustieteellinen',
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const getStyles = (faculty: string, facultyName: readonly string[], theme: Theme) => {
    return {
        fontWeight: facultyName.includes(faculty)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const FacultySelectComponent = ({ isMultiSelect = false } : { isMultiSelect?: boolean }) => {
    const theme = useTheme();
    const [facultyName, setPersonName] = React.useState<string[]>(['Kaikki tiedekunnat']);

    const handleSelect = (event: SelectChangeEvent<typeof facultyName>) => {
        // On autofill we get a stringified selections.
        const selections = event.target.value as string;

        if (selections === null) {
            setPersonName(["Kaikki tiedekunnat"]);
        } else {
            setPersonName(
                typeof selections === 'string' ? selections.split(',') : selections,
            );
        }
    };

    return (
        <div>
            <FormControl sx={{ width: 250 }}>
                <Select
                    label="Tiedekunta"
                    multiple={isMultiSelect}
                    value={facultyName}
                    onChange={handleSelect}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
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