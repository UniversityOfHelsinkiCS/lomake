import React, { useState } from 'react'
import { Icon, Button } from 'semantic-ui-react'

import { requiredFormIds } from 'Utilities/common'
import { useSelector } from 'react-redux'

const Section = ({ title, number, children }) => {
	const [collapsed, setCollapsed] = useState(true)
	const [hasBeenClosed, setHasBeenClosed] = useState(false)

	const ids = children
		.map(children => children.props.id)
		.filter(id => id !== undefined)
		.reduce((acc, cur) => {
			return [...acc, `${cur}_light`, `${cur}_text`]
		}, [])
	const values = useSelector(({ form }) => form.data)

	const getProgressIcon = () => {
		if (!hasBeenClosed) return null

		// checking that every id of a field is either not required or there is some input
		if (ids.every(id => requiredFormIds.indexOf(id) === -1 || values[id])) {
			return <Icon name="check" style={{ color: 'green' }} />
		}

		return <Icon name="close" style={{ color: 'red' }} />
	}

	const textValuesOverLimit = () => {
		return ids
			.filter(id => id.indexOf('text') !== -1)
			.some(id => values[id] && values[id].length > 500)
	}

	return (
		<>
			<div
				className="section-flex"
				onClick={() => {
					setCollapsed(!collapsed)
				}}
			>
				<h2 style={{ margin: '0', maxWidth: '650px' }}>
					<span style={{ color: '#007290' }}>{number}</span> - {title}
				</h2>
				<div>
					<Icon name={collapsed ? 'plus' : 'minus'} style={{ color: '#007290' }} />
					{getProgressIcon()}
				</div>
			</div>
			{!collapsed && (
				<>
					{children}
					{textValuesOverLimit() ? (
						<>
							<Button style={{ width: '150px' }} disabled={textValuesOverLimit()}>
								Next
							</Button>{' '}
							<span style={{ color: 'red' }}>One or more answers that are too long</span>
						</>
					) : (
						<Button
							style={{ width: '150px' }}
							disabled={textValuesOverLimit()}
							onClick={() => {
								setHasBeenClosed(true)
								setCollapsed(true)
							}}
						>
							Next
						</Button>
					)}
				</>
			)}
		</>
	)
}

export default Section
