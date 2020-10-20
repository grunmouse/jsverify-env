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
const BMASK32 = 0xFFFFFFFFn;

const biginteger = (a,b)=>(BigInt(random.integer(Number(a),Number(b))));

const randomUInt32 = ()=>(random.integer(0, MASK32));

/***
 * Исправляет верхний и нижний целый предел
 */
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

/***
 * Исправляет верхний и нижний числовой предел
 */
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

/***
 * Исправляет статус включения верхнего и нижнего пределов
 */
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
	let head = len % 32n;
	
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

	return (intval)=>((a + intval)/d);
}

/***
 * @function expandFloat
 * @param a
 * @param b
 * @return Function<number, number> - преобразует число из отрезка [0;1] в отрезок [a;b]
 */
function expandFloat(a, b){
	[a,b] = ensureFloatArgs(a, b);
	return (value)=>(a + value*(b-a));
}

function uint32ToInt(a, b){
	[a, b] = ensureIntegerArgs(a, b);
	
	let toFloat = uint32ToFloat();
	let expand = expandFloat(a, b+1);
	
	return (intval)=>(Math.floor(expand(toFloat(intval))));
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
 * Представляет собой упорядоченное множество целых неотрицательных чисел, которые
 * первоначально стоят по порядку, под индексами, равными значению,
 * но их можно обменивать местами методом
 */
class PermutatedTail extends Map{
	/**
	 * Метод получения числа по индексу
	 */
	get(index){
		if(this.has(index)){
			return super.get(index);
		}
		else{
			return index;
		}
	}
	
	/**
	 * Метод обмена позиций во множестве значениями
	 * @param a - индекс первого числа
	 * @param b - индекс второго числа
	 */
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

function uniqueRandomBigInt(n, len){
	let tail = new PermutatedTail();

	let result = [];
	let a = 0n;
	for(let i = 0; i<n; ++i){
		let k = randomBigUInt(len);
		result.push(tail.get(k));
		tail.swap(k, a);
		++a;
	}
	
	return result;
}

function uniqueAnyRandom(n, gen){
	let tail = new PermutatedTail();

	let result = [];
	for(let i = 0; i<n; ++i){
		let k = gen();
		result.push(tail.get(k));
		let alt = typeof k === 'biginy' ? BigInt(i) : i;
		tail.swap(k, alt);
	}
	
	return result;
}


function uniqueRandomIntPoints(n, d){
	let len = 32*d;
	let data = uniqueRandomBigInt(n, len);
	
	let points = data.map((val)=>{
		let p = new Array(d);
		for(i=0n; i<d; ++i){
			let shift = 32n*d;
			p[i] = Number((value >> shift) & BMASK32);
		}
		return p;
	});
	
	return points;
}

const randomBigUInt32 = ()=>(BigInt(randomUInt32()));

module.exports = {
	integer:randomUInt,
	randomUInt32,
	randomUInt52,
	
	randomBigUInt32,
	randomBigUInt64,
	
	randomBigUInt,
	
	closeFloat,
	openFloat,
	openupFloat,
	opendownFloat,
	
	uint32ToFloat,
	expandFloat,
	uint32ToInt,
	
	ensureIntegerArgs,
	ensureFloatArgs,
	ensureFloatLim,
	
	uniqueRandomInt,
	uniqueRandomBigInt,
	uniqueAnyRandom,
	uniqueRandomIntPoints
	
};