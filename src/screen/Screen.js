import React from 'react'
import Frame from 'react-frame-component'
import destinations from '../destinations'

const iframeStyle = {
	height: 600,
	border: 'none'
}

export default function Screen({
	contentTree,
	ingredients,
	destinationID,
	destinationDevice
}) {
	const { head: renderHead, Preview } = destinations[destinationID]
	return (
		<Frame
			head={ renderHead() }
			style={ iframeStyle }
		>
			<Preview
				ingredients={ ingredients }
				contentTree={ contentTree }
			/>
		</Frame>
	)
}