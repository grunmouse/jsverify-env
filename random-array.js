const {
	integer,
	randomUInt32,
	randomUInt52,
	randomBigUInt64,
	randomBigUInt,
	
	number,
	closeFloat,
	openFloat,
	openupFloat,
	opendownFloat,
	
	uint32ToFloat,
	expandFloat,
	
	uniqueRandomInt,
	uniqueRandomFloat
} = require('./random.js');


/***
 * @function monoton
 * 
 * @return Array<Int32> - возрастает
 */
function monoton(n, a, b){
	let arr = uniqueRandomInt(n, a, b);
	
	arr.sort((a,b)=>(a-b));
	
	return arr;
}

/***
 * @function halfmonoton
 * 
 * @return Array<Int32> - неубывает
 */
function halfmonoton(n, a, b){
	let arr = Array.from({length:n}, ()=>(integer(a, b)));
	
	arr.sort((a,b)=>(a-b));
	
	return arr;
}


/**
 * @function 
 * @param n - количество элементов
 * @param m - количество участков монотонности
 * @param a - нижний предел значений
 * @param b - верхний предел значений
 * @param invert : Boolean 
 * @return Array<Int32> функция, которая имеет несколько участков монотонности
 */
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
	
	let ext = monoton(m, 1, n);
	
	let result = [];
	
	let prev = invert ? b : a;
	for(let i = 0; i<m; ++i){
		let count = ext[i] - ext[i-1];
		if(!(i & 1) === invert){
			//Убывающий участок
			let part = monoton(count, a, prev);
			part.reverse();
			result[i] = part;
			prev = part[part.length - 1] + 1;
		}
		else{
			//Возрастающий участок
			let part = monoton(count, prev, b);
			result[i] = part;
			prev = part[part.length - 1] - 1;
		}
	}
	
	return [].concat(...result);
}


module.exports = {
	monoton,
	halfmonoton,
	oscill
};