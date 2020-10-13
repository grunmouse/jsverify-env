const assert = require('assert');
const sinon = require('sinon');
const jsc = require('jsverify');


const random = require('../random.js');

describe('random', ()=>{
	describe('integer', ()=>{
		
		jsc.property('without argument', 'nat', ()=>{
			const spy = sinon.spy(jsc.random, 'integer');
			spy.resetHistory();
			let r = random.integer();
			
			let calls = spy.getCalls();
			
			assert.ok(calls.length>0);
			calls.forEach((c)=>{
				assert.deepEqual(c.args, [0, 0xFFFFFFFF]);
			});
			spy.resetHistory();
			
			spy.restore();
			return true;
		});
		
		jsc.property('with one argument', '(integer 10 1000)', (b)=>{
			const spy = sinon.spy(jsc.random, 'integer');
			spy.resetHistory();
			let r = random.integer(b);
			
			let calls = spy.getCalls();
			
			assert.ok(calls.length>0);
			calls.forEach((c)=>{
				assert.deepEqual(c.args, [0, b]);
			});
			spy.resetHistory();
			
			spy.restore();
			return true;
		});

		jsc.property('with two argument', 'integer 0 1000', 'integer 1 5000', (a, b)=>{
			const spy = sinon.spy(jsc.random, 'integer');
			spy.resetHistory();
			
			if(a>b){
				[a,b] = [b,a];
			}
			
			let r = random.integer(a, b);
			
			
			let calls = spy.getCalls();
			
			assert.ok(calls.length>0);
			calls.forEach((c)=>{
				assert.deepEqual(c.args, [a, b]);
			});
			spy.resetHistory();
			
			spy.restore();
			return true;
		});
	});
	
	describe('randomUInt32', ()=>{
		jsc.property('without argument', 'nat', ()=>{
			const spy = sinon.spy(jsc.random, 'integer');
			spy.resetHistory();
			let r = random.randomUInt32();
			
			let calls = spy.getCalls();
			
			assert.ok(calls.length>0);
			calls.forEach((c)=>{
				assert.deepEqual(c.args, [0, 0xFFFFFFFF]);
			});
			spy.resetHistory();
			
			spy.restore();
			return true;
		});
		
	});		
	

	describe('randomUInt52', ()=>{
		jsc.property('without argument', 'nat', ()=>{
			const spy = sinon.spy(jsc.random, 'integer');
			spy.resetHistory();
			let r = random.randomUInt52();
			
			let calls = spy.getCalls();
			
			assert.ok(calls.length == 2);
			let str = (calls[0].args[1].toString(16) + calls[1].args[1].toString(16));

			assert.equal(str.length, 52/4);

			spy.resetHistory();
			
			spy.restore();
			return true;
		});
	});
	
	describe('uint32ToFloat', ()=>{
		it('[0,1)', ()=>{
			const conv = random.uint32ToFloat(false, true);
			assert.ok(conv(0) === 0);
			assert.ok(conv(0xFFFFFFFF) < 1);
		});
		it('(0,1)', ()=>{
			const conv = random.uint32ToFloat(true, true);
			assert.ok(conv(0) > 0);
			assert.ok(conv(0xFFFFFFFF) < 1);
		});
		it('(0,1]', ()=>{
			const conv = random.uint32ToFloat(true, false);
			assert.ok(conv(0) > 0);
			assert.ok(conv(0xFFFFFFFF) === 1);
		});
		it('[0,1]', ()=>{
			const conv = random.uint32ToFloat(false, false);
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
			
			const conv = random.expandFloat(a, b);
			
			return conv(0)=== a && conv(1) === b;
		});
	});
	
	describe('uniqueRandomInt', ()=>{
		jsc.property('generate', 'integer 10 1000', 'nat', 'nat', (n, a, b)=>{
			if(a>b){
				[a,b] = [b,a];
			}
			if(b - a < n){
				b += 2*n;
			}
			
			let arr = random.uniqueRandomInt(n, a, b);
			
			assert.equal(arr.length, n, 'length');
			
			let s = new Set(arr);
			
			assert.equal(s.size, n, 'unique');
			
			return true;
		});
	});
});