import R from 'ramda'
import React from 'react'

const rejectEmptyStrings = R.filter(R.test(/\S/))

export default function multilinedText(content, Component = 'p', wrapText = R.identity) {
	return R.pipe(
		R.concat([]),
		R.map(R.pipe(
			R.defaultTo(''),
			R.split('\n\n'),
			rejectEmptyStrings,
			R.map((text) => (
				<Component children={ wrapText(text) } />
			))
		))
	)(content)
}
