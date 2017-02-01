import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'
import * as Piping from 'royal-piping/lib/kits/ios'

import * as Vanilla from './Vanilla'
import * as Message from './Message'
import { renderTreeUsing } from './render'

const tone1 = rgba.whiteValue(200, 1.0)
const tone2 = rgba.whiteValue(140, 1.0)

const button = (tags, mentions, text) => (
	<Seed children={ text }
		alignSelf='center'
		padding={{ top: 6, bottom: 6, left: 8, right: 8 }}
		margin={{ bottom: '0.5em' }}
		font={{ size: R.has('large', tags) ? 20 : R.has('small', tags) ? 12 : 16 }}
		background={{ color: tone1 }}
		cornerRadius={ 2 }
	/>
)

const field = (tags, mentions, text, children, Element, resolveContent) => (
	<Seed column
		grow={ 1 } alignSelf='center' minWidth='12em'
		margin={{ bottom: '1em' }}
	>
		<Seed children={ text } />
		<Seed
			grow={ 1 }
			minHeight={ `1.4em` }
			padding='0.25em'
			border={{ width: 1, style: 'solid', color: tone2 }}
			children={ resolveContent(tags.value) }
		/>
	</Seed>
)

const textStyler = ({ link, small = false }) => seeds({
	text: { decoration: R.isNil(link) ? 'none' : 'underline' },
	font: { size: small ? 12 : null }
})

const text = (tags, references, text, children, Element, resolveContent) => {
	const [Component, fontSize, textAlign] = (
		R.has('primary', tags) ? (
			['h1', '2em', 'center']
		) : R.has('secondary', tags) ? (
			['h2', '1.5em', 'center']
		) : R.has('tertiary', tags) ? (
			['h3', '1.25em', 'center']
		) : (
			['p', '1em', 'left']
		)
	)

	return (
		<Seed Component={ Component }
			maxWidth='30rem'
			alignSelf='center'
			text={{ align: textAlign }}
			font={{ size: fontSize }}
			children={ resolveContent({ references, text }) }
			{ ...textStyler(tags) }
		/>
	)
}

const elementRendererForTags = Message.useWithFallback(R.cond([
	[ R.has('button'), R.curry(button) ],
	// [ R.has('cta'), R.curry(Vanilla.cta) ],
	[ R.has('choice'), R.curry(button) ],
	[ R.has('field'), R.curry(field) ],
	[ R.has('image'), R.curry(Vanilla.placeholderImage) ],
	[ R.has('video'), R.curry(Vanilla.video) ],
	[ R.has('text'), R.curry(text) ],
	// [ R.has('swatch'), R.curry(Vanilla.swatch) ],
	// [ R.has('nav'), R.curry(Vanilla.nav) ],
	// [ R.has('columns'), R.curry(Vanilla.columns) ],
	// [ R.has('list'), R.curry(Vanilla.list) ],
	[ R.T, R.curry(text) ]
]))

export const Preview = R.pipe(
	renderTreeUsing({
		elementRendererForTags
	})
)

export const title = 'Piping Wireframes'

export function head() {
	return (
		<head>
			<style children={`
html {
	height: 100%;
	background-color: #fdfdfd;
}
html, h1, input, button {
	font-family: 'Lato', sans-serif;
}
body {
	height: 100%;
	margin: 0;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
`} />
		</head>
	)
}
