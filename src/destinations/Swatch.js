import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'

const hexColorRegex = /^[a-fA-F0-9]{3,6}$/
const defaultSwatchSize = 32

const parseColorValue = (alpha = 1) => R.ifElse(
	R.test(hexColorRegex),
	(value) => `#${value}`,
	R.pipe(
		R.split(/[,]?\s+/),
		R.cond([
			[
				R.propEq('length', 1),
				R.pipe(
					R.head,
					R.repeat(R.__, 3),
					R.append(alpha)
				)
			],
			[
				R.propEq('length', 3),
				R.append(alpha)
			],
			[
				R.T,
				R.identity
			]
		]),
		R.join(','),
		(value) => `rgba(${value})`,
	)
)

const parseAlpha = R.pipe(
	parseFloat,
	R.when(isNaN, () => {})
)

export const srgbItem = (value, alpha, minWidth, minHeight) => (
	<Seed
		minWidth={
			minWidth
		}
		minHeight={
			minHeight
		}
		background={{
			color: parseColorValue(alpha)(value)
		}}
	/>
)

export const swatch = (tags, references, text, children, Element, resolveContent, { elementFromText }) => {
	const alpha = parseAlpha(resolveContent(tags.alpha))
	const minWidth = R.cond([
		[ R.has('width'), R.pipe(R.prop('width'), resolveContent) ],
		[ R.has('size'), R.pipe(R.prop('size'), resolveContent) ],
		[ R.T, R.always(defaultSwatchSize) ]
	])(tags)
	const minHeight = R.cond([
		[ R.has('height'), R.pipe(R.prop('height'), resolveContent) ],
		[ R.has('size'), R.pipe(R.prop('size'), resolveContent) ],
		[ R.T, R.always(defaultSwatchSize) ]
	])(tags)

	const content = resolveContent({ references, text})
	console.log('#swatch content', content)
	if (Array.isArray(content)) {
		children = content.map(elementFromText)
	}

	if (children.length > 0) {
		return (
			<Seed row wrap alignItems='center'>
			{
				Element.renderArray({ defaultTags: tags }, children)
			}
			</Seed>
		)
	}
	else if (R.is(String, content)) {
		return srgbItem(content, alpha, minWidth, minHeight)
	}
	else {
		return <noscript />
	}
}

export const useWithFallback = (fallback) => R.cond([
	[ R.has('swatch'), R.curry(swatch) ],
	[ R.T, fallback ]
])
