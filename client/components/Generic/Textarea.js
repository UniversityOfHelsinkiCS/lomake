import React, { useState } from 'react'
import ReactMde, { commands } from 'react-mde'
import ReactMarkdown from 'react-markdown'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'

const listCommands = [
	{
		commands: [
			commands.boldCommand,
			commands.italicCommand,
			commands.headerCommand,
			commands.linkCommand,
			commands.quoteCommand,
			commands.orderedListCommand,
			commands.unorderedListCommand
		]
	}
]

const Textarea = ({ label, id, required }) => {
	const dispatch = useDispatch()
	const fieldName = `${id}_text`
	const handleChange = (text) => dispatch(updateFormField(fieldName, text))
	const value = useSelector(({ form }) => form.data[fieldName] || '')
	const [selectedTab, setSelectedTab] = useState('write')

	return (
		<div style={{ margin: '1em 0' }}>
			<label style={{ fontStyle: 'bold' }}>
				{label}
				{required && <span style={{ color: 'red', marginLeft: '0.2em' }}>*</span>}
			</label>
			<div style={{ marginTop: '1em' }} className="container">
				<ReactMde
					value={value}
					onChange={handleChange}
					selectedTab={selectedTab}
					onTabChange={setSelectedTab}
					commands={listCommands}
					generateMarkdownPreview={(markdown) =>
						Promise.resolve(<ReactMarkdown source={markdown} />)
					}
				/>
			</div>
			<span style={{ color: value.length > 1000 ? 'red' : undefined }}>{value.length}/1000</span>
		</div>
	)
}

export default Textarea
