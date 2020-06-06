/*
* @Author: UnsignedByte
* @Date:   15:43:02, 05-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 11:38:16, 06-Jun-2020
*/

const fs = require('fs/promises');
const {google} = require('googleapis');
const path = require('path');
const Queue = require("queue-promise");

const driveTools = {
	getFolder:async (drive, id) => await drive.files.list({q:`'${id}' in parents`}),
	get:async (drive, id, extra) => await drive.files.get(Object.assign({fileId:id}, extra)),
	export:async (drive, id, mimeType) => await drive.files.export({fileId:id, mimeType:mimeType})
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
				switch(x.mimeType){
					case 'application/vnd.google-apps.folder':
						out.push(await crawl(x.id));
						break;
					case 'application/vnd.google-apps.document':
					case 'application/vnd.google-apps.presentation':
					case 'application/vnd.google-apps.spreadsheet':
						out.push(await driveTools.export(drive, x.id, 'application/pdf').then(val=>{return {type:'application/pdf', data:val.data}}))
						break;
					default:
						// weird filetype, just export as self
						out.push(await driveTools.get(drive, x.id, {alt:'media'}).then(val=>{return {type:x.mimeType, data:val.data}}))
				}
			}
			return out;
		}).then(val=>{return {type:'folder',data:val}})
	}

	// console.log(await driveTools.export(drive, '1nXTCJAWykZf4NSBsMpf4cjqUIU40LW2zfxxAVIA6N1A', 'application/pdf'));
	// console.log(await drive.files.get({fileId:'1-tSjsNOktm_h7FVTXa3enLRGaJNe193x', alt:'media'}))
	return await crawl(params.FOLDER_ID);
	// return 
}

const urls = {
	main:path.resolve(__dirname, `../params.json`),
	default:path.resolve(__dirname, `./params.json`),
	out:path.resolve(__dirname, `./data.js`)
}

fs.readFile(urls.main)
	.then(val => load(JSON.parse(val)).then(
		data => fs.writeFile(urls.out, `const data = ${JSON.stringify(data)};\nexport default data`)
						.then(()=>console.log("Curriculum data loaded."))
		))
	.catch(err => {
		// If the file doesn't exist, throw error after creating new file
		if (err.code === 'ENOENT') {
			fs.readFile(urls.default).then(val=>fs.writeFile(urls.main, val))
			console.error(new Error(`Missing Information in params.json`))
		} else { //Unknown error
			console.error(err)
		}
	})