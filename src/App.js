import React from 'react'
import Main from './Main'

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
	getDefaultProps() {
		return {
			initialContent,
			initialIngredients: [],
			initialScenarios: []
		}
	},

  render() {
		const {
			initialContent,
			initialDestinationID,
			initialIngredients,
			initialScenarios
		} = this.props
    return (
			<Main
				initialContent={ initialContent }
				initialDestinationID={ initialDestinationID }
				initialIngredients={ initialIngredients }
				initialScenarios={ initialScenarios }
			/>
		)
  }
})
