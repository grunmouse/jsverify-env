const jsc = require("jsverify");
const {
	transposeArrays,
	repeateItems
} = require('./array-utils.js');
const {
	identOf,
	generationSettingsOf
} = require('./arb-utils.js');

const {
	uint32ToFloat,
	expandFloat,
	
	ensureIntegerArgs,
	ensureFloatArgs,
	
	randomUInt,
	
	pregenUInt,
	pregenBigUInt
	
} = require('./random.js');

const {
	uniqueRandomInt,
	uniqueRandom
} = require('./unique-random.js');

const bless = require('./bless.js');


const increasingSorter = (a,b)=>(+(b>a)-(a>b));
const decreasingSorter = (a,b)=>(+(b<a)-(a<b));
const same = (x)=>(x);

const sizedArray = (len, arb)=>{
	if(!arb){
		arb = len;
		len = jsc.nat;
	}
	let sett = generationSettingsOf(arb);
	len = jsc.utils.force(len);
	
	arb = jsc.utils.force(arb);
	
	let res = {};
	if(typeof len === 'number' && sett.pregen){
		let valueSize = BigInt(sett.pregen.limit)+1n;
		let limit = valueSize ** BigInt(len) - 1n;;
		//console.log(limit);
		const itemConv = sett.pregen.bigint ? sett.conv : (x)=>sett.conv(Number(x));
		
		res.pregen = pregenBigUInt(limit);
		res.conv = (value)=>{
			let result = [];
			for(let i = 0; i<len; ++i){
				result[i] = value % valueSize;
				value = value / valueSize;
			}
			result = result.map(itemConv);
			return result;
		}
	}
	else{
		res.generator = (size)=>{
			let l = typeof len === 'number' ? len : len.generator(size);
			let result = Array.from({length:l}, ()=>(arb.generator(size)));
			return result;
		};
	}
	
	res.shrink = (value)=>{
		let arrs = value.map((x)=>(arb.shrink(x)));
		
		if(arrs.every(a=>(a.length===0))){
			return [];
		}
		
		arrs = arrs.map((a,i)=>(a.length > 0 ? a : [value[i]]));

		
		let max = Math.max(...arrs.map((a)=>(a.length)));
		
		arrs = arrs.map((arr)=>repeateItems(arr, max));
		
		let result = transposeArrays(arrs);
		
		return result;
	};
	
	res.show = jsc.show.array(arb.show)
	return bless(res);
};

const uniqueArray = (len, arb)=>{
	if(!arb){
		arb = len;
		len = jsc.nat;
	}
	//arb = jsc.utils.force(arb);
	//console.log(arb);
	const {pregen, conv} = generationSettingsOf(arb);
	if(!pregen || !conv){
		throw new Error('Arbitrary ' + arb + ' does not support to uniquely!');
	}
	
	let res = bless({
		generator:(size)=>{
			let l = typeof len === 'number' ? len : len.generator(size);
			let values = uniqueRandom(l, pregen);
			
			let result = values.map(conv);
			return result;
		}
	});
	
	return res;

};


const increasingArray = (len, arb)=>{
	return uniqueArray(len, arb).smap((arr)=>(arr.sort(increasingSorter)), same);
};

const decreasingArray = (len, arb)=>{
	return uniqueArray(len, arb).smap((arr)=>(arr.sort(decreasingSorter)), same);
};

const nonincreasingArray = (len, arb)=>{
	return sizedArray(len, arb).smap((arr)=>(arr.sort(decreasingSorter)), same);
};

const nondecreasingArray = (len, arb)=>{
	return sizedArray(len, arb).smap((arr)=>(arr.sort(increasingSorter)), same);
};


module.exports = {
	utils:{
		transposeArrays,
		repeateItems
	},
	szarray: sizedArray,
	uarray: uniqueArray,
	incarray: increasingArray,
	decarray: decreasingArray,
	nincarray: nonincreasingArray,
	ndecarray: nondecreasingArray
};