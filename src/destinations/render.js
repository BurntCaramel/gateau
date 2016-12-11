import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'

const resolveContentIn = R.curry(function resolveItemIn(source, path) {
	path = R.insertAll(1, ['content'], path)
	return R.path(path, source)
})

const variationForItemIn = R.curry(function adjustItemIn(source, path) {
	const id = R.head(path)
	return R.path([id, 'variationReference'], source)
})

const resolveContentUsing = (ingredients) => {
	const resolveIngredientReference = resolveContentIn(ingredients)
	const variationForPath = variationForItemIn(ingredients)
	return (value, { single = true, set, alter } = {}) => {
		if (R.isNil(value)) {
			return
		}
		else if (value.references != null && value.references.length > 0) {
			if (set) {
				R.forEach(
					(item) => item.set(set),
					result
				)
			}
			else if (alter) {
				const path = value.references[0]
				const variation = variationForPath(path)
				console.log('altering variation', variation)
				const innerPath = R.tail(path)
				variation.adjustPath(innerPath, alter)
			}
			else {
				const resolved = R.map(resolveIngredientReference, value.references)
				if (resolved == null) {
					return
				}
				return single ? resolved[0] : resolved
			}
		}
		else if (value.text != null) {
			return value.text
		}
		else {
			return value
		}
	}
}

function elementFromText(text) {
	return {
		text,
		references: [],
		tags: {},
		children: []
	}
}

export const renderElement = ({ ingredients, elementRendererForTags }) => {
	const resolveContent = resolveContentUsing(ingredients)

	const extra = {
		elementFromText
	}

	const Element = R.converge(
		R.call, [
			R.pipe(
				R.props(['defaultTags', 'tags']),
				R.apply(R.mergeWith(R.merge)),
				elementRendererForTags
			),
			R.prop('references'),
			R.prop('text'),
			R.prop('children'),
			(ignore) => Element, // Have to put in closure as it is currently being assigned
			R.always(resolveContent),
			R.always(extra)
		]
	)

	Element.renderArray = (options, array) => (
		array.map((element, index) => (
			<Element key={ index }
				{ ...options }
				{ ...element }
			/>
		))
	)

	return Element
}

export const DefaultSection = ({ children }) => (
	<Seed Component='section'
		column
		margin={{ bottom: '2rem' }}
		children={ children }
	/>
)

export const DefaultMaster = ({ children }) => (
	<Seed
		padding={{ top: '1rem' }}
		children={ children }
	/>
)

export const renderTreeUsing = ({
	elementRendererForTags,
	Section = DefaultSection,
	Master = DefaultMaster
}) => ({
	ingredients,
	contentTree
}) => {
	// FIXME: use valueForIngredient instead that encapsulates ingredientVariationIndexes 
	const Element = renderElement({ ingredients, elementRendererForTags }) 

	return (
		<Master ingredients={ ingredients }>
		{
			contentTree.map((section, sectionIndex) => (
				<Section key={ sectionIndex }>
				{
					section.map((element, elementIndex) => (
						<Element key={ elementIndex } { ...element } />	
					))
				}
				</Section>
			))
		}
		</Master>
	)
}
