module.exports = {
	type: 'react-app',
	//type: 'react-component',
	es: true,
	npm: {
		umd: {
			global: 'Gateau',
			externals: {
				'react': 'React',
				'react-dom': 'ReactDOM',
				'mobx': 'mobx',
				'mobx-react': 'mobxReact',
				'ramda': 'R'
			}
		}
	},
	webpack: {
		//publicPath: '/-web/flambe'
	}
}
