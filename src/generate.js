/*
* @Author: UnsignedByte
* @Date:   18:42:12, 14-Jul-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 13:05:51, 16-Jul-2020
*/

// File used to generate the curriculum
import * as jQuery from 'jquery';
import {random} from './utils.js'

// possible colors
const palette = ["blue", "light-green", "red", "green", "pink", "yellow", "purple"]

// Flatten subfolders by outputting paths
function flatten(dat) {
	const flattenRecursive = (data) => {
		// deep clone so it doesnt affect other stuff
		data = JSON.parse(JSON.stringify(data));
		if (data.mimeType === 'application/vnd.google-apps.folder'){
			// flatten nested
			const ret = [].concat(...data.data.map(x=>flattenRecursive(x)));
			for(const d of ret) {
				d.name = `${data.name} > ${d.name}`;
			}
			return ret;
		}
		return data;
	}
	if (dat.mimeType === 'application/vnd.google-apps.folder'){
		// flatten nested
		return [].concat(...dat.data.map(x=>flattenRecursive(x)));
	}
	return dat;
}

// Generate all
export default function generate(data){
	const container = $('<div/>', {id: "curriculae", "class": "row"});
	for (const curriculum of data) {
		// ignore file if it isnt a curriculum folder
		if (curriculum.mimeType !== 'application/vnd.google-apps.folder') continue;

		let color = random.choice(palette); // choose a random color
		const card = $('<div/>', {class:`card col s12 ${color} lighten-4`}).appendTo(container); // create a card
		$('<h4/>').text(curriculum.name)
			.appendTo($('<div/>', {class:'card-content'})
			.appendTo(card))

		const tabs = $('<ul/>', {class:`tabs tabs-fixed-width ${color} lighten-4`})
			.appendTo($('<div/>', {class:'card-tabs'}).appendTo(card)); // tabs for different days
		const content = $('<div/>', {class:`card-content ${color} lighten-5`}).appendTo(card);
		for (const day of curriculum.data) {
			// ignore file if it isnt a folder
			if (day.mimeType !== 'application/vnd.google-apps.folder') continue;
			console.log(day.name);
			// base64 the file id to use as a #id
			const id = btoa(day.id);
			$('<a/>', {href:`#${id}`}).text(day.name).appendTo($('<li/>', {class:"tab"}).appendTo(tabs));

			const daycard = $('<div/>', {id:id}).appendTo(content);
			$('<h4/>', {class:'col s12'}).text(day.name).appendTo($('<div/>', {class:'row'})
				.css('margin-bottom', '0px'))
				.prepend(
					$('<i/>', {class:'material-icons left col s1'})
						.css('margin-top', '10px')
						.text('folder')
				).append(
					$('<i/>', {class:'material-icons right col s1'})
						.css('margin-top', '14px').css('margin-right', '-7px')
						.text('cloud_download')
				).appendTo(daycard);
			$('<div/>', {class:'divider'}).appendTo(daycard);
			$('br').appendTo(daycard);
			flatten(day).map(x=>{
				let type = 'device_unknown';
				switch(true){
					case /application\/vnd\.google-apps\.folder/.test(x.mimeType):
						// flatten should kill folders
						throw new Error("This shouldn't happen!");
						break;
					case /application\/vnd\.google-apps\.document/.test(x.mimeType):
					case /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/.test(x.mimeType):
						type = 'description';
						break;
					case /application\/vnd\.google-apps\.presentation/.test(x.mimeType):
						type = 'slideshow';
						break;
					case /application\/vnd\.google-apps\.spreadsheet/.test(x.mimeType):
						type = 'border_all';
						break;
					case /video\/.+/.test(x.mimeType): // videos
						type = 'movie';
						break;
					case /image\/.+/.test(x.mimeType): // images
						type = 'insert_photo';
						break;
				};
				$('<div/>', {class:'row'})
					.append(
						$('<div/>', {class:'col s11'})
							.append($('<i/>', {class:'material-icons left col s1'}).text(type))
							.append($('<p/>', {class:'col s8'}).text(x.name))
					).appendTo(daycard);
			});
		}
	}
	console.log(container);
	return container;
}

// <div class=“row”>
//                 <!--- spreadsheet  --->
//                 <div>
//                   <div class=“col s11">
//                     <i class=“material-icons left col s1”>border_all</i>
//                     <p class=“col s8">
//                       spreadsheet
//                     </p>
//                   </div>
//                   <form action=“#” class=“right col s1">
//                     <label>
//                       <input type=“checkbox” class=“filled-in” />
//                       <span> </span>
//                     </label>
//                   </form>
//                 </div>
//               </div>