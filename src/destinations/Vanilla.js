import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'
import repeatString from 'lodash/repeat'

import { renderTreeUsing } from './render'
import multilinedText from './multilinedText'
import divider from './divider'
import JSONComponent from './JSONComponent'
import CollectedImage from './components/CollectedImage'
import UnsplashImage from './components/UnsplashImage'

const whenPresent = R.unless(R.isNil)

import * as Message from './Message'
import * as Swatch from './Swatch'
import * as Distribution from './Distribution'
import * as LayoutCalculator from './LayoutCalculator'

export const isPassword = (tags, mentions, title) => (
	R.has('password', tags) || R.test(/\bpassword\b/i, title)
)

export const field = (tags, mentions, title, children, Element, resolveContent) => {
	let value = ''
	let onChange
	if (R.has('value', tags)) {
		value = resolveContent(tags.value)
		/*value = R.unless(
			R.is(String),
			R.always(null),
			resolveContent(tags.value)
		)*/
		onChange = (event) => {
			const newValue = event.target.value
			resolveContent(tags.value, { alter: R.always(newValue) })
		} 
	}

	return (
		<Seed Component='label' column
			alignSelf='center'
		>
			<span key='label' children={ title } style={{ display: 'block' }} />
			<input key='input'
				type={ isPassword(tags, title) ? 'password' : 'text' }
				value={ value }
				onChange={ onChange }
			/>
		</Seed>
	)
}

export const button = (tags, mentions, title) => (
	<Seed Component='button'
		shrink={ 0 } alignSelf='center'
		margin={{ base: 'auto', bottom: '0.5rem' }}
		maxWidth='20em'
		children={ title }
	/>
)
export const cta = button

export const choice = (tags, mentions, title, children, Element, resolveContent) => (
	<Seed Component='label' column>
		<span children={ title } style={{ display: 'block' }} /> 
		<Seed Component='select'
			value={ tags.value }
			//onChange={ this.onChange }
			shrink={ 0 }
			maxWidth='20em'
			//padding={{ top: 0, bottom: 0, left: '0.5em', right: '0.5em' }}
			font={{ size: 16 }}
		>
		{
			children.map(({ text, tags }) => (
				<option key={ text }
					value={ text } children={ tags.title || text }
				/>
			))
		}
		</Seed>
	</Seed>
)

const wrapForTags = (tags, resolveContent, element) => {
	if (R.has('link', tags)) {
		const url = resolveContent(tags.link)
		return (
			<a href={ url } rel='nofollow' children={ element } />
		)
	}
	else {
		return element
	}
}

const wrapInInline = R.curry((tags, element) => {
	if (R.has('small', tags)) {
		element =  (
			<small children={ element } />
		)
	}

	return element
})

export const text = (tags, references, content, children, Element, resolveContent) => {
	const [Component, fontSize, textAlign] = (
		R.has('primary', tags) ? (
			['h1', '2em', 'center']
		) : R.has('secondary', tags) ? (
			['h2', '1.5em', 'center']
		) : R.has('tertiary', tags) ? (
			['h3', '1.25em', 'left']
		) : R.has('quote', tags) ? (
			['blockquote', '1em', 'left']
		) : (
			['p', '1em', 'left']
		)
	)

	return wrapForTags(
		tags,
		resolveContent,
		(
			<Seed
				maxWidth='40rem'
				alignSelf='center'
				margin='auto'
				text={{ align: textAlign }}
				font={{ size: fontSize }}
				children={
					multilinedText(
						resolveContent({ references, text: content }),
						Component,
						wrapInInline(tags)
					)
				}
			/>
		)
	)
}

const imageHeight = 150
const imageBackground = { color: rgba.whiteValue(0, 0.1) }

const placeholderImageContent = (tags, text, resolveContent) => (
	<Seed column justifyContent='center'
			minHeight={ imageHeight }
			font={{ style: 'italic' }}
			background={ imageBackground }
			children={ text }
		/>
) 

const richImageContent = (tags, text, resolveContent) => {
	if (R.has('unsplash', tags)) {
		return (
			<UnsplashImage
				category={ resolveContent(tags['unsplash']) }
				text={ text }
			/>
		)
	}
	else if (R.has('collected', tags)) {
		return (
			<CollectedImage
				sha256={ resolveContent(tags['collected']) }
				width={ whenPresent(resolveContent, tags['width']) }
				height={ whenPresent(resolveContent, tags['height']) }
				text={ text }
			/>
		)
	}
	else {
		return placeholderImageContent(tags, text, resolveContent)
	}
}

