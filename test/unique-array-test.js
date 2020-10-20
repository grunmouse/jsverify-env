const assert = require('assert');
const jsc = require('jsverify');

const {wrap} = require('../arb-utils.js');


const {
	uarray
} = require('../arrays.js');

const env = {w:wrap, uarray};

describe('uarray', ()=>{
	jsc.property('with number', uarray(2, jsc.nat), (arr)=>{
		let s = new Set(arr);
		return arr.length === 2 && s.size == arr.length;
	});
	
	jsc.property('with arb', uarray(jsc.integer(2,7), jsc.nat), (arr)=>{
		let s = new Set(arr);
		return arr.length >= 2 && arr.length<=7 && s.size == arr.length;
	});

	jsc.property('without limits arb', uarray(jsc.nat), (arr)=>{
		let s = new Set(arr);
		return !!arr && s.size == arr.length;
	});
	
	jsc.property('from env', 'uarray 5 (w nat)', env, (arr)=>{
		let s = new Set(arr);
		return arr.length === 5 && s.size == arr.length;
	});
});