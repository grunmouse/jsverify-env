const assert = require('assert');
const sinon = require('sinon');
const jsc = require('jsverify');


const random = require('../random/random.js');
const convert = require('../convert/convert-value.js');
const {uniqueRandom} = require('../random/unique-random.js');


describe('random', ()=>{
	
	describe('uint32ToFloat', ()=>{
		it('[0,1)', ()=>{
			const conv = convert.uint32ToFloat(false, true);
			assert.ok(conv(0) === 0);
			assert.ok(conv(0xFFFFFFFF) < 1);
		});
		it('(0,1)', ()=>{
			const conv = convert.uint32ToFloat(true, true);
			assert.ok(conv(0) > 0);
			assert.ok(conv(0xFFFFFFFF) < 1);
		});
		it('(0,1]', ()=>{
			const conv = convert.uint32ToFloat(true, false);
			assert.ok(conv(0) > 0);
			assert.ok(conv(0xFFFFFFFF) === 1);
		});
		it('[0,1]', ()=>{
			const conv = convert.uint32ToFloat(false, false);
			assert.ok(conv(0) === 0);
			assert.ok(conv(0xFFFFFFFF) === 1);
		});
	});
	
	describe('expandFloat', ()=>{
		jsc.property('expand', 'nat', 'nat', (a, b)=>{
			a = a || 1;
			b = b || 1;
			if(a>b){
				[a,b] = [b,a];
			}
			if(b === a){
				b *= 2;
			}
			
			const conv = convert.expandFloat(a, b);
			
			return conv(0)=== a && conv(1) === b;
		});
	});
	
	describe('uniqueRandom', ()=>{
		jsc.property('generate', 'integer 10 1000', 'nat', 'nat', (n, a, b)=>{
			if(a>b){
				[a,b] = [b,a];
			}
			if(b - a < n){
				b += 2*n;
			}
			
			let arr = uniqueRandom(n, random.pregenUInt(b));
			
			assert.equal(arr.length, n, 'length');
			
			let s = new Set(arr);
			
			assert.equal(s.size, n, 'unique');
			
			return true;
		});
	});
});