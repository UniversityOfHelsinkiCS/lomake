import * as React from 'react';
import {
    MenuItem,
    FormControl,
} from '@mui/material';

import Select, { SelectChangeEvent } from '@mui/material/Select';

/*
This is a generic base component for creating selection or filtering functionalities.
Most of the code for this component is taken straight from the MUI documentation of their Basic Select component.
*/

const BaseSelectComponent = ({
    options,
    width = 250,
    selected,
    setSelected
}: {
    options: string[],
    selected: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>,
    width?: number
}) => {


    const handleSelect = (event: SelectChangeEvent<typeof selected>) => {
        // On autofill we get a stringified selected.
        const value = event.target.value as string;
        if (!value) {
            setSelected(options[0]);
        } else {
            setSelected(value);
        }
    };

    return (
        <div>
            <FormControl sx={{ width }}>
                <Select
                    defaultValue={options[0]}
                    value={selected}
                    onChange={handleSelect}
                >
                    {options.map((option) => (
                        <MenuItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default BaseSelectComponent