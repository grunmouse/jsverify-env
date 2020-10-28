const prim = require('./primitives.js');

const {
	
	pregenUInt,
	pregenBigUInt
	
} = require('../random/random.js');

const BigIntPacker = require('../convert/bigint-packer.js');

const bless = require('./bless.js');

function tuple(arbs){
	
	if(arbs.every((arb)=>(arb.pregen && arb.conv))){
		let count = arbs.reduce((akk, arb)=>(akk + BigInt(arb.pregen.count)), 0n);
		
		const pregen = pregenBigUInt(count-1);
		
		function conv(value){
			let pack = new BigIntPacker(value);
			
			return arbs.map((arb)=>(
				arb.conv(arb.pregen.T(pack.pop(arb.pregen.count)))
			));
		}
		
		return bless({
			pregen,
			conv
		});
	}
	else{
		function generator(size){
			return arbs.map((arb)=>(arb.generator(size)));
		}
		
		return bless({
			generator
		});
	}
}

module.exports = tuple;