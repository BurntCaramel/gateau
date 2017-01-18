import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import Path from 'path'
import FS from 'fs'

function promiseAccessibleFilePath(path) {
	return new Promise((resolve, reject) => {
		FS.stat(path, (err, stats) => {
			if (err) {
				reject(err)
			}
			else if (!stats.isFile()) {
				reject(new Error('Expected file: ' + path))
			}
			else {
				resolve(path)
			}
		})
	})
}

export default {
	dest: 'single/Main.js',
	entry: 'src/Main.js',
	format: 'iife',
	plugins: [
		/*{
			name: 'index-resolve',
			resolveId(importee, importer) {
				if (importee[0] === '.') {
					return promiseAccessibleFilePath(Path.resolve(importer, '..', importee))
					.catch(error => (
						promiseAccessibleFilePath(Path.resolve(importer, '..', importee + '.js'))
					))
					.catch(error => (
						promiseAccessibleFilePath(Path.resolve(importer, '..', importee, 'index.js'))
					))
				}
				else {
					return null
				}
			}
		},*/
		nodeResolve({
			module: false,
			main: true,
			skip: ['mobx', 'mobx-react'],
			browser: true
		}),
		buble({
			//include: 'src/**',
			objectAssign: 'Object.assign',
			//jsx: 'React.createElement',
			transforms: {
				arrow: true,
				classes: true,
				conciseMethodProperty: true,
				destructuring: true,
				parameterDestructuring: true,
				spreadRest: true
			}
		})
	]
}
