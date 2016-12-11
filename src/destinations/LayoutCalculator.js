import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

const Error = (message) => (
	<Seed text={{ color: 'red' }}>
	{ message }
	</Seed>
)

export const whatsize = (tags, references, text, children, Element, resolveContent) => {
	if (R.isNil(tags.within)) {
		return Error('Add tag #within')
	}
	else if (R.isNil(tags.count)) {
		return Error('Add tag #count')
	}

	const within = parseFloat(resolveContent(tags.within))
	const count = parseFloat(resolveContent(tags.count))

	return (
		<Seed>
			Within { within } · Count { count } · Individual size = { within / count }
		</Seed>
	)
}

export const howmany = (tags, references, text, children, Element, resolveContent) => {
	if (R.isNil(tags.within)) {
		return Error('Add tag #within')
	}
	else if (R.isNil(tags.size)) {
		return Error('Add tag #size')
	}

	const within = parseFloat(resolveContent(tags.within))
	const size = parseFloat(resolveContent(tags.size))
	const count = within / size
	const remainder = within % size

	return (
		<Seed>
			<Seed row>
				<Seed basis={ Math.floor(count) * size } background={{ color: '#e41' }} height='1rem' />
				<Seed basis={ remainder } background={{ color: '#ed1' }} />
			</Seed>
			Within { within } · Size { size } · Count = { count } · Remainder = { remainder }
		</Seed>
	)
}

export const useWithFallback = (fallback) => R.cond([
	[ R.has('whatsize'), R.curry(whatsize) ],
	[ R.has('howmany'), R.curry(howmany) ],
	[ R.T, fallback ]
])
