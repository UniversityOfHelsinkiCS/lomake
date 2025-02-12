import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Search from '@mui/icons-material/Search'

interface SearchAutocompleteInputProps {
  placeholder: string
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchInput({ placeholder, setSearchValue }: SearchAutocompleteInputProps) {
  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const value = (event.target as HTMLInputElement).value
    setSearchValue(value)
  }

  return (
    <TextField
      style={{ width: 600 }}
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
      onKeyUp={handleOnKeyUp}
    />
  )
}
