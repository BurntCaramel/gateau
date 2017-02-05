import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import JSONComponent from './JSONComponent'


export const Preview = ({ ingredients, contentTree }) => (
	<JSONComponent json={ contentTree } isDeserialized />
)

export const title = 'Raw'

const styleSheet = `
html {
	font-size: 18px;
	font-size: calc(112.5% + 2 * (100vw - 600px) / 400);
	background-color: #eef8f8;
	color: #027362;
}

body {
	box-sizing: border-box;
	max-width: 100vw;
	margin: auto;
	padding: 1.333333333rem 1.7em;
	line-height: ${ 4/3 }rem;
	font-family: system, "-apple-system", "-webkit-system-font", BlinkMacSystemFont, "Helvetica Neue", "Helvetica", "Segoe UI", "Roboto", "Arial", "freesans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	-webkit-hypens: auto; -ms-hypens: auto; hypens: auto;
}

* {
	margin: auto;
}

p,
ul,
ol,
dt,
pre,
hr {
	margin-bottom: ${ 2/3 }rem;
}

ol {
	padding-left: 2rem;
}

li {
	margin-bottom: ${ 4/3 }rem;
}

dl,
dd {
	margin: auto;
	width: auto;
}

dt {
	margin-bottom: 0;
	font-weight: bold;
}
dd {
	margin-left: 1em;
	margin-right: 0;
}
`

export function head() {
	return [
		<style children={ styleSheet } />
	]
}
