import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Search from '@mui/icons-material/Search'

interface SearchAutocompleteInputProps {
  placeholder: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

// eslint-disable-next-line react/function-component-definition
export default function SearchInput({ placeholder, setSearchValue }: SearchAutocompleteInputProps) {
  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { value } = event.target as HTMLInputElement
    setSearchValue(value)
  }

  return (
    <TextField
      onKeyUp={handleOnKeyUp}
      placeholder={placeholder}
      slotProps={{
        input: {
          type: 'search',
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        },
      }}
      style={{ width: 600 }}
    />
  )
}
