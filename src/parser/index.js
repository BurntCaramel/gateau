import R from 'ramda'
import parseInt from 'lodash/parseInt'
const { parseElement } = require('lofi')

const rejectEmptyStrings = require('./rejectEmptyStrings')

const addChildTo = R.curry((element, parent) => (
	R.mergeWith(R.concat, parent, {
		children: [element]
	})
))

const prefixAndBodyRegex = /^([0-9]?[-0-9.]*[-.])?\s*(.*)$/
const orderedPrefixRegex = /^[0-9]/

export const parseInput = R.pipe(
	R.split('\n\n'), // sections
	R.map(R.pipe(
		R.split('\n'), // elements
		rejectEmptyStrings, // must have content
		R.reduce((items, itemInput) => {
			const [ prefix, body ] = R.tail(R.match(prefixAndBodyRegex, itemInput)) // just get captured
			if (body == null) {
				return items
			}

			const element = parseElement(body)

			// Skip #research
			if (element.tags.research) {
				return items
			}

			const isChild = prefix != null
			if (isChild) {
				if (items.length === 0) {
					const ordered = R.test(orderedPrefixRegex, prefix)
					return [
						{
							text: null,
							tags: { list: true, ordered },
							references: [],
							children: [element]
						}
					]
				}
				else {
					return R.adjust(addChildTo(element), -1, items)
				}
			}
			else {
				return R.concat(items, element)
			}
		}, [])
	)),
	R.reject(R.isEmpty)
)