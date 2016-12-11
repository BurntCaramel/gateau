import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'

const meanOf = (numbers) => (
	R.sum(numbers) / numbers.length
)

const medianOf = (numbers) => {
	const sorted = R.sortBy(R.identity, numbers)
	if (sorted.length % 2 == 1) {
		return sorted[(sorted.length - 1) / 2]
	}
	else {
		const secondIndex = sorted.length / 2 
		return (sorted[secondIndex - 1] + sorted[secondIndex]) / 2
	}
}

const roundBy = (number, precision) => {
	const factor = Math.pow(10, precision)
	return Math.round(number * factor) / factor
}

export const distribution = (tags, references, text, children, Element, resolveContent) => {
	const numbers = R.map(R.pipe(
		resolveContent,
		parseFloat
	), children)
	console.log('numbers', numbers)
	return (
		<Seed column alignItems='center'>
			<div children={ `Mean: ${ roundBy(meanOf(numbers), 3) }` } />
			<div children={ `Median: ${ roundBy(medianOf(numbers), 3) }` } />
		</Seed>
	)
}

export const useWithFallback = (fallback) => R.cond([
	[
		R.anyPass([
			R.has('distribution'),
			R.has('mean'),
			R.has('average')
		]),
		R.curry(distribution)
	],
	[ R.T, fallback ]
])
