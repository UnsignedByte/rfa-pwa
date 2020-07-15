/*
* @Author: UnsignedByte
* @Date:   16:10:21, 24-May-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 18:24:47, 14-Jul-2020
*/
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'build/curriculum.js',
    format: 'iife',
    name: 'Curriculum'
  },
  plugins: [
  	resolve({
			browser: true
		})
  ]
};