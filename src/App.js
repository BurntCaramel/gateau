import React from 'react'
import Main from './Main'
import createStateManager from './createStateManager'

const initialContent = (
`Just add hashtags #primary

Create rich layouts just by typing #image #unsplash: dessert

Create fields #field
And Buttons #button #primary
Big and Small #button #small

Features #link: @links.features

@legal #small
`)

/*
	# shorthand #primary
	## shorthand #secondary
	### shorthand #tertiary

	#collected:(hash)
*/

const ingredients = [
	{
		id: 'links',
		type: 'json',
		variations: [
			{
				rawContent: `{"features": "https://icing.space/features"}`
			}
		]
	},
	{
		id: 'legal',
		type: 'text',
		variations: [
			{
				rawContent: `Copyright Company Inc. 2016`
			}
		]
	}
]

const scenarios = [
	{
		links: 0,
		legal: 0
	}
]

export default React.createClass({
	componentWillMount() {
		const {
			initialContent,
			initialDestinationID,
			initialDestinationDevice,
			initialIngredients,
			initialScenarios,
			initialActiveScenarioIndex
		} = this.props

		this.stateManager = createStateManager({
			content: initialContent,
			ingredients: initialIngredients,
			destinationID: initialDestinationID,
			destinationDevice: initialDestinationDevice,
			scenarios: initialScenarios,
			activeScenarioIndex: initialActiveScenarioIndex
		})
	},

	render() {
		return (
			<Main stateManager={ this.stateManager } />
		)
	}
})
