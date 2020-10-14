const jsc = require('jsverify');

/*
 Дополнительные функции должны базироваться на библиотечных, т.к. необходимо общее состояние 
 */
const random = jsc.random;

/*
В потрохах функций такая логика (обобщённо):

number 
(a,b)=>(a + this.randomUInt32() / 0x100000000 * (b-a));
Значит эта функция работает в пределах 32 знаков мантиссы

integer
(a,b)=>(a + this.randomUInt32() % (b - a + 1))

Если a==0, b >= 0xFFFFFFFF, то остаток будет равен integer(a, b) = this.randomUInt32();

И, сволочь, неравномерно распределён!

*/

const intMask = (size)=>((1<<size)-1); //До 31

const bigintMask = (size)=>((1n<<BigInt(size))-1n);

const MASK32 = 0xFFFFFFFF; //Часто встречается
const MASK20 = 0xFFFFF;
const OVER32 = MASK32+1;

const biginteger = (a,b)=>(BigInt(random.integer(Number(a),Number(b))));

const randomUInt32 = ()=>(random.integer(0, MASK32));

function ensureIntegerArgs(a, b){
	if(typeof b == 'undefined'){
		b = a;
		a = 0;
		if(typeof b == 'undefined'){
			b = MASK32;
		}
	}
	
	return [a, b];
}

function ensureFloatArgs(a, b){
	if(typeof b == 'undefined'){
		b = a;
		a = 0;
		if(typeof b == 'undefined'){
			b = 1;
		}
	}

	return [a, b];
}

function ensureFloatLim(opendown, openup){
	opendown = (opendown === true);
	openup = (openup !== false);
	
	return [opendown, openup];
}

function randomUInt(a, b){
	
	[a, b] = ensureIntegerArgs(a, b);

	return random.integer(a, b);
}

function randomBigUInt(len){
	len = BigInt(len);
	let parts = len / 32n; //Деление целочисленное, это очень удобно
	let head = len % 32;
	
	let result = head && bigniteger(0, bigintMask(head));
	
	for(let i=0; i<parts; ++i){
		result = (result<<32) | bigniteger(0, MASK32);
	}
	
	return result;
}


const randomUInt52 = ()=>(Number((biginteger(0,MASK20)<<32n)|biginteger(0,MASK32)));
const randomBigUInt64 = ()=>((biginteger(0,MASK32)<<32n)|biginteger(0,MASK32));

/***
 * @function uint32ToFloat
 * @param opendown? : Boolean=false - открытый снизу
 * @param openup? : Boolean=true - открытый снизу
 * @return Function<number, number> - преобразует целое число [0, 0xFFFFFFFF] в действительное 0..1 с принятым включением пределов
 */
function uint32ToFloat(opendown, openup){
	opendown = (opendown === true);
	openup = (openup !== false);
	const a = 0 + opendown;
	const d = MASK32 + openup + a;

	return (intval)=>((a+intval)/d);
}

/***
 * @function expandFloat
 * @param a
 * @param b
 * @return Function<number, number> - преобразует число из отрезка [0;1] в отрезок [a;b]
 */
function expandFloat(a, b){
	return (value)=>(a + value*(b-a));
}

/***
 * Создаёт генератор чисел с предустановленным включением пределов
 */
function makerFloat(convetrer){
	return ()=>(convetrer(random.integer(0, MASK32)));
}




/***
 * @function
 * Случайное число на [0;1]
 */
const closeFloat = makerFloat(uint32ToFloat(false, false));


/***
 * Случайное число на (0;1)
 */
const openFloat = makerFloat(uint32ToFloat(true, true));


/***
 * Случайное число на [0;1)
 */
const openupFloat = makerFloat(uint32ToFloat(false, true));


/***
 * Случайное число на (0;1]
 */
const opendownFloat = makerFloat(uint32ToFloat(true, false));


/***
 * Представляет собой числовой массив, в котором переставлены числа
 */
class PermutatedTail extends Map{
	get(index){
		if(this.has(index)){
			return super.get(index);
		}
		else{
			return index;
		}
	}
	
	swap(a, b){
		let A = this.get(a);
		let B = this.get(b);
		
		this.set(b, A);
		this.set(a, B);
	}
}

/***
 * Отбирает из диапазона [a;b] n уникальных значений
 */
function uniqueRandomInt(n, a, b){
	let tail = new PermutatedTail();
	
	[a, b] = ensureIntegerArgs(a, b);
	
	let result = [];
	for(let i = 0; i<n; ++i){
		let k = random.integer(a, b);
		result.push(tail.get(k));
		tail.swap(k, a);
		++a;
	}
	
	return result;
}

function uniqueRandomBigInt(n, a, b){
	let tail = new PermutatedTail();
	
	if(!b){
		b = a;
		a = 0;
	}
	
	let result = [];
	for(let i = 0; i<n; ++i){
		let k = random.integer(a, b);
		result.push(tail.get(k));
		tail.swap(k, a);
		++a;
	}
	
	return result;
}


module.exports = {
	integer:randomUInt,
	randomUInt32,
	randomUInt52,
	randomBigUInt64,
	randomBigUInt,
	
	closeFloat,
	openFloat,
	openupFloat,
	opendownFloat,
	
	uint32ToFloat,
	expandFloat,
	
	ensureIntegerArgs,
	ensureFloatArgs,
	ensureFloatLim,
	
	uniqueRandomInt
	
};