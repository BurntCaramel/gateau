import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as assets from './assets'
import * as Vanilla from './Vanilla'
import { renderTreeUsing } from './render'


const buttonTagsToClass = R.converge(
	R.unapply(R.join(' ')), [
		R.always('button'),
		R.cond([
			[ R.has('secondary'), R.always('secondary') ],
			[ R.has('disabled'), R.always('disabled') ],
			[ R.T, R.always('') ]
		]),
		R.cond([
			[ R.has('large'), R.always('large') ],
			[ R.has('small'), R.always('small') ],
			[ R.has('extrasmall'), R.always('tiny') ],
			[ R.T, R.always('') ]
		])
	]
)

export const button = (tags, mentions, texts) => (
	<Seed Component='button'
		className={ buttonTagsToClass(tags) }
		alignSelf='center'
		margin={{ bottom: '0.5rem' }}
		maxWidth='20em'
		children={ texts }
	/>
)

const elementRendererForTags = Vanilla.extendTagConds([
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(button) ]
])

export const Preview = renderTreeUsing({ elementRendererForTags })

export const title = 'Foundation'

export function head() {
	return [
		<link rel='stylesheet' type='text/css'
			href='https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation-flex.min.css'
		/>,
		<script
			src='https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation.min.js'
		/>
	]
}
