import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as assets from './assets'
import * as Vanilla from './Vanilla'
import { renderTreeUsing } from './render'


const buttonTagsToClass = R.converge(
	R.unapply(R.join(' ')), [
		R.always('mui-btn'),
		R.ifElse(R.pathEq(['variation', 'texts'], ['raised']), R.always('mui-btn--raised'), R.always('')),
		R.ifElse(R.pathEq(['variation', 'texts'], ['flat']), R.always('mui-btn--flat'), R.always('')),
		R.cond([
			[ R.has('primary'), R.always('mui-btn--primary') ],
			//[ R.has('secondary'), R.always('mui-btn--flat') ],
			[ R.T, R.always('') ]
		]),
		R.cond([
			[ R.has('large'), R.always('mui-btn--large') ],
			[ R.has('small'), R.always('mui-btn--small') ],
			[ R.has('extrasmall'), R.always('mui-btn--small') ],
			[ R.T, R.always('') ]
		])
	]
)

export const button = (tags, mentions, texts) => (
	<button
		{ ...seeds({ alignSelf: 'center', margin: { bottom: '0.5rem' }, maxWidth: '20em' }) }
		disabled={ R.has('disabled', tags) }
		className={ buttonTagsToClass(tags) }
		children={ texts }
	/>
)

const elementRendererForTags = Vanilla.extendTagConds([
	[ R.has('field'), R.curry(Vanilla.makeField({ wrapperClassName: 'mui-textfield', wrapInDiv: true })) ],
	[ R.has('choice'), R.curry(Vanilla.makeChoice({ wrapperClassName: { select: 'mui-select', checkbox: 'mui-checkbox', radio: 'mui-radio' }, wrapInDiv: true })) ],
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(button) ]
])

export const Preview = renderTreeUsing({ elementRendererForTags })

export const title = 'MuiCSS'

export function head() {
	return [
		<link href="//cdn.muicss.com/mui-0.9.9-rc2/css/mui.min.css" rel="stylesheet" type="text/css" />,
    <script src="//cdn.muicss.com/mui-0.9.9-rc2/js/mui.min.js"></script>
	]
}
