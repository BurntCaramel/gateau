import R from 'ramda'

const transformRawContentCatching = (transform) => R.converge(R.merge, [
	R.identity,
	R.tryCatch(
		R.pipe(
			R.prop('rawContent'),
			transform,
			R.merge({ error: null })
		),
		R.objOf('error')
	)
])

export const transformerForType = R.curry(function transformerForType(type, content) {
	if (type == 'json') {
		return {
			content: JSON.parse(content)
		}
	}
	else {
		return { content }
	}
})

export const stringRepresenterForType = R.curry(function stringRepresenterForType(type, content) {
	if (type == 'json') {
		return JSON.stringify(content, null, 2)
	}
	else {
		return content
	}
})

export default R.converge(R.call, [
	R.unary(R.merge),
	R.cond([
		[
			R.propEq('type', 'json'),
			R.evolve({
				variations: R.map(
					transformRawContentCatching(R.pipe(
						JSON.parse,
						R.objOf('content')
						/*R.converge(R.merge, [
							R.objOf('content'),
							R.pipe(
								R.curry(JSON.stringify)(R.__, null, 2),
								R.objOf('rawContent'),
							)
						])*/
					))
				)
			})
		],
		[
			R.T,
			R.evolve({
				variations: R.map(
					transformRawContentCatching(R.pipe(
						R.identity,
						R.objOf('content')
					))
				)
			})
		]
	])
])
