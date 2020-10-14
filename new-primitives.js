const jsc = require('jsverify');
const random = require('./random.js');
const {libwrap} = require('./arb-utils.js');

const uint52 = ()=>jsc.bless({
	generator:()=>{
		return random.randomUInt52();
	},
	shrink: jsc.nat.shrink
});


const limfloat = (opendown, openup)=>{
	const conv2 = random.uint32ToFloat(opendown, openup);
	const fun = (minsize, maxzise)=>{
		const conv1 = random.expandFloat(minsize, maxzise);
		let arb = jsc.bless({
			generator:()=>{
				return conv2(conv1(random.randomUInt32()));
			}
		});
		
		return arb;
	}
	
	return fun;
};

const close = limfloat(false, false);
const open = limfloat(true, true);
const openbottom = limfloat(true, false);

module.exports = {
	uint52:libwrap(uint52, 'uint52'),
	close:libwrap(close, 'close'),
	open:libwrap(open, 'open'),
	openbottom:libwrap(openbottom, 'openbottom')
};