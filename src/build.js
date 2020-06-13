/*
* @Author: UnsignedByte
* @Date:   15:43:02, 05-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 13:07:08, 13-Jun-2020
*/

const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');
const {url} = require('./url.js')
const fetch = require('node-fetch')

const driveTools = {
	getFolder: (drive, id) => drive.files.list({q:`'${id}' in parents`}),
	get: (drive, id, extra) => drive.files.get(Object.assign({fileId:id}, extra)),
	export: (drive, id, mimeType) => drive.files.export({fileId:id, mimeType:mimeType})
}

function dataURI(mimeType, response){
	let data = Buffer.from(response.data, 'utf8').toString('base64');
	let ret = {download:`<a href="data:${mimeType};base64,${data}" target="_blank">`}
	switch(true){
		case /application\/pdf/.test(mimeType):
			ret = Object.assign(ret,{html:`<embed src="data:${mimeType};base64,${data}"/>`});
			break;
		case /image\/.+/.test(mimeType):
			ret = Object.assign(ret,{html:`<img src="data:${mimeType};base64,${data}"/>`});
			break;
	}
	return ret;
}

/*
 * Used to load and compile the curriculum folder into JSON format
*/
async function load(params){
	const drive = google.drive({
		version:'v3',
		auth:params.API_KEY
	});

	let crawl = async (fID) => { // crawl subitems given folder
		return await driveTools.getFolder(drive, fID).then(async val=>{
			const out = [];
			for(const x of val.data.files){
				console.log(`resolving ${x.mimeType} ${x.name}`);
				switch(true){
					case /application\/vnd\.google-apps\.folder/.test(x.mimeType):
						out.push(await crawl(x.id));
						break;
					case /application\/vnd\.google-apps\.document/.test(x.mimeType):
					case /application\/vnd\.google-apps\.presentation/.test(x.mimeType):
					case /application\/vnd\.google-apps\.spreadsheet/.test(x.mimeType):
						x.mimeType = 'application/pdf'
						out.push(await driveTools.export(drive, x.id, 'application/pdf').then(val=>{return Object.assign(
								x, {data:dataURI(x.mimeType, val), mimeType:x.mimeType}
							)}))
						break;
					case /video\/.+/.test(x.mimeType): //no videos bad
						out.push(x)
						break;
					default:
						// weird filetype, just export as self
						out.push(await driveTools.get(drive, x.id, {alt:'media'}).then(val=>{return Object.assign(
								x, {data:dataURI(x.mimeType, val)}
							)}))
				}
			}
			return out;
		}).then(val=>{return {type:'folder',data:val}})
	}

	return await crawl(params.FOLDER_ID);
}

const urls = {
	main:path.resolve(__dirname, `../params.json`),
	default:path.resolve(__dirname, `./params.json`),
	out:path.resolve(__dirname, `./data.js`)
}

fs.promises.readFile(urls.main)
	.then(val => load(JSON.parse(val)).then(
		data => fs.promises.writeFile(urls.out, `const data = ${JSON.stringify(data)};\nexport default data`)
						.then(()=>console.log("Curriculum data loaded."))
		))
	.catch(err => {
		// If the file doesn't exist, throw error after creating new file
		if (err.code === 'ENOENT') {
			fs.promises.readFile(urls.default).then(val=>fs.promises.writeFile(urls.main, val))
			console.error(new Error(`Missing Information in params.json`))
		} else { //Unknown error
			console.error(err)
		}
	})