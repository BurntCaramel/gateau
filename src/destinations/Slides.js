import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import { Spectacle, Deck, Slide, Text } from 'spectacle'

import * as Vanilla from './Vanilla'
import { renderTreeUsing } from './render'

const text = (tag, mentions, text) => (
	<Text children={ text } />
)

const elementRendererForTags = R.cond([
	// [ R.has('field'), R.curry(Vanilla.field) ],
	// [ R.has('button'), R.curry(Vanilla.button) ],
	// [ R.has('cta'), R.curry(Vanilla.cta) ],
	// [ R.has('image'), R.curry(Vanilla.image) ],
	// [ R.has('video'), R.curry(Vanilla.video) ],
	[ R.has('text'), R.curry(text) ],
	// [ R.has('swatch'), R.curry(Vanilla.swatch) ],
	// [ R.has('nav'), R.curry(Vanilla.nav) ],
	// [ R.has('columns'), R.curry(Vanilla.columns) ],
	// [ R.has('list'), R.curry(Vanilla.list) ],
	[ R.T, R.curry(text) ]
])

const Section = React.createClass({
	getDefaultProps() {
		return {
			transition: [ 'zoom' ]
		}
	},

	render() {
		return (
			<Slide { ...this.props } />
		)
	}
})

const Master = ({ children }) => (
	<Spectacle>
		<Deck children={ children } transition={[ 'zoom' ]} />
	</Spectacle>
)

export const Preview = R.pipe(
	renderTreeUsing({
		elementRendererForTags,
		Section: Slide,
		Master: Master
	})
)

export const title = 'Slides'

export function head() {
	return (
		<head>
		</head>
	)
}
