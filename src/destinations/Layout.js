import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import divider from './divider'

const tiles = (tags, mentions, content, children, renderElement, resolveContent) => (
	<Seed
		row wrap reverse={ R.has('reverse', tags) } justifyContent='center'
		width='100%'
	>
	{ // Render content, interleaving an optional divider
		R.pipe(
			R.converge(R.concat, [
				R.pipe(
					R.init,
					R.chain(R.pipe(
						renderElement,
						R.of,
						R.append(divider(
							R.defaultTo(8, R.unless(
								R.isNil,
								resolveContent,
								tags['divider']
							))
						))
					))
				),
				R.pipe(
					R.last,
					R.ifElse(
						R.isNil,
						R.always([]),
						renderElement
					)
				)
			])
		)(children)
	}
	</Seed>
)

export const useWithFallback = (fallback) => R.cond([
	[ R.has('tiles'), R.curry(tiles) ],
	[ R.T, fallback ]
])
