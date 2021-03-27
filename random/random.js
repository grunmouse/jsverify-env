const jsc = require('jsverify');

const {
	MASK32,
	MASK20,
	OVER32,
	BMASK32,
	
	intMask,
	bigintMask,
	over2
} = require('./binary.js');

/*
 Дополнительные функции должны базироваться на библиотечных, т.к. необходимо общее состояние.
 Нельзя использовать random.integer напрямую, т.к. для отладки приходится оборачивать метод
 */
const random = jsc.random;

function biginteger(b){
	if(!b){
		return 0;
	}
	return BigInt(random.integer(0,Number(b)));
}

function randomUInt(b){
	if(!b){
		return 0;
	}
	
	b = b || MASK32;

	return random.integer(0, b);
}

function randomBool(tr, of){
	return random.integer(0, of)<tr;
}


function randomBigUIntBySize(len){
	len = BigInt(len);
	let parts = len / 32n; //Деление целочисленное, это очень удобно
	let head = len % 32n;
	let result = head && biginteger(bigintMask(head));
	
	for(let i=0; i<parts; ++i){
		result = ((result<<32n) | biginteger(MASK32));
	}
	
	return result;
}

function randomBigUInt(b){
	let over = over2(b);
	
	let value = randomBigUIntBySize(over);
	
	return value % b;
}

/**
 * @typedef Pregen<T> : Function<(min=0, [size])=>(T)> - Функция генерации дискретных случайных значений
 * @property T : Function - конструктор используемого типа данных - Number или BigInt
 * @property limit : T - максимальное генерируемое значение
 * @property count : T - число возможных значений count = limit+1
 * @property bigint? : Boolean = T===BigInt - признак, что функция возвращает BigInt
 * @param min : T - минимальное генерируемое значение значение
 * @param size? : Number - необязательный параметр генерации, может использоваться в jsverify
 * @return T - сгенерированное случайное значение в диапазоне [min; limit] & Z
 *
 * 
 */

/**
 * @function pregenUInt
 * @param b? : Int32
 * @return Pregen<Int32>{limit = b}
 */
function pregenUInt(b=MASK32){
	const pregen = (a=0)=>(randomUInt(b-a)+a);
	pregen.limit = b;
	pregen.count = b+1;
	pregen.T = Number;
	
	return pregen;
}

/**
 * @function pregenBigUInt
 * @param b : Int32|BigInt
 * @return Pregen<BigInt>{limit = b}
 */
function pregenBigUInt(b){
	b = BigInt(b);
	const pregen = (a=0n)=>{
		a = BigInt(a);
		return randomBigUInt(b-a)+a;
	};
	pregen.limit = b;
	pregen.count = b+1n;
	pregen.T = BigInt;
	pregen.bigint = true;
	return pregen;
}

module.exports = {
	randomUInt,
	randomBigUInt,
	randomBigUIntBySize,
	randomBool,
	
	pregenUInt,
	pregenBigUInt
};