/*
* @Author: UnsignedByte
* @Date:   13:23:55, 06-Jun-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 16:07:36, 06-Jun-2020
*/

function url(url, params){
	return `${url}?${new URLSearchParams(params)}`
}

module.exports = {url}