const assert = require("assert");
const jsc = require("jsverify");
const prim = require('../new-primitives.js');
const {
	wrap,
	identOf,
	generationSettingsOf
} = require('../arb-utils.js');

const env = {w:wrap};

describe('identOf', ()=>{
	it('jsc.nat', ()=>{
		let ident = identOf(jsc.nat);
		assert.equal(ident.name, 'nat');
	});
	
	it('w jsc.nat()', ()=>{
		let arb = wrap(jsc.nat)();
		let ident = identOf(arb);
		assert.equal(ident.name, 'nat');
	});

	it('jsc.integer', ()=>{
		let ident = identOf(jsc.integer);
		assert.equal(ident.name, 'integer');
	});
	
	it('w jsc.integer()', ()=>{
		let arb = wrap(jsc.integer)();
		let ident = identOf(arb);
		assert.equal(ident.name, 'integer');
	});
	
	it('jsc.number', ()=>{
		let ident = identOf(jsc.number);
		assert.equal(ident.name, 'number');
	});
	
	it('w jsc.number()', ()=>{
		let arb = wrap(jsc.number)();
		let ident = identOf(arb);
		assert.equal(ident.name, 'number');
	});	
	
	it('jsc.datetime', ()=>{
		let ident = identOf(jsc.datetime);
		assert.equal(ident.name, 'datetime');
	});
	
	it('w jsc.datetime()', ()=>{
		let arb = wrap(jsc.datetime)();
		let ident = identOf(arb);
		assert.equal(ident.name, 'datetime');
	});	
	
	it('jsc.elements', ()=>{
		let ident = identOf(jsc.elements);
		assert.equal(ident.name, 'elements');
	});
	
	it('w jsc.elements()', ()=>{
		let arb = wrap(jsc.elements)([1,2,3]);
		let ident = identOf(arb);
		assert.equal(ident.name, 'elements');
	});	
	
	it('jsc.constant', ()=>{
		let ident = identOf(jsc.constant);
		assert.equal(ident.name, 'constant');
	});
	
	it('w jsc.constant()', ()=>{
		let arb = wrap(jsc.constant)(1);
		let ident = identOf(arb);
		assert.equal(ident.name, 'constant');
	});
	
	"int8,int16,int32,uint8,uint16,uint32,bool,falsy".split(',').forEach((name)=>{
		it('jsc.'+name, ()=>{
			let ident = identOf(jsc[name]);
			assert.equal(ident.name, name);
		});
	});
	
	"uint52,close,open,openbottom".split(',').forEach((name)=>{
		it(name, ()=>{
			let ident = identOf(prim[name]);
			assert.equal(ident.name, name);
		});
		it(name+'()', ()=>{
			let arb = wrap(prim[name])(1);
			let ident = identOf(arb);
			assert.equal(ident.name, name);
		});
		
	});
	
});

describe('generationSettingsOf', ()=>{
	jsc.property('w jsc.integer()', 'nat', 'nat', 'uint32', (a, b, i)=>{
		if(b-a<=0) return true;
		
		let arb = wrap(jsc.integer)(a,b);
		let settings = generationSettingsOf(arb);
		
		return settings.a === a && settings.b === b && settings.conv(i) === i;
	});
	
	jsc.property('w jsc.number()', 'nat', 'nat', (a, b)=>{
		if(b<a) {
			[b, a] = [a, b];
		};
		if(b===a){
			b *=2;
		}
		
		let arb = wrap(jsc.number)(a,b);
		let settings = generationSettingsOf(arb);
		console.log(a, b);
		console.log(settings.conv(1)-b);
		return settings.a === 0 && settings.b === 0xFFFFFFFF && settings.conv(0)===a && settings.conv(1)===b;
	});
});