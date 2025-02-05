import { useState } from 'react'; 
import BaseSelectComponent from "./BaseSelectComponent";

/*
This is a purpose built component for filtering faculties.
*/

const faculties = [
    'Kaikki tiedekunnat',
    'Matemaattis-luonnontieteellinen',
    'Humanistinen',
    'Oikeustieteellinen',
];

const FacultySelectComponent = () => {
    const [selected, setSelected] = useState<string>(faculties[0]);

    return (
      <div>
        <BaseSelectComponent
          options={faculties}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    );
}

export default FacultySelectComponent