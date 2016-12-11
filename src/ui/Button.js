import React from 'react'
import seeds, { Seed } from 'react-seeds'
import defaultStyler from 'react-sow/default'

import * as colors from '../colors'

const fontSizeForProps = (props) => (
	(props.huge) ? (
		21
	) : (props.small) ? (
		14
	) : (
		16
	)
)

export default ({
	huge, small, selected,
	padding = 0,
	styler = defaultStyler,
	...props
}) => (
	<Seed Component='button'
		{ ...props }
		padding={ padding }
		font={{ size: fontSizeForProps({ huge, small }) }}
		text={{ color: selected ? colors.light : colors.dark }}
		background={{ color: selected ? colors.dark : colors.light }}
		border='none'
		cornerRadius={ 0 }
		{ ...styler({ selected }) }
		styler={ styler }
	/>
)