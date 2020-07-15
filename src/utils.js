/*
* @Author: UnsignedByte
* @Date:   01:55:28, 15-Jul-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 02:11:00, 15-Jul-2020
*/

export const random = {
	// random int between two nums
	randint:(l, h)=>{
		// if only one input value, do range 0, l
		if (h === undefined) return Math.floor(Math.random()*l)
		// range l, h
		return l+Math.floor(Math.random()*(h-l));
	},
	//choice from a list
	choice:l=>l[random.randint(l.length)]
}