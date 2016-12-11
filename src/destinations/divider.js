import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'

const wrap = (propName, otherProps) => (value) => (
	<Seed { ...otherProps } { ...{ [propName]: value } } />
)

export default R.cond([
	[
		R.complement(R.pipe(Number, isNaN)), // Is valid number
		R.pipe(Number, wrap('basis', { shrink: 0 }))
	],
	[
		R.is(String),
		wrap('children')
	],
	[
		R.T,
		R.identity
	]
])
