import React from 'react'
import seeds, { Seed } from 'react-seeds'
import Button from '../../ui/Button'

const buttonStyler = seeds({
	grow: 1,
	height: 42
})

const PreviewTabs = () => (
	<Seed Component='nav' row margin={{ top: '1rem' }}>
		<Button children='Wireframe' { ...buttonStyler } />
		<Button children='Web' selected { ...buttonStyler } />
		<Button children='React Code' { ...buttonStyler } />
	</Seed>
)

export default PreviewTabs