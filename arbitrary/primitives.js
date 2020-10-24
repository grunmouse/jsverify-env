const jsc = require('jsverify');
const random = require('../random/random.js');
const convert = require('../convert/convert-value.js');
const {libwrap, extendWithDefault} = require('./arb-utils.js');

const combine = (a, b)=>((x)=>(b(a(x))));

const bless = require('./bless.js');

const integer = (minsize, maxsize)=>{
	[minsize, maxsize] = convert.ensureIntegerArgs(minsize, maxsize);
	const pregen = random.pregenUInt(maxsize-minsize);
	const conv = convert.offsetValue(minsize, pregen.T);
	
	return bless({
		pregen,
		conv
	});
}

const uint = (maxsize)=>integer(0, maxsize);
const posit = (maxsize)=>integer(1, maxsize);

extendWithDefault(integer);
extendWithDefault(uint);
extendWithDefault(posit);


const limfloat = (opendown, openup)=>{
	const toFloat = convert.uint32ToFloat(opendown, openup);
	
	const pregen = random.pregenBigUInt(0xFFFFFFFF);
	
	const getSettings = (minsize, maxsize)=>(
		{
			pregen:pregen,
			conv:combine(toFloat, convert.expandFloat(minsize, maxsize))
		}
	);
	
	const fun = (minsize, maxzise)=>{
		const {conv} = getSettings(minsize, maxzise);
		let arb = bless({
			pregen,
			conv
		});
		
		return arb;
	}
	
	fun.getSettings = getSettings;
	
	extendWithDefault(fun);
	
	return fun;
};

const i_i = limfloat(false, false);
const o_o = limfloat(true, true);
const o_i = limfloat(true, false);
const i_o = limfloat(false, true);

const ints = {};
[8, 16, 32].forEach((size)=>{
	let full = 1<<size;
	ints['uint' + size] = integer(0, full-1);
	let half = full>>>1;
	ints['int' + size] = integer(-(1<<half), (1<<half)-1);
});

const bool = bless({
	pregen: random.pregenUInt(1),
	conv:(val)=>(!!val)
});

function elements(arr){
	return bless({
		pregen: random.pregenUInt(arr.length - 1),
		conv: (intval)=>(arr[intval])
	});
}

const falsy = elements([false, null, undefined, "", 0, NaN]);

const constants = (value)=>bless({
	generator:()=>(value)
});

const datetime = (from, to)=>{
	from = typeof from !== 'undefined' ? from.valueOf : 1416499879495;
	to = typeof to !== 'undefined' ? to.valueOf() : from + 768000000;
	
	return bless({
		pregen: random.pregenUInt(from, to),
		conv:(x)=>(new Date(x))
	});
}

extendWithDefault(datetime);
	

module.exports = {
	integer,
	"int":integer,
	uint,
	nat:uint,
	posit,
	i_i,
	o_o,
	o_i,
	i_o,
	number:i_o,
	"float":i_o,
	
	bool,
	elements,
	falsy,
	
	...ints
};