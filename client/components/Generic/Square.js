import React, { useState } from 'react'
import { Card } from 'semantic-ui-react'

const squareStyles = {
  boxShadow: '0px 0px 1px 1px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  width: '80px',
  height: '80px',
  transition: 'filter 0.3s',
  position: 'relative',
}

const colors = {
  red: { backgroundColor: '#ff7f7f', hover: { filter: 'brightness(0.8)' } },
  yellow: { backgroundColor: '#feffb0', hover: { filter: 'brightness(0.8)' } },
  green: { backgroundColor: '#9dfe9c', hover: { filter: 'brightness(0.8)' } },
  gray: { border: '4px solid gray', backgroundColor: 'transparent', hover: { filter: 'brightness(0.8)' } },
}

const Square = ({ color, setQuestionModal, answerObject, chevron = null, t }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { backgroundColor, hover } = colors[color] || colors.gray

  const handleMouseEnter = e => {
    e.currentTarget.style.filter = hover.filter
    setShowTooltip(true)
  }

  const handleMouseLeave = e => {
    e.currentTarget.style.filter = 'none'
    setShowTooltip(false)
  }

  return (
    <div className="square-container" title={t(`facultyTracking:${color}`)}>
      <Card
        data-cy={`square-${answerObject.faculty}-${answerObject.part.id}`}
        style={{
          ...squareStyles,
          backgroundColor,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setQuestionModal(answerObject)}
      >
        {chevron}
      </Card>
    </div>
  )
}

export default Square
