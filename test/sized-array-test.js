const assert = require('assert');
const jsc = require('jsverify');
const {
	szarray
} = require('../arrays.js');

describe('szarray', ()=>{
	jsc.property('with number', szarray(2, jsc.nat), (arr)=>{
		return arr.length === 2;
	});
	
	jsc.property('with arb', szarray(jsc.integer(2,7), jsc.nat), (arr)=>{
		return arr.length >= 2 && arr.length<=7;
	});

	jsc.property('without limits arb', szarray(jsc.nat), (arr)=>{
		return !!arr;
	});
	
	jsc.property('from env', 'szarray 5 nat', {szarray}, (arr)=>{
		return arr.length === 5;
	});
});