import R from 'ramda'
import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds, { Seed } from 'react-seeds'
import { action } from 'mobx'
import { observer } from 'mobx-react'

import destinations from './destinations'

import * as colors from './colors'
import * as stylers from './stylers'
import Button from './ui/Button'
import Field from './ui/Field'
import Choice from './ui/Choice'
import IngredientsEditor from './sections/IngredientsEditor'
import PreviewSection from './sections/preview'

import createObservableState from './state'

export default observer(React.createClass({
	getDefaultProps() {
		return {
			autofocus: false,
			showTree: false,
			backgroundColor: '#191919'
		}
	},

	componentWillMount() {
		this.onSourceChange = action((content) => {
			this.props.stateManager.content = content
		})
		this.onChangeDestination = action((newDestinationID) => {
			this.props.stateManager.destinationID = newDestinationID
		})
		this.onPhoneDestination = action(() => {
			this.props.stateManager.destinationDevice = 'phone'
		})
		this.onFullDestination = action(() => {
			this.props.stateManager.destinationDevice = 'full'
		})
	},

	onSetUpMainField(component) {
		const el = findDOMNode(component)
		if (!!el && this.props.autofocus) {
			el.focus()
		}
	},

	onClickDrag({ type, currentTarget, target, clientX }) {
		if (type === 'mouseup') {
			this.dragging = false
		}
		else if (this.dragging || type === 'mousedown') {
			if (type === 'mousemove') {
				currentTarget.scrollLeft += (this.mouseX - clientX)
			}

			// Only allow clicking on background
			if (target.tagName === 'DIV') {
				this.dragging = true
				this.mouseX = clientX
			}
		}
	},

	render() {
		const {
			showTree,
			stateManager,
			backgroundColor
		} = this.props
		const {
			content,
			contentTree,
			ingredients,
			activeIngredients,
			scenarios,
			activeScenarioIndex,
			destinationID,
			destinationDevice
		} = stateManager

		const scenario = scenarios[activeScenarioIndex]

		console.dir(scenario)
		console.dir(contentTree)
		console.dir(activeIngredients)

		return (
			<Seed row justifyContent='center'
				grow={ 0 } shrink={ 0 }
				background={{ color: backgroundColor }}
			>
				<Seed row
					grow={ 1 } shrink={ 2 }
					minWidth={ 320 }
					overflow='scroll'
					onMouseDown={ this.onClickDrag }
					onMouseMove={ this.onClickDrag }
					onMouseUp={ this.onClickDrag }
				>
					<Seed column
						grow={ 1 }
						{ ...stylers.mainColumn }
					>
						<Field
							ref={ this.onSetUpMainField }
							value={ content }
							onChange={ this.onSourceChange  }
							{ ...stylers.sourceField }
						/>
					</Seed>
					<Seed column>
						<IngredientsEditor
							ingredients={ ingredients }
							ingredientIDToVariationIndex={ scenario }
							onAddNew={ stateManager.addNewIngredient }
							onRemoveAtIndex={ stateManager.onRemoveIngredientAtIndex }
							onAddVariationAtIndex={ stateManager.onAddVariationAtIndex }
						/>
					</Seed>
				</Seed>
				{ showTree &&
					<Seed row grow={ 1 } shrink={ 1 }
						{ ...stylers.preview }
					>
						<pre>
						{
							!!contentTree ? JSON.stringify(contentTree, null, 2) : null
						}
						</pre>
					</Seed>
				}
				<PreviewSection
					contentTree={ contentTree }
					ingredients={ activeIngredients }
					destinationID={ destinationID }
					destinationDevice={ destinationDevice }
					destinations={ destinations }
					onChangeDestination={ this.onChangeDestination }
					onPhoneDestination={ this.onPhoneDestination }
					onFullDestination={ this.onFullDestination }
				/>
			</Seed>
		)
	}
}))
