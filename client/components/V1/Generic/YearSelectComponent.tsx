import { useState } from 'react';
import BaseSelectComponent from "./BaseSelectComponent";

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
      <BaseSelectComponent
        options={years}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}

export default YearSelectComponent