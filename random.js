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

const biginteger = (b)=>(BigInt(random.integer(0,Number(b))));

const randomUInt32 = ()=>(random.integer(0, MASK32));

function randomUInt(b){
	
	b = b || MASK32;

	return random.integer(0, b);
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


const randomUInt52 = ()=>(Number((biginteger(MASK20)<<32n)|biginteger(MASK32)));
const randomBigUInt64 = ()=>((biginteger(MASK32)<<32n)|biginteger(MASK32));

const randomBigUInt32 = ()=>(BigInt(randomUInt32()));

function pregenUInt(b=MASK32){
	const pregen = (a=0)=>(randomUInt(b-a)+a);
	pregen.limit = b;
	
	return pregen;
}

function pregenBigUInt(b){
	b = BigInt(b);
	const pregen = (a=0n)=>{
		a = BigInt(a);
		return randomBigUInt(b-a)+a;
	};
	pregen.limit = b;
	pregen.bigint = true;
	return pregen;
}

module.exports = {
	randomUInt,
	randomUInt32,
	randomUInt52,
	
	randomBigUInt32,
	randomBigUInt64,
	
	randomBigUInt,
	
	pregenUInt,
	pregenBigUInt
};