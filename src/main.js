/*
* @Author: UnsignedByte
* @Date:   16:01:48, 05-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 02:15:44, 15-Jul-2020
*/

import data from './data.js';
import generate from './generate.js'
import * as jQuery from 'jquery';

console.log(data);

$('#Kthru1').empty().append(generate(data));