import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
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

export const isPassword = (tags, texts) => (
	R.has('password', tags) || R.any(R.test(/\bpassword\b/i), texts)
)

const Label = ({ label, wrapperClassName, wrapInDiv = true, children }) => (
	wrapInDiv ? (
		<div
				className={ wrapperClassName }
			>
			<label key='label' children={ label } style={{ display: 'block' }} />
			{ children }
		</div>
	) : (
		<label
			{ ...seeds({ column: true, alignSelf: 'center' }) }
			className={ wrapperClassName }
		>
			<span key='label' children={ label } style={{ display: 'block' }} />
			{ children }
		</label>
	)
)

export const makeField = ({ wrapInDiv = true, wrapperClassName, inputClassName }) => (tags, mentions, texts, children, Element, resolveContent) => {
	let value = null
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
		<Label
			label={ texts }
			wrapInDiv={ wrapInDiv }
			wrapperClassName={ wrapperClassName }
		>
			<input key='input'
				type={ isPassword(tags, texts) ? 'password' : 'text' }
				value={ value }
				className={ inputClassName }
				onChange={ onChange }
			/>
		</Label>
	)
}

export const field = makeField({})

export const button = (tags, mentions, texts) => (
	<Seed Component='button'
		shrink={ 0 } alignSelf='center'
		margin={{ base: 'auto', bottom: '0.5rem' }}
		//maxWidth='20em'
		children={ texts }
	/>
)
export const cta = button

function ChoiceSelect({ value, texts, items, disabled = false, wrapInDiv, wrapperClassName }) {
	return (
		<Label
			label={ texts }
			wrapInDiv={ wrapInDiv }
			wrapperClassName={ wrapperClassName }
		>
			<select
				value={ value }
				disabled={ disabled }
				style={{ fontSize: 16 }}
			>
			{
				items.map(({ texts, tags }) => (
					<option key={ texts }
						value={ texts[0] } children={ tags.texts || texts }
					/>
				))
			}
			</select>
		</Label>
	)
}

function ChoiceCheckbox({ value, texts, disabled = false, wrapInDiv, wrapperClassName }) {
	const label = (
		<label { ...seeds({ text: { align: 'center' } }) }>
			<input type='checkbox' value={ value } disabled={ disabled } />
			<span children={ texts } />
		</label>
	)

	return (
		wrapInDiv ? (
			<div className={ wrapperClassName }>{ label }</div>
		) : (
			label
		)
	)
}

export const makeChoice = ({ wrapInDiv = true, wrapperClassName }) => (tags, mentions, texts, children, Element, resolveContent) => {
	const hasChildren = children.length > 0
	if (hasChildren) {
		return <ChoiceSelect
			value={ tags.value }
			texts={ texts }
			items={ children }
			disabled={ R.has('disabled', tags) }
			wrapperClassName={ !!wrapperClassName ? wrapperClassName.select : null }
			wrapInDiv={ wrapInDiv }
		/>
	}
	else {
		return <ChoiceCheckbox
			value={ tags.value }
			texts={ texts }
			disabled={ R.has('disabled', tags) }
			wrapperClassName={ !!wrapperClassName ? wrapperClassName.checkbox : null }
			wrapInDiv={ wrapInDiv }
		/>
	}
}

export const choice = makeChoice({})

const wrapForTags = (tags, resolveContent, element) => {
	if (R.has('link', tags)) {
		const url = resolveContent(tags.link)
		console.log('#link', url, tags.link)
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

export const text = (tags, mentions, texts, children, Element, resolveContent) => {
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
						resolveContent({ mentions, texts }),
						Component,
						wrapInInline(tags)
					)
				}
			/>
		)
	)
}

// Images

const imageHeight = 150
const imageBackground = { color: rgba.whiteValue(0, 0.1) }

const placeholderImageContent = (tags, texts, resolveContent) => (
	<Seed column justifyContent='center'
			minHeight={ imageHeight }
			font={{ style: 'italic' }}
			background={ imageBackground }
			children={ texts }
		/>
) 

const richImageContent = (tags, texts, resolveContent) => {
	if (R.has('unsplash', tags)) {
		let category = resolveContent(tags['unsplash'])
		category = category.length > 0 ? category[0] : null
		return (
			<UnsplashImage
				category={ category }
				texts={ texts }
			/>
		)
	}
	else if (R.has('collected', tags)) {
		return (
			<CollectedImage
				sha256={ resolveContent(tags['collected']) }
				width={ whenPresent(resolveContent, tags['width']) }
				height={ whenPresent(resolveContent, tags['height']) }
				texts={ texts }
			/>
		)
	}
	else {
		return placeholderImageContent(tags, texts, resolveContent)
	}
}

export const imageMaker = (imageContent) => (tags, mentions, texts, children, Element, resolveContent) => {
	return (
		<Seed Component='figure' column
			grow={ 1 } width='100%'
			margin={ 0 }
			text={{ align: 'center' }}
			children={(
				wrapForTags(tags, resolveContent,
					R.has('nocaption', tags) ? (
						imageContent(tags, texts, resolveContent)
					) : ([
						imageContent(tags, null, resolveContent),
						<Seed key='caption' Component='figcaption'
							text={{ lineHeight: '1.3' }}
							font={{ style: 'italic' }}
							children={ texts }
						/>
					])
				)
			)}
		/>
	)
}

export const image = imageMaker(richImageContent)
export const placeholderImage = imageMaker(placeholderImageContent)

export const video = (tags, mentions, texts) => (
	<Seed Component='figure' column
		grow={ 1 } alignItems='center' justifyContent='center'
		width='100%' height={ 0 }
		padding={{ top: `${9 / 16 / 2 * 100}%`, bottom: `${9 / 16 / 2 * 100}%` }}
		background={{ color: rgba.whiteValue(0, 0.1) }}
		children='▶'
	/>
)

export const code = (tags, mentions, texts, children, Element, resolveContent) => (
	<Seed Component='pre'
		maxWidth='100%'
		overflow='scroll'
	>
		<Seed Component='code'
			children={ resolveContent({ mentions, texts }) }
		/>
	</Seed>
)

const isHiddenForTags = R.propSatisfies(Boolean, 'hidden')

export const hidden = (tags, mentions, texts) => (
	<noscript />
)

export const list = (tags, mentions, texts, children, Element, resolveContent) => {
	const Component = R.propEq('ordered', true, tags) ? 'ol' : 'ul'
	return (
		<Seed>
			{ text(tags, mentions, texts || [], children, Element, resolveContent) }
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

const widthForColumns = R.pipe(
	(input) => parseInt(input, 10),
	R.ifElse(
		R.gt(R.__, 0), // Greater than 0
		(number) => `${ 100.0 / number }%`,
		R.always(null)
	)
)

export const columns = (tags, mentions, texts, children, Element, resolveContent) => {
	const columnWidth = widthForColumns(
		R.when(
			R.equals(true),
			R.always(children.length)
		)(resolveContent(tags.columns))
	)

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

export const record = (tags, mentions, texts, children, Element, resolveContent) => {
	if (mentions.length > 0) {
		return (
			<JSONComponent isDeserialized={ true } json={ mentions[0] } />
		)
	}
	else {
		return (
			<JSONComponent isDeserialized={ true } json={ texts } />
		)
	}
}

// import Frame from 'react-frame-component'

// export const gist = (tags, mentions, texts, children, Element, resolveContent) => (
// 	<Frame head={ <script src={ resolveContent({ mentions, texts }) + '.js' } /> } />
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
	return [
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
	]
}

export function deinit() {
}
