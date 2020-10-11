const assert = require('assert');
const sinon = require('sinon');

const functor = require('jsverify/lib/functor.js');

function testingFunctor(name, functor){
	describe(name, ()=>{
		it('exists', ()=>{
			assert.ok(functor);
		});
		
		describe('bind', ()=>{
			it('exists', ()=>assert.ok(functor.bind));
			describe('sync', ()=>{
				const returned = 'value';
				const throwed = 'mess';
				const handled = 'result';
				
				const sample = ()=>(returned);
				const doerr = ()=>{throw new Error(throwed);};
				const handler = ()=>(handled);
				
				it('argument', ()=>{
					let spy = sinon.spy(sample);
					let xs = [1,2,3];
					
					let r = functor.bind(spy, xs, (a)=>(a));
					
					let calls = spy.getCalls();
					assert.ok(calls.length===1);
					assert.deepEqual(calls[0].args, xs);
				});
				
				it('handle return', ()=>{
					let h = sinon.spy(handler);

					let r = functor.bind(sample, [], h);
					
					let calls = h.getCalls();
					assert.ok(calls.length===1);
					assert.deepEqual(calls[0].args, [returned, undefined]);
				});
				
				it('handle throw', ()=>{
					let h = sinon.spy(handler);
					let r = functor.bind(doerr, [], h);
					
					let calls = h.getCalls();
					assert.ok(calls.length===1);
					assert.equal(calls[0].args[0], false);
					assert.equal(calls[0].args[1].message, throwed);
					
				});
				
				it('return with return', ()=>{
					let r = functor.bind(sample, [], handler);
					
					assert.equal(r, handled);
				});
				
				it('return with throw', ()=>{
					let r = functor.bind(doerr, [], handler);
					
					assert.equal(r, handled);
				});
				
			});
			
			describe('async', ()=>{
				const returned = 'value';
				const throwed = 'mess';
				const handled = 'result';
				
				const sample = async ()=>(returned);
				const doerr = async ()=>{throw new Error(throwed);};
				const handler = ()=>(handled);
				
				it('argument', ()=>{
					let spy = sinon.spy(sample);
					let xs = [1,2,3];
					
					let r = functor.bind(spy, xs, (a)=>(a));
					
					let calls = spy.getCalls();
					assert.ok(calls.length===1);
					assert.deepEqual(calls[0].args, xs);
				});
				
				it('handle return', async ()=>{
					let h = sinon.spy(handler);

					let r = functor.bind(sample, [], h);
					
					assert.ok(r.then);
					
					await r;
					
					let calls = h.getCalls();
					assert.ok(calls.length===1);
					assert.equal(calls[0].args[0], returned);
					assert.equal(calls[0].args[1], undefined);
				});
				
				it('handle throw', async ()=>{
					let h = sinon.spy(handler);
					
					let r = functor.bind(doerr, [], h);
					
					assert.ok(r.then);
					await r;
					
					let calls = h.getCalls();
					assert.ok(calls.length===1);
					assert.equal(calls[0].args[0], false);
					assert.equal(calls[0].args[1].message, throwed);
					
				});
				
				it('return with return', async ()=>{
					let r = await functor.bind(sample, [], handler);
					
					assert.equal(r, handled);
				});
				
				it('return with throw', async ()=>{
					let r = await functor.bind(doerr, [], handler);
					
					assert.equal(r, handled);
				});
				
			});
		});
		describe('map', ()=>{
			it('exists', ()=>assert.ok(functor.map));
		});
		describe('run', ()=>{
			it('exists', ()=>assert.ok(functor.run));
		});
		describe('pure', ()=>{
			it('exists', ()=>assert.ok(functor.pure));
		});
	});
}

testingFunctor('jsverify functor', functor);