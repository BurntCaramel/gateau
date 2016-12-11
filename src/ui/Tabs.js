import React from 'react'
import seeds, { Seed } from 'react-seeds'
import Button from './Button'

function TabItem({
	title, selected,
	onClick,
	buttonStyler
}) {
	return (
		<Button
			children={ title } selected={ selected }
			grow={ 1 }
			height={ 32 }
			onClick={ onClick }
			styler={ buttonStyler }
		/>
	)
}

function Tabs({ items, buttonStyler, ...others }) {
	return (
		<Seed Component='nav' row { ...others }>
		{
			items.map((item, index) => (
				<TabItem key={ index}
					buttonStyler={ buttonStyler }
					{ ...item }
				/>
			))
		}
		</Seed>
	)
}

export default Tabs