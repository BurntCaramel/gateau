import R from 'ramda'
import React from 'react'
import repeatString from 'lodash/repeat'

const unsplashURLForKeywords = R.pipe(
	R.ifElse(
		R.is(String),
		(keywords) => `/800x600?${keywords}`,
		R.always(`/800x600?`)
	),
	R.concat('https://source.unsplash.com')
)

const UnsplashImage = React.createClass({
	getInitialState() {
		return {
			refreshCount: 0
		}
	},

	onRefresh() {
		this.setState(({ refreshCount }) => ({
				refreshCount: refreshCount + 1
		}))
	},

	render() {
		const { category, text } = this.props
		const { refreshCount } = this.state;
		const url = `${ unsplashURLForKeywords(category) }${ repeatString(',', refreshCount) }`
		return (
			<img key={ refreshCount } src={ url } alt={ text }
				style={{ width: '100%', height: 'auto' }}
				onClick={ this.onRefresh }
			/>
		)
	}
})

export default UnsplashImage
