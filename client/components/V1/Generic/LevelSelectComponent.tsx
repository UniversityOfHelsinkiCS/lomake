import { useState } from 'react';
import BaseSelectComponent from "./BaseSelectComponent";

/*
This is a purpose built component for filtering studyprogramme levels.
*/

const studyprogrammeLevels = [
    'Kaikki ohjelmatasot',
    'Kandiohjelmat',
    'Maisteriohjelmat',
];

const LevelSelectComponent = () => {
    const [selected, setSelected] = useState<string>(studyprogrammeLevels[0]);

    return (
      <div>
        <BaseSelectComponent
          options={studyprogrammeLevels}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    );
}

export default LevelSelectComponent