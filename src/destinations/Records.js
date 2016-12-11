import R from 'ramda'
import React from 'react'
import JSONComponent from './JSONComponent'

const toRecord = R.converge(
	R.call, [
		R.pipe(
			R.prop('children'),
			R.ifElse(
				R.isEmpty,
				() => withContent,
				(children) => withChildren(children)
			)
		),
		R.prop('text'),
		R.pipe(
			R.prop('tags'),
			//R.filter(R.equals(true)),
			R.keys
		)
	]
) 

const withContent = R.curry((content, tags) => (
	R.ifElse(
		R.isEmpty,
		R.always(content),
		R.pipe(
			R.reverse,
			R.reduce(R.flip(R.objOf), content)
		)
	)(tags)
))

const withChildren = R.curry((children, content, tags) => (
	withContent(
		R.map(toRecord, children),
		tags
	)
))

// TODO: references, arrays with children
const toRecords = R.map(
	R.pipe(
		R.map(toRecord),
		R.ifElse(
			R.propSatisfies(R.gt(R.__, 1), 'length'),
			R.pipe(
				R.map(
					R.when(
						R.is(String),
						R.objOf('content')
					)
				),
				R.mergeAll
			),
			R.head
		)
	)
)

export const Preview = ({ ingredients, contentTree }) => (
	<JSONComponent json={ toRecords(contentTree) } isDeserialized />
)

export const title = 'Records'

export { head } from './Raw'
