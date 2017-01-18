import R from 'ramda'
import seeds from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as colors from '../colors' 

export const mainColumn = seeds({
	//basis: '49%',
	grow: 0,
	shrink: 0,
	width: 320,
	margin: { left: '0.5%', right: '0.5%' }
	//padding: { top: '1rem' }
})

export const previewColumn = ({ destinationDevice }) => ({
	zIndex: 1,
	grow: 1,
	shrink: 0,
	basis: 'calc(100vw - 320px)',
	minWidth: 320,
	maxWidth: (destinationDevice === 'phone') && 414,
	margin: { right: 5 },
	boxShadow: `0 0 10px ${ rgba.whiteValue(0, 0.333) }`
})

export const sourceField = ({
	column: true,
	width: '100%',
	padding: '1rem',
	font: { size: 16 },
	text: { color: colors.source.text },
	background: { color: colors.source.background },
	border: { width: 1, style: 'solid', color: colors.source.border }
})

export const recordField = ({
	width: '100%',
	padding: '0.5rem',
	font: { size: 16 },
	//text: { color: colors.light },
	background: { color: colors.lightKeyB },
	border: 'none'
})

export const markdownField = ({
	column: true,
	width: '100%',
	padding: '1rem',
	font: { size: 16 },
	//text: { color: colors.light },
	background: { color: colors.lightKeyB },
	border: { width: 1, style: 'solid', color: colors.light1mid }
})

export const ingredientContentField = ({ error }) => ({
	padding: '0.5rem',
	font: { size: 16 },
	text: { align: 'left', color: colors.ingredient.field.text },
	background: { color: error != null ? colors.errorFieldBackground : colors.ingredient.field.background },
	border: { width: 1, style: 'solid', color: colors.ingredient.field.border }
})

export const ingredientIDField = R.evolve({
	font: R.merge({ weight: 'bold' })
}, ingredientContentField({}))

export const ingredientButton = ({ selected }) => {
	const buttonColors = colors.ingredient.button[selected ? 'selected' : 'normal']
	return {
		text: { color: buttonColors.text },
		background: { color: buttonColors.background },
		border: { width: 1, style: 'solid', color: buttonColors.border }
	}
}

export const masterButton = ({ selected }) => ({
	padding: { left: '0.5em', right: '0.5em' },
	text: { color: selected ? colors.lightKeyB : colors.light },
	background: { color: colors.dark }
})
