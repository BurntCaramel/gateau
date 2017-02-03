import R from 'ramda'
import { observable, action, toJS } from 'mobx'

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
	return observable({
		id: target.id,
		type: target.type,
		variations: target.variations.map(
			R.curry(createObservableIngredientVariation)(target)
		),
		addVariation: action.bound(function(variation) { 
			this.variations.push(
				createObservableIngredientVariation(this, variation)
			)
		}),
		addNewVariation: action.bound(function(variation) {
			this.addVariation({
				rawContent: ''
			})
		}),
		get flattenedResult() {
			let flattened = {
				type: this.type,
				variationReference: R.last(this.variations)
			}

			if (this.type == 'json') {
				flattened.content = this.variations.reduce((combined, variation) => {
					// Use only if enabled
					if (!variation.enabled) {
						return combined
					}
					// Skip if no content
					const result = variation.result
					if (result.content == null) {
						return combined
					}
					// Merge into combined JSON object
					return Object.assign(combined, result.content)
				}, {})
			}
			else {
				const variation = R.findLast(R.propEq('enabled', true), this.variations)
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
	return observable({
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
