/*
* @Author: UnsignedByte
* @Date:   15:43:02, 05-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 16:18:40, 06-Jun-2020
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

	await fetch('https://www.googleapis.com/drive/v3/files/1L3ZX-l4Kto4rIjRilwvZHKb3UQV5Cf5S?alt=media&key=AIzaSyDKKpJpMbM9kt5wjMlOGvUaOVfd0v_Qx1o').then(async val=>console.log(await val.text()));

	// console.log(await driveTools.export(drive, '1nXTCJAWykZf4NSBsMpf4cjqUIU40LW2zfxxAVIA6N1A', 'application/pdf'));
	// let dest = fs.createWriteStream(path.resolve(__dirname, './test.mov'));
	// await drive.files.get({fileId:'1L3ZX-l4Kto4rIjRilwvZHKb3UQV5Cf5S', alt:'media'});
		// .on('end', function () {
  //     console.log('Done');
  //   })
  //   .on('error', function (err) {
  //     console.log('Error during download', err);
  //   })
  //   .pipe(dest)
	// return await crawl(params.FOLDER_ID);
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