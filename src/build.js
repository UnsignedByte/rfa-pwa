/*
* @Author: UnsignedByte
* @Date:   15:43:02, 05-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 18:52:10, 05-Jun-2020
*/

import { promises as fs } from 'fs'

const fname = 'params';
const urls = {
	main:new URL(`../${fname}.json`, import.meta.url),
	default:new URL(`./build/${fname}.json`, import.meta.url),
	js:new URL(`./build/${fname}.js`, import.meta.url)
}
fs.readFile(urls.main).then(async val => {
		await fs.writeFile(urls.js, `const params = ${val}\nexport default params`)
		import('./build/load.js').then(module => module.default())
	})
	.catch(err => {
		// If the file doesn't exist, throw error after creating new file
		if (err.code === 'ENOENT') {
			fs.readFile(urls.default).then(val=>fs.writeFile(urls.main, val))
			console.error(new Error(`Missing Information in ${fname}.json`))
		} else { //Unknown error
			console.error(err)
		}
	})