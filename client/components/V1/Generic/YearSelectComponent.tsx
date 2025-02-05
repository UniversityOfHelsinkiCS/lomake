import { useState } from 'react';

/*
This is a purpose built component for selecting the years of interest.
*/

const years = [
  '2025',
  '2024'
];

const YearSelectComponent = () => {
  const [selected, setSelected] = useState<string>(years[0]);

  return (
    <div>
      
    </div>
  );
}

export default YearSelectComponent