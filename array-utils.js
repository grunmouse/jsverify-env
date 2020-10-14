
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

module.exports = {
	transposeArrays,
	repeateItems
};