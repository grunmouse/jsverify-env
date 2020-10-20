const jsc = require('jsverify');
const random = require('./random.js');
const {libwrap} = require('./arb-utils.js');

const combine = (a, b)=>((x)=>(b(a(x))));

const uint52 = ()=>jsc.bless({
	generator:()=>{
		return random.randomUInt52();
	},
	shrink: jsc.nat.shrink
});


const limfloat = (opendown, openup)=>{
	const toFloat = random.uint32ToFloat(opendown, openup);
	
	const pregen = random.randomUInt32;
	
	const getConv = (minsize, maxsize)=>(
		{
			pregen:pregen,
			conv:combine(random.expandFloat(minsize, maxsize), toFloat)
		}
	);
	
	const fun = (minsize, maxzise)=>{
		const conv = getConv(minsize, maxzise);
		let arb = jsc.bless({
			generator:()=>{
				return conv(pregen());
			}
		});
		arb.conv = conv;
		arb.pregen = pregen;
		
		return arb;
	}
	
	fun.getConv = getConv;
	
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