import R from 'ramda'
import { extendObservable, observable, action, toJS } from 'mobx'

import { parseInput } from '../parser'
import validateContent, { transformerForType, stringRepresenterForType } from '../ingredients/validateContent'

const suggestReferenceFromTree = R.uncurryN(2, (ingredients) => R.pipe(
	R.chain(R.pluck('references')),
	R.unnest,
	R.map(R.head), // Just the requested ingredient ID
	R.difference(R.__, R.pluck('id', ingredients)), // Only IDs that are yet to be used
	R.head // First pick
))

function createObservableIngredientVariation(ingredient, {
	enabled = true,
	rawContent
}) {
	return observable({
		enabled,
		rawContent,
		get result() {
			const transform = transformerForType(ingredient.type)
			return R.tryCatch(
				transform,
				R.objOf('error')
			)(this.rawContent)
		},
		toggleEnabled: action(function() {
			this.enabled = !this.enabled
		}),
		adjustRawContent: action(function(adjuster) {
			this.rawContent = adjuster(this.rawContent)
		}),
		adjustContent: action(function(adjuster) {
			const result = this.result
			if (result.content) {
				adjuster(result.content)
				this.rawContent = stringRepresenterForType(ingredient.type, result.content)
			}
		}),
		editPath: action(function(path, editor) {
			this.adjustContent((content) => {
				const [
					parent,
					key
				] = (path.length == 1) ? [
					content,
					path[0]
				] : [
					R.path(initialPath, content),
					R.last(path)
				]
				
				if (parent) {
					editor(parent, key)
				}
				else {
					// Warn user about incorrect key path?
				}
			})
		}),
		adjustPath: action(function(path, adjuster) {
			this.editPath(path, (parent, key) => {
				parent[key] = adjuster(parent[key]) 
			})
		})
	})
}

function createObservableIngredient(target) {
	return extendObservable(observable(target), {
		variations: target.variations.map(
			R.curry(createObservableIngredientVariation)(target)
		),
		addVariation: action(function(variation) { 
			target.variations.push(
				createObservableIngredientVariation(target, variation)
			)
		}),
		addNewVariation: action(function(variation) {
			target.addVariation({
				rawContent: ''
			})
		}),
		get flattenedResult() {
			let flattened = {
				type: target.type,
				variationReference: R.last(target.variations)
			}

			if (target.type == 'json') {
				flattened.content = target.variations.reduce((combined, { enabled, result }) => {
					if (!enabled || result.content == null) {
						return combined
					}

					return Object.assign(combined, result.content)
				}, {})
			}
			else {
				const variation = R.findLast(R.propEq('enabled', true), target.variations)
				if (variation) {
					flattened.content = variation.result.content
				}
			}

			return flattened
		}
	})
}

export default function createObservableStateManager({
	content = '',
	destinationID = 'foundation',
	destinationDevice = 'phone',
	ingredients = [],
	scenarios = [{}],
	activeScenarioIndex = 0
} = {}) {
	return extendObservable({}, {
		content,
		destinationID,
		destinationDevice,
		ingredients: ingredients.map(createObservableIngredient),
		scenarios,
		activeScenarioIndex,

		get json() {
			return {
				body: this.content,
				ingredients: toJS(this.ingredients)
			}
		},

		set json({ body = '', ingredients = [] }) {
			this.content = body
			this.ingredients = ingredients.map(createObservableIngredient)
		},

		get contentTree() {
			return parseInput(this.content)
		},
		get activeScenario() {
			return this.scenarios[this.activeScenarioIndex]
		},
		get activeIngredients() {
			const activeScenario = this.activeScenario
			return this.ingredients.reduce((object, { id, flattenedResult }) => {
				object[id] = flattenedResult
				return object
			}, {})
		},
		activeVariationForIngredientAtIndex(index) {
			const ingredient = this.ingredients[index]
			if (ingredient && ingredient.variations.length > 0) {
				const activeScenario = this.activeScenario
				return ingredient.variations[R.propOr(0, ingredient.id, activeScenario)]
			}
		},
		addNewIngredient: action.bound(function() {
			this.ingredients.push(createObservableIngredient({
				id: R.defaultTo(
					'untitled',
					suggestReferenceFromTree(this.ingredients, this.contentTree)
				),
				type: 'text',
				variations: [
					{
						rawContent: ''
					}
				]
			}))
		}),
		onRemoveIngredientAtIndex: action.bound(function(index) {
			this.ingredients.splice(index, 1)
		})
	})
}
