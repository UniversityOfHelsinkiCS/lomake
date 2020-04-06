import React from 'react'
import OwnerAccordionLinks from './OwnerAccordionLinks'
import OwnerAccordionUsers from './OwnerAccordionUsers'

const OwnerAccordionContent = ({ program }) => {
  return (
    <>
      <OwnerAccordionLinks programme={program} />
      <OwnerAccordionUsers programme={program} />
    </>
  )
}

export default OwnerAccordionContent
