import React from 'react'

const CollectedImage = React.createClass({
	getInitialState() {
		return {
			html: null
		}
	},

	componentWillMount() {
		window.promiseCollectedImageURL(this.props)
		.then(this.onLoad, this.onError)
	},

	onLoad(result) {
		this.setState(result)
	},

	onError(error) {
		this.setState({ error })
	},

	render() {
		const { text } = this.props
		const { html, error } = this.state;

		if (html) {
			return (
				<div dangerouslySetInnerHTML={{ __html: html }} />
			)
		}
		else if (error) {
			return (
				<div children={ `Error: ${ error.message }` } />
			)
		}

		return text
	}
})

export default CollectedImage
