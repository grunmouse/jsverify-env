const jsc = require('jsverify');
const random = require('./random.js');

const uint52 = jsc.bless({
	generator:()=>{
		return random.randomUInt52();
	}
});

uint52.shrink = jsc.nat.shrink;

const limfloat = (opendown, openup)=>{
	const conv2 = random.uint32ToFloat(opendown, openup);
	return (minsize, maxzise)=>{
		const conv1 = random.expandFloat(minsize, maxzise);
		let arb = jsc.bless({
			generator:()=>{
				return conv2(conv1(random.randomUInt32());
			}
		});
		
		return arb;
	}
};

const close = limfloat(false, false);
const open = limfloat(true, true);
const openbottom = limfloat(true, false);

module.exports = {
	uint52,
	close,
	open
};