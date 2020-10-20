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
	
	integer,
	
	uniqueRandomInt,
	uniqueAnyRandom
} = require('./random.js');


const increasingSorter = (a,b)=>(+(b>a)-(a>b));
const decreasingSorter = (a,b)=>(+(b<a)-(a<b));
const same = (x)=>(x);

/***
 * Композиция целого числа
 */
const composition = (len, value)=>{
	if(len === 1){
		return [value];
	}
	else if(len === 2){
		let a = integer(1, value-1);
		return [a, value-a];
	}
	
	let pos = uniqueRandomInt(len-1, 1, value-1).sort(increasingSort);
	pos.unshift(0);
	pos.push(value);
	
	let result = [];
	for(let i=0; i<len; ++i){
		result[i] = pos[i+1] + pos[i];
	}
	
	return result;
}

const copmosition0 = (len, value)=>{
	let pos = uniqueRandomInt(len+1, 0, value).sort(increasingSort);

	let result = [];
	for(let i=0; i<len; ++i){
		result[i] = pos[i+1] + pos[i];
	}
	
	return result;
}

const sizedArray = (len, arb)=>{
	if(!arb){
		arb = len;
		len = jsc.nat;
	}
	len = jsc.utils.force(len);
	arb = jsc.utils.force(arb);
	
	return jsc.bless({
		generator:(size)=>{
			let l = typeof len === 'number' ? len : len.generator(size);
			let result = Array.from({length:l}, ()=>(arb.generator(size)));
			return result;
		},
		shrink:(value)=>{
			let arrs = value.map((x)=>(arb.shrink(x)));
			
			if(arrs.every(a=>(a.length===0))){
				return [];
			}
			
			arrs = arrs.map((a,i)=>(a.length > 0 ? a : [value[i]]));

			
			let max = Math.max(...arrs.map((a)=>(a.length)));
			
			arrs = arrs.map((arr)=>repeateItems(arr, max));
			
			let result = transposeArrays(arrs);
			
			return result;
		},
		show:jsc.show.array(arb.show)
	});
};

const uniqueArray = (len, arb)=>{
	if(!arb){
		arb = len;
		len = jsc.nat;
	}
	const {pregen, conv} = generationSettingsOf(arb);
	
	let res = jsc.bless({
		generator:(size)=>{
			let l = typeof len === 'number' ? len : len.generator(size);
			let values = uniqueAnyRandom(l, pregen);
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

function oscill(n, m, a, b, invert){
	if(typeof a === 'boolean'){
		invert = a;
		a = 0;
		b = undefined;
	}
	else if(typeof b === 'boolean'){
		invert = b;
		b = undefined;
	}
	
	let ext = uniqueRandomInt(m, 1, n).sort(increaseSort);
	ext.unshift(0);
	
	let result = [];
	
	let prev = invert ? b : a;
	for(let i = 0; i<m; ++i){
		let count = ext[i+1] - ext[i];
		if(!(i & 1) === invert){
			//Убывающий участок
			let part = uniqueRandomInt(count, a, prev).sort(decreaseSort);
			result[i] = part;
			prev = part[part.length - 1] + 1;
		}
		else{
			//Возрастающий участок
			let part = uniqueRandomInt(count, prev, b).sort(increaseSort);
			result[i] = part;
			prev = part[part.length - 1] - 1;
		}
	}
	
	return [].concat(...result);
}



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