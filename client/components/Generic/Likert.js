import React from 'react'

import { RadioGroup, FormControlLabel, Radio } from '@mui/material'

const styles = {
  optionLabel: {
    marginLeft: theme => theme.spacing(0.5),
    marginRight: theme => theme.spacing(0.5),
  },
  dontKnowLabel: {
    marginLeft: theme => theme.spacing(2),
    marginRight: theme => theme.spacing(0.5),
  },
}

const options = [1, 2, 3, 4, 5, 0]

const LikertPreview = () => {
  const parseOption = option => {
    if (option !== 0) return option.toString()

    return 'En osaa sanoa'
  }

  return (
    <RadioGroup row>
      {options.map(option => (
        <FormControlLabel
          labelPlacement="top"
          value={option.toString()}
          control={<Radio color="primary" />}
          label={parseOption(option)}
          key={option}
          sx={option !== 0 ? styles.optionLabel : styles.dontKnowLabel}
        />
      ))}
    </RadioGroup>
  )
}

export default LikertPreview
