const jsc = require("jsverify");

/**
 * Транспонировать массив массивов, полагая, что они одной длины
 */
function transposeArrays(data){
	let m = data.length, n = data[0].length;
	let result = Array.from({length:n}, ()=>([]));
	
	for(let i = 0; i<n; ++i){
		for(let j = 0; j<m; j++){
			result[i][j] = data[j][i];
		}
	}
	
	return result;
}

/**
 * Удлинить массив до заданного значения, размножая его элементы, но сохраняя порядок
 */
function repeateItems(arr, nlen){
	let len = arr.length;
	if(len === nlen){
		return arr;
	}
	let mul = nlen/len;
	let result = [];
	for(let i=0; i<nlen; ++i){
		let k = Math.floor(i/mul);
		result[i] = arr[k];
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
	})
};

module.exports = {
	utils:{
		transposeArrays,
		repeateItems
	},
	szarray: sizedArray
};