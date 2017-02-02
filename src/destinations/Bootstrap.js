import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as assets from './assets'
import * as Vanilla from './Vanilla'
import { renderTreeUsing } from './render'

const buttonTagsToClass = R.uncurryN(3, (resolveContent, contentIsTrue) => R.converge(
	R.unapply(R.join(' ')), [
		R.always('btn'),
		R.cond([
			[ contentIsTrue('primary'), R.always('btn-primary') ],
			//[ contentIsTrue('link'), R.always('btn-link') ],
			[ R.T, R.always('btn-default') ]
		]),
		R.cond([
			[ contentIsTrue('large'), R.always('btn-lg') ],
			[ contentIsTrue('small'), R.always('btn-sm') ],
			[ contentIsTrue('extrasmall'), R.always('btn-xs') ],
			[ R.T, R.always('') ]
		])
	]
))

export const button = (tags, mentions, title, children, Element, resolveContent) => {
	const contentIsTrue = R.propSatisfies((value) => resolveContent(value, { single: true }) == true)

	let Component = 'button'
	let url
	if (R.has('link', tags)) {
		Component = 'a'
		url = resolveContent(tags.link)
	}

	let onClick
	if (R.has('toggle', tags)) {
		onClick = () => {
			resolveContent(tags.toggle, { alter: R.not })
		} 
	}

	return (
		<Component
			href={ url }
			{ ...seeds({
				alignSelf: 'center',
				margin: { bottom: '0.5rem' },
				maxWidth: '20em'
			}) }
			className={ buttonTagsToClass(resolveContent, contentIsTrue, tags) }
			children={ title }
			onClick={ onClick }
		/>
	)
}
export const cta = button

const panelTagsToClass = R.uncurryN(3, (resolveContent, contentIsTrue) => R.converge(
	R.unapply(R.join(' ')), [
		R.always('panel'),
		R.cond([
			[ contentIsTrue('primary'), R.always('panel-primary') ],
			[ contentIsTrue('success'), R.always('panel-success') ],
			[ contentIsTrue('info'), R.always('panel-info') ],
			[ contentIsTrue('warning'), R.always('panel-warning') ],
			[ contentIsTrue('danger'), R.always('panel-danger') ],
			[ R.T, R.always('panel-default') ]
		])
	]
))

export const panel = (tags, mentions, text, children, Element, resolveContent) => {
	const contentIsTrue = R.propSatisfies((value) => resolveContent(value, true) == true)

	return (
		<Seed Component='div'
			className={ panelTagsToClass(resolveContent, contentIsTrue, tags) }
			alignSelf='center'
			margin={{ bottom: '0.5rem' }}
			maxWidth='20em'
		>
			<div className='panel-heading'>
				<h2 className='panel-title' children={ text } />
			</div>
			<div className='panel-body'>
			{
				children.map((element, index) => (
					<Element { ...element } key={ index } />
				))
			}
			</div>
		</Seed>
	)
}

const elementRendererForTags = Vanilla.extendTagConds([
	[ R.has('card'), R.curry(panel) ],
	[ R.has('panel'), R.curry(panel) ],
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(cta) ]
])

export const Preview = renderTreeUsing({ elementRendererForTags })

export const title = 'Bootstrap 3'

export function head() {
	return [
		<link key='css'
			rel='stylesheet' type='text/css'
			href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
		/>,
		<script key='js'
			src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
		/>
	]
}