export const imageMaker = (imageContent) => (tags, mentions, text, children, Element, resolveContent) => {
	return (
		<Seed Component='figure' column
			grow={ 1 } width='100%'
			text={{ align: 'center' }}
			children={(
				wrapForTags(tags, resolveContent,
					R.has('nocaption', tags) ? (
						imageContent(tags, text, resolveContent)
					) : ([
						imageContent(tags, null, resolveContent),
						<Seed key='caption' Component='figcaption'
							text={{ lineHeight: '1.3' }}
							font={{ style: 'italic' }}
							children={ text }
						/>
					])
				)
			)}
		/>
	)
}

export const image = imageMaker(richImageContent)
export const placeholderImage = imageMaker(placeholderImageContent)

export const video = (tags, mentions, content) => (
	<Seed Component='figure' column
		grow={ 1 } alignItems='center' justifyContent='center'
		width='100%' height={ 0 }
		padding={{ top: `${9 / 16 / 2 * 100}%`, bottom: `${9 / 16 / 2 * 100}%` }}
		background={{ color: rgba.whiteValue(0, 0.1) }}
		children='▶'
	/>
)

export const code = (tags, references, text, children, Element, resolveContent) => (
	<Seed Component='pre'
		maxWidth='100%'
		overflow='scroll'
	>
		<Seed Component='code'
			children={ resolveContent({ references, text }) }
		/>
	</Seed>
)

const isHiddenForTags = R.propSatisfies(Boolean, 'hidden')

export const hidden = (tags, mentions, content) => (
	<noscript />
)

export const list = (tags, mentions, content, children, Element, resolveContent) => {
	const Component = R.propEq('ordered', true, tags) ? 'ol' : 'ul'
	return (
		<Seed>
			{ text(tags, mentions, content || '', children, Element, resolveContent) }
			<Seed Component={ Component }
				
			>
			{
				children.map((element, index) => (
					<li key={ index }>
						<Element { ...element } />
					</li>
				))
			}
			</Seed>
		</Seed>
	)
}

const columnsComponentForTags = R.cond([
	[ R.has('nav'), R.always('nav') ],
	[ R.has('figure'), R.always('figure') ],
	[ R.T, R.always('div') ]
])

export const columns = (tags, mentions, content, children, Element, resolveContent) => {
	const columnWidth = R.ifElse(
		R.gt(R.__, 0), // Greater than 0
		(number) => `${ 100.0 / number }%`,
		R.always(null)
	)(parseInt(resolveContent(tags.columns), 10))

	const renderColumn = (props) => (
		<div style={{ flexBasis: columnWidth }}>
		{ Element(props) }
		</div>
	)

	return (
		<Seed Component={ columnsComponentForTags(tags) }
			row wrap reverse={ R.has('reverse', tags) } justifyContent='center'
			width='100%'
		>
		{ // Render content, interleaving an optional divider
			R.pipe(
				R.converge(R.concat, [
					R.pipe(
						R.init,
						R.map(renderColumn),
						/*R.chain(R.pipe(
							renderColumn,
							R.of,
							R.append(divider(
								R.defaultTo(8, R.unless(
									R.isNil,
									resolveContent,
									tags['divider']
								))
							))
						))*/
					),
					R.pipe(
						R.last,
						R.ifElse(
							R.isNil,
							R.always([]),
							renderColumn
						)
					)
				])
			)(children)
		}
		</Seed>
	)
}

export const nav = columns

export const record = (tags, mentions, text, children, Element, resolveContent) => {
	if (mentions.length > 0) {
		return (
			<JSONComponent isDeserialized={ true } json={ mentions[0] } />
		)
	}
	else {
		return (
			<JSONComponent isDeserialized={ true } json={ text } />
		)
	}
}

// import Frame from 'react-frame-component'

// export const gist = (tags, references, text, children, Element, resolveContent) => (
// 	<Frame head={ <script src={ resolveContent({ references, text }) + '.js' } /> } />
// )

export const extendTagConds = (conds) => R.pipe(
	Message.useWithFallback,
	Swatch.useWithFallback,
	Distribution.useWithFallback,
	LayoutCalculator.useWithFallback,
)(R.cond([
	[ isHiddenForTags, R.curry(hidden) ],
	...conds,
	[ R.has('field'), R.curry(field) ],
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(cta) ],
	[ R.has('choice'), R.curry(choice) ],
	[ R.has('image'), R.curry(image) ],
	[ R.has('video'), R.curry(video) ],
	[ R.has('code'), R.curry(code) ],
	[ R.has('columns'), R.curry(columns) ],
	[ R.has('nav'), R.curry(nav) ],
	[ R.has('record'), R.curry(record) ],
	//[ R.has('gist'), R.curry(gist) ],
	[ R.T, R.curry(list) ]
]))

const elementRendererForTags = extendTagConds([])

export const Preview = renderTreeUsing({
	elementRendererForTags
})

export function init() {
}

export const title = 'Vanilla Web'

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
`} />
		</head>
	)
}

export function deinit() {
}
