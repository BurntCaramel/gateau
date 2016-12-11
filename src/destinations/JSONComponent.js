import R from 'ramda'
import isObject from 'lodash/isObject'
import isNumber from 'lodash/isNumber'
import isBoolean from 'lodash/isBoolean'
import { createElement } from 'react'

const li = R.partial(createElement, ['li', null])
const dl = R.partial(createElement, ['dl', null])
const dtAttrs = R.partial(createElement, ['dt'])
const ddAttrs = R.partial(createElement, ['dd'])
const ol = R.partial(createElement, ['ol', null])
const code = R.partial(createElement, ['code', null])
const em = R.partial(createElement, ['em', null])
const p = R.partial(createElement, ['p', null])

const renderObjectItem = (key, value) => [
	dtAttrs({ key: `key-${key}` }, key),
	ddAttrs({ key: `value-${key}`}, renderJSON(value))
]

const renderArrayItem = (value) => li(
	renderJSON(value)
)

const renderObject = R.pipe(
	R.toPairs,
	//R.sortBy(R.prop(0)),
	R.map(R.apply(renderObjectItem)),
	R.tap(items => console.log('rendered', items)),
	R.flatten,
	dl
)

const renderArray = R.pipe(
	R.map(renderArrayItem),
	ol
)

const renderNumber = R.pipe(
	code,
	p
)

const renderBoolean = R.pipe(
	(boolean) => boolean ? 'yes' : 'no',
	em,
	p
)

const renderString = p

const renderJSON = R.cond([
	[Array.isArray, renderArray],
	[isObject, renderObject],
	[isNumber, renderNumber],
	[isBoolean, renderBoolean],
	[R.T, renderString]
])

const renderJSONError = (error) => createElement('h2', null, 'JSON is invalid ' + error)

const renderSerializedJSON = R.tryCatch(
	R.pipe(
		JSON.parse,
		renderJSON
	),
	renderJSONError
)

const JSONComponent = R.converge(R.call, [
	R.ifElse(
		R.prop('isDeserialized'),
		R.always(renderJSON),
		R.always(renderSerializedJSON)
	),
	R.prop('json')
])

export default JSONComponent
