import React from 'react'
import { findDOMNode } from 'react-dom'
import { Seed } from 'react-seeds'

function sizeTextAreaToFit(el) {
	const { style } = el
	style.height = '1px'

	const measuredHeight = `${el.scrollHeight}px` 
	style.height = measuredHeight
	style.resize = 'none'
}

export default React.createClass({
	setElement(component) {
		const el = findDOMNode(component)

		this.el = el

		if (el != null) { // null when unmounting
			sizeTextAreaToFit(el)
		}
	},

	onChange(event) {
		const el = event.target

		sizeTextAreaToFit(el)

		const value = el.value
		this.props.onChange(value)
	},

	render() {
		return (
			<Seed Component='textarea'
				ref={ this.setElement }
				{ ...this.props }
				onChange={ this.onChange }
			/>
		)
	},

	componentDidUpdate() {
		if (this.el) {
			sizeTextAreaToFit(this.el)
		}
	}
})
