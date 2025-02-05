import { useState } from 'react';

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
      </div>
    );
}

export default LevelSelectComponent