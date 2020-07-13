/*
* @Author: UnsignedByte
* @Date:   15:43:02, 05-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 22:56:33, 12-Jul-2020
*/

const fs = require('fs');
const {google} = require('googleapis');
const path = require('path');
const {url} = require('./url.js');
const fetch = require('node-fetch');
const stream = require('stream');

const urls = {
	creds:path.resolve(__dirname, `../params/credentials.json`),
	main:path.resolve(__dirname, `../params/params.json`),
	default:path.resolve(__dirname, `./params.json`),
	out:path.resolve(__dirname, `./data.js`)
}

const credentials = require(urls.creds);

const driveTools = {
	getFolder: (drive, id) => drive.files.list({q:`'${id}' in parents`}),
	get: (drive, id, extra) => drive.files.get(Object.assign({fileId:id}, extra)),
	export: (drive, id, mimeType) => {
		return drive.files.export({fileId:id, mimeType:mimeType})
					.catch(
							async err=>{
								return await driveTools.get(drive, id, {fields:'exportLinks'}).then(async ret => {
									if (ret.data.exportLinks[mimeType] === undefined) throw new Error("Export mime type not supported.");
									console.log(`export link ${ret.data.exportLinks[mimeType]} found.`);
									return {data:await fetch(ret.data.exportLinks[mimeType]).then(x=>x.text())};
								});
							}
					)
	}
	
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
	// configure a JWT auth client
	let client = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/drive']
  });
	//authenticate request
	client.authorize(function (err, tokens) {
	 if (err) {
	   console.log(err);
	 } else {
	   console.log("Successfully connected to service account");
	 }
	});

	const drive = google.drive({
		version:'v3',
		auth:client
	});

	let crawl = async (fID) => { // crawl subitems given folder
		return await driveTools.getFolder(drive, fID).then(async val=>{
			const out = [];
			for(const x of val.data.files){
				console.log(`resolving ${x.mimeType} ${x.name} (${x.id})`);
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

	console.log();

	// await drive.files.get('1CU8zNVdgEIPaY1Bg1Qliebwtq9hjix27CqCCyZTt5Tw')

	return await crawl(params.FOLDER_ID);
}

// Recursive JSON stringify with streams
function jsonStreamStringify(obj, stream) {
	console.log(obj);
	switch(true) {
		case Array.isArray(obj): //if array
			stream.write("[");
			for (let i = 0; i < obj.length; i++){
				jsonStreamStringify(obj[i], stream);
				if (i < obj.length-1) stream.write(",");
			}
			stream.write("]");
			break;
		case typeof obj === 'object' && obj !== null && obj.constructor === Object: // run if an object and dict
			stream.write("{");
			k = Object.keys(obj);
			for (let i = 0; i < k.length; i++){
				stream.write(`${k[i]}:`);
				jsonStreamStringify(obj[k[i]], stream);
				if (i < k.length-1) stream.write(",");
			}
			stream.write("}");
			break;
		default: //just stringify everything else
			stream.write(JSON.stringify(obj));
	}
}

fs.promises.readFile(urls.main)
	.then(val => load(JSON.parse(val)).then(data => {
		let outstream = fs.createWriteStream(urls.out);
		outstream.write('const data = ');
		jsonStreamStringify(data, urls.out);
		outstream.write(';\nexport default data');
	}))
		// data => fs.promises.writeFile(urls.out, `const data = ${JSON.stringify(data)};\nexport default data`)
		// 				.then(()=>console.log("Curriculum data loaded."))
		// ))
	.catch(err => {
		// If the file doesn't exist, throw error after creating new file
		if (err.code === 'ENOENT') {
			fs.promises.readFile(urls.default).then(val=>fs.promises.writeFile(urls.main, val))
			console.error(new Error(`Missing Information in params.json`))
		} else { //Unknown error
			console.error(err)
		}
	})