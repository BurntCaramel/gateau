import React from 'react'
import { render } from 'react-dom'

import App from './App'

function initGateauAppElements(appElements) {
	for (var i = 0; i < appElements.length; i++) {
		const appElement = appElements[i]
		const destinationID = appElement.getAttribute('data-destination')
		const contentElement = appElement.querySelector('.gateau_content')
		const ingredientsElement = appElement.querySelector('.gateau_ingredients')
		const scenariosElement = appElement.querySelector('.gateau_scenarios')
		const content = contentElement.textContent.trim()
		const ingredients = ingredientsElement ? (
			JSON.parse(ingredientsElement.textContent)
		) : []
		const scenarios = scenariosElement ? (
			JSON.parse(scenariosElement.textContent)
		) : []
		render(
			<App
				initialContent={ content }
				initialDestinationID={ destinationID }
				initialIngredients={ ingredients }
				initialScenarios={ scenarios }
			/>,
			appElement
		)
	}
}

// Render app elements on the page
initGateauAppElements(document.querySelectorAll('.gateau'))

// Allow dynamic app elements in the future
window.initGateauAppElements = initGateauAppElements

if (!window.promiseCollectedText) {
	window.promiseCollectedText = function(options) {
		return Promise.resolve(null)
	}
}

if (!window.promiseCollectedImageURL) {
	window.promiseCollectedImageURL = function(options) {
		return Promise.reject({ message: 'No collected service' })
	}
}
