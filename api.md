# API

```
{
	env:{
		integer,
		"int":integer,
		uint,
		nat:uint,
		posit,
		i_i,
		o_o,
		o_i,
		i_o,
		number:i_o,
		"float":i_o,
		
		bool,
		elements,
		falsy,
		
		int8,
		int16,
		int32,
		uint8,
		uint16,
		uint32,
		
		array: sizedArray,
		nearray: (arb)=>(sizedArray(prim.posit(), arb)),
		szarray: sizedArray,
		uarray: uniqueArray,
		incarray: increasingArray,
		decarray: decreasingArray,
		nincarray: nonincreasingArray,
		ndecarray: nondecreasingArray		
	},
	prepForAll,
	bless,
	convert:{
		BigIntPacker,
		
		uint32ToFloat,
		expandFloat,
		offsetInt,
		offsetBigInt,
		offsetValue,
		
		ensureIntegerArgs,
		ensureFloatArgs,
		ensureFloatLim,
		
		increasingSorter,
		decreasingSorter,
		makeSorterBy,
		
		transposeArrays,
		repeateItems
		
	},
	random:{
		randomUInt,
		randomBigUInt,
		randomBool,
		
		pregenUInt,
		pregenBigUInt,
		
		uniqueRandom
	}
}
```

## env

Окружение для передачи в метод jsc.property. Содержит ссылки на фабрики arbitrary.

- integer(min=0, max=0xFFFFFFFF) - целое число, в диапазоне min..max;
- integer(max=0xFFFFFFFF) - целое число, в диапазоне 0..max;
- int - псевдоним integer;
- uint(max=0xFFFFFFFF) - целое число, в диапазоне 0..max;
- nat - псевдоним uint;
- posit(max=0xFFFFFFFF) - целое число, в диапазоне 1..max;
- i_i(min=0, max=1) - число с плавающей точкой в диапазоне [min, max];
- o_o(min=0, max=1) - число с плавающей точкой в диапазоне (min, max);
- o_i(min=0, max=1) - число с плавающей точкой в диапазоне (min, max];
- i_o(min=0, max=1) - число с плавающей точкой в диапазоне \[min, max);
- number(min=0, max=1) - число с плавающей точкой в диапазоне \[min, max);
- float(min=0, max=1) - число с плавающей точкой в диапазоне \[min, max);
- bool - булево значение;
- elements(arr) - случайный элемент массива;
- falsy - значение, приводящееся к false ([false, null, undefined, "", 0, NaN]);
- int8 - целое число в диапазоне -128..127;
- int16 - целое число в диапазоне -32768..32767;
- int32 - целое знаковое 32 битное число;
- uint8 - целое число в диапазоне 0..255;
- uint16 - целое число в диапазоне 0..65535;
- uint32 - целое беззнаковое 32 битное число;
- array(len, arb) - массив размера len, типа arb, len тоже может быть arbitrary;
- array(arb) - массив типа arb;
- nearray(arb) - непустой массив типа arb;
- szarray - псевдоним array;
- uarray(len, arb) - массив размера len, уникальных значений типа arb, len тоже может быть arbitrary;
- uarray(arb) - массив уникальных значений типа arb;
- incarray(len, arb) - массив размера len, уникальных значений типа arb, расположенных по возрастанию;
- decarray(len, arb) - массив размера len, уникальных значений типа arb, расположенных по убыванию;
- nincarray(len, arb) - массив размера len, значений типа arb, расположенных по невозрастанию;,
- ndecarray(len, arb) - массив размера len, значений типа arb, расположенных по неубыванию;

## prepForAll(prev, ...arbs, env, callback)

Функция, подобная jsc.property, но принимающая дополнительный первый аргумент.

@param prev : Object

Этот парамет содержит карту значений, которые должны быть вычислены первыми. Они потом доступны по именам в dsl описывающем arbs.

## bless(arb)

Функция, расширяющая объект arbitrary стандартными свойствами и методами. Отличается от jsc.bless тем, что результат совместим с механизмом генерации массивов уникальных значений.