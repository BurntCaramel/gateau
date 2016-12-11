import React from 'react'
import seeds, { Seed, appearanceNone } from 'react-seeds'
import defaultStyler from 'react-sow/default'

import * as colors from '../colors'

const Choice = React.createClass({
	getDefaultProps() {
		return {
			styler: () => defaultStyler
		}
	},

	onChange(event) {
		const el = event.target
		const value = el.value
		this.props.onChange(value)
	},

	render() {
		const { value, items, onChange, styler, ...rest } = this.props

		return (
			<Seed Component='select'
				{ ...rest }
				value={ value }
				onChange={ this.onChange }
				padding={{ top: 0, bottom: 0, left: '0.5em', right: '0.5em' }}
				font={{ size: 16 }}
				cornerRadius={ 0 }
				{ ...appearanceNone() }
				{ ...styler(rest) }
			>
			{
				items.map(({ value, title }) => (
					<option key={ value }
						value={ value } children={ title }
					/>
				))
			}
			</Seed>
		)
	}
})

export default Choice
