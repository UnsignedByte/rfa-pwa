/*
* @Author: UnsignedByte
* @Date:   15:43:02, 05-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 20:42:08, 05-Jun-2020
*/

import { promises as fs } from 'fs'

/*
 * Used to load and compile the curriculum folder into JSON format
*/
function load(params){
	console.log(params);
}

const fname = 'params';
const urls = {
	main:new URL(`../${fname}.json`, import.meta.url),
	default:new URL(`./build/${fname}.json`, import.meta.url),
	js:new URL(`./build/${fname}.js`, import.meta.url)
}
fs.readFile(urls.main).then(async val => {
		load(JSON.parse(val));
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