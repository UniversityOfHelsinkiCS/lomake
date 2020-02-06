import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'

const Section = ({ title, number, children }) => {
	const [collapsed, setCollapsed] = useState(true)
	return (
		<>
			<div className="section-flex" onClick={() => setCollapsed(!collapsed)}>
				<h2 style={{ margin: '0' }}>
					<span style={{ color: '#007290' }}>{number}</span> - {title}
				</h2>
				<Icon name={collapsed ? 'plus' : 'minus'} style={{ color: '#007290' }} />
			</div>
			{!collapsed && <>{children}</>}
		</>
	)
}

export default Section
