const env = require('../arbitrary/environment.js');
const jsc = require('jsverify');

describe('cases', ()=>{
	jsc.property('test', 'uarray 4 (array 2 (i_i 0 50))', 'nat', env, (arr, t)=>{
		return arr.length === 4 && arr.every(a=>(a.length === 2));
	});
});