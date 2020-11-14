const assert = require('assert');
const jsc = require('jsverify');

const {wrap} = require('../arbitrary/arb-utils.js');


const {
	uarray,
	szarray,
	incarray
} = require('../arbitrary/arrays.js');

const env = {w:wrap, uarray, szarray, incarray};

describe('uarray', ()=>{
	jsc.property('with number', uarray(2, wrap(jsc.nat)(5)), (arr)=>{
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

	jsc.property('unique arrays of arrays', 'uarray 5 (szarray 3 (w nat))', env, (arr)=>{
		let keys = arr.map((values)=>(values.reduce((akk, x)=>((akk<<32n) | BigInt(x)), 0n)));
		let s = new Set(keys);
		//console.log(arr);
		return arr.length === 5 && s.size == arr.length;
	});
	
	jsc.property('incarray 2 (int 1 999)', 'incarray 2 ((w integer) 1 999)', env, (arr)=>{
		assert.ok(arr[0]>=1, 'arr[0]>=1');
		assert.ok(arr[0]!==arr[1], 'arr[0]<arr[1]');
		assert.ok(arr[0]<arr[1], 'arr[0]<arr[1]');
		assert.ok(arr[1]<=999, 'arr[1]<=999');
		return arr[0]>=1 && arr[0]<arr[1] && arr[1]<=999;
	});
	
});