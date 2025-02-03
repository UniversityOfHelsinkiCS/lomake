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

const levels = [
    'Kandi',
    'Maisteri',
];

const getStyles = (level: string, levelName: readonly string[], theme: Theme) => {
    return {
        fontWeight: levelName.includes(level)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const LevelSelectComponent = () => {
    const theme = useTheme();
    const [levelName, setLevelName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof levelName>) => {
        const {
            target: { value },
        } = event;
        setLevelName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <FormControl sx={{ width: 250 }}>
                <Select
                    //   multiple
                    displayEmpty
                    value={levelName}
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
                    {levels.map((level) => (
                        <MenuItem
                            key={level}
                            value={level}
                            style={getStyles(level, levelName, theme)}
                        >
                            {level}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default LevelSelectComponent