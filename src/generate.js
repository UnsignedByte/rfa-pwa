/*
* @Author: UnsignedByte
* @Date:   18:42:12, 14-Jul-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 02:40:48, 15-Jul-2020
*/

// File used to generate the curriculum
import * as jQuery from 'jquery';
import {random} from './utils.js'

// possible colors
const palette = ["blue", "light-green", "red", "green", "pink", "yellow", "purple"]

// Generate all
export default function generate(data){
	const container = $('<div/>', {id: "curriculae", "class": "row"});
	for (const curriculum of data) {
		// ignore file if it isnt a curriculum folder
		if (curriculum.mimeType !== 'application/vnd.google-apps.folder') continue;

		let color = random.choice(palette); // choose a random color
		const card = $('<div/>', {class:`card col s12 ${color} lighten-4`}).appendTo(container); // create a card
		$('<h4/>').text(curriculum.name)
			.appendTo($('<div/>', {class:'card-content'}))
			.appendTo(card)

		const tabs = $('<ul/>', {class:`tabs tabs-fixed-width ${color} lighten-4`})
			.appendTo($('<div/>', {class:'card-tabs'}).appendTo(card)); // tabs for different days
		for (const day of curriculum.data) {
			// ignore file if it isnt a folder
			if (day.mimeType !== 'application/vnd.google-apps.folder') continue;
			console.log(day.name);
			// base64 the file id to use as a #id
			const id = btoa(day.id);
			$('<a/>', {href:`#${id}`}).text(day.name).appendTo($('<li/>', {class:"tab"}).appendTo(tabs));
		}
	}
	console.log(container);
	return container;
}

// <div class="card col s12 blue lighten-4">
//           <div class="card-content">
//             <h4>
//               Paper/Kultz Class
//               <p class="right">
//                 📜
//                 <i class="material-icons right card-title activator ">more_vert</i>
//               </p>
//             </h4>
//           </div>
//           <div class="card-reveal blue lighten-5">
//             <span class="card-title grey-text text-darken-4">Paper/Kultz Class<i class="material-icons right">close</i></span>
//             <p>
//               This curriculum is on the Paper and Kultz line of products.
//               <br><br>
//             </p>
//             <div class="chip">
//               <i class="material-icons right">school</i>
//               Mariano Castro
//             </div>
//             <div class="chip">
//               Online
//               <i class="material-icons right">school</i>
//             </div>
//           </div>
//           <div class="card-tabs">
//             <ul class="tabs tabs-fixed-width blue lighten-4">
//               <li class="tab"><a href="#pkd1" class="active">Day 1</a></li>
//               <li class="tab"><a href="#pkd2">Day 2</a></li>
//               <li class="tab"><a href="#pkd3">Day 3</a></li>
//               <li class="tab"><a href="#pkd4">Day 4</a></li>
//               <li class="tab"><a href="#pkd5">Day 5</a></li>
//             <li class="indicator" style="left: 0px; right: 549px;"></li></ul>
//           </div>
//           <div class="card-content blue lighten-5">
//             <div id="pkd1" class="active">
//               <div class="row" style="margin-bottom: 0px;">
//                  <h4 class="col s12">
//                 <i class="material-icons left col s1" style="margin-top: 10px;">folder</i>
//                    Day 4
              
// <i class="material-icons right col s1" style="margin-top: 14px; margin-right: -7px;">cloud_download</i></h4>
//               </div>
             
             

//               <div class="divider"></div>
// <br>              
//               <div class="row"> <!--- this is a doc --->
//                 <div class="col s11">
//                   <i class="material-icons left col s1">description</i>
//                   <p class="col s8">
//                     Document1
//                   </p>
//                 </div>

//                 <form action="#" class="right col s1">
//                   <label>
//                     <input type="checkbox" class="filled-in">
//                     <span></span>
//                   </label>
//                 </form>
//               </div>
//               <div class="row">
                
//                   <!--- presentation --->
//                   <div class="col s11">
//                     <i class="material-icons left col s1">slideshow</i>
//                     <p class="col s8">
//                       Presentation2
//                     </p>
//                   </div>

//                   <form action="#" class="right col s1">
//                     <label>
//                       <input type="checkbox" class="filled-in">
//                       <span> </span>
//                     </label>
//                   </form>
                
//               </div>

//               <div class="row">
//                 <!--- video --->
//                 <div>
//                   <div class="col s11">
//                     <i class="material-icons left col s1">movie</i>
//                     <p class="col s8">
//                       Video3
//                     </p>
//                   </div>

//                   <form action="#" class="right col s1">
//                     <label>
//                       <input type="checkbox" class="filled-in">
//                       <span> </span>
//                     </label>
//                   </form>
//                 </div>
//               </div>
//               <div class="row">
//                   <!--- photo --->
//                   <div class="col s11">
//                     <i class="material-icons left col s1">insert_photo</i>
//                     <p class="col s8">
//                       Photo4
//                     </p>
//                   </div>

//                   <form action="#" class="right col s1">
//                     <label>
//                       <input type="checkbox" class="filled-in">
//                       <span> </span>
//                     </label>
//                   </form>
//               </div>
//               <div class="row">
//                 <!--- video --->
//                 <div class="col s11">
//                   <i class="material-icons left col s1">movie</i>
//                   <p class="col s8">
//                     Video5
//                   </p>
//                 </div>

//                 <form action="#" class="right col s1">
//                   <label>
//                     <input type="checkbox" class="filled-in">
//                     <span> </span>
//                   </label>
//                 </form>
//               </div>
//             </div>
//             <div class="row">
//                 <!--- photo --->
//                 <div class="col s11 ">
//                   <i class="material-icons left col s1">insert_photo</i>
//                   <p class="col s8">
//                     Photo6
//                   </p>
//                 </div>

//                 <form action="#" class="right col s1">
//                   <label>
//                     <input type="checkbox" class="filled-in">
//                     <span> </span>
//                   </label>
//                 </form>
//             </div>
//             <div id="pkd2" style="display: none;">Test 2</div>
//             <div id="pkd3" style="display: none;">Test 3</div>
//             <div id="pkd4" style="display: none;">day 4 content</div>
//             <div id="pkd5" style="display: none;">day 4 content</div>
//           </div>
//         </div>