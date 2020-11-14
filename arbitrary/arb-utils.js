const {
	pregenUInt
} = require('../random/random.js');

const {
	ensureIntegerArgs,
	ensureFloatArgs,
	
	expandFloat,
	uint32ToFloat,
	offsetInt
} = require('../convert/convert-value.js');

const jsc = require('jsverify');


const arbNames = new Map(
	Object.entries(jsc).map(a=>a.reverse())
);


function extendWithDefault(arb) {
  var def = arb();
  arb.pregen = def.pregen;
  arb.conv = def.conv;
  arb.generator = def.generator;
  arb.shrink = def.shrink;
  arb.show = def.show;
  arb.smap = def.smap;
}

/***
 * Запоминает функцию и аргументы, с которыми она вызывалась
 */
function wrapArbitrary(factory, name){
	if(typeof factory === 'function'){
		if(factory.based){
			//Защит от двойного оборачивания
			return factory;
		}
		
		const fun = function(...args){
			const arb = factory(...args);
			arb.name = name;
			arb.factory = factory;
			arb.args = args;
			return arb;
		};
		try{
			extendWithDefault(fun);
		}
		catch(e){
		}
		
		fun.based = factory;
		
		
		return fun;
	}
	else{
		return factory;
	}
}


function wrapSelf(factory, name){
	if(typeof factory === 'function'){
		const fun = function(...args){
			const arb = factory(...args);
			arb.name = name;
			arb.factory = fun;
			arb.args = args;
			return arb;
		};
		
		extendWithDefault(fun);
		
		fun.based = factory;
		arbNames.set(fun, name);
		return fun;
	}
	else{
		factory.name = name;
		return factory;
	}
}

/***
 * Опознаёт arbitrary
 */
function identOf(arb){
	/* 
		Находим фабрику, она у экзмпляра лежит в factory, у обёртки - в based, 
		кроме того, на вход могла поступить сама фабрика
	*/
	let factory = arb.factory || arb.based || typeof arb === 'function' && arb;
	
	let args = arb.args || [];
	
	/*
		У экземпляра должно быть свойство name, в противном случае пробуем искать в базе имён ссылку на 
		фабрику или на сам экземпляр
	*/
	let name = typeof arb !== 'function' && arb.name || factory && arbNames.get(factory) || arbNames.get(arb);
	
	/*
		Пробуем получить настройки генерации из экземлпляра или фабрики
	*/
	let {pregen, conv} = arb;
	if((!pregen || !conv) && factory && factory.getSettings){
		({pregen, conv} = factory.getSettings(arb.args));
	}
	
	return {
		name:name,
		args:args,
		pregen:pregen,
		conv:conv
	};
	
}

const combine = (a, b)=>((x)=>(b(a(x))));


/***
 * Возвращает установки для генерации случайных значений, соответствующих arbitrary
 * @param arb : arbitrary
 * @return {a:Int32, b:Int32, conv:(Int32)=>(any)}
 */
function generationSettingsOf(arb){
	const ident = identOf(arb);
	
	if(ident.pregen && ident.conv){
		return ident;
	}
	
	let pregen = pregenUInt(), conv = (a)=>(a);
	
	switch(ident.name){
		case "integer":
		case "nat":
		{
			let args = ensureIntegerArgs(...ident.args);
			let [a, b] = args;
			pregen = pregenUInt(b-a);
			conv = offsetInt(a);
			break;
		}
		case "int8":
		{
			pregen = pregenUInt(0xFF);
			conv = offsetInt(-0x80);
			break;
		}
		case "int16":
		{
			pregen = pregenUInt(0xFFFF);
			conv = offsetInt(-0x8000);
			break;
		}
		case "int32":
		{
			conv = offsetInt(-0x80000000);
			break;
		}
		case "uint8":
		{
			pregen = pregenUInt(0, 0xFF);
			break;
		}
		case "uint16":
		{
			pregen = pregenUInt(0, 0xFFFF);
			break;
		}
		case "uint32":
		{
			break;
		}
		case "number":
		{
			let limits = ensureFloatArgs(...ident.args);
			
			conv = combine(uint32ToFloat(), expandFloat(...limits));
			break;
		}
		case "elements":
		{
			const elements = ident.args[0];
			pregen = pregenUInt(elements.length - 1)
			conv = (intval)=>(elements[intval]);
			break;
		}
		case "bool":
		{
			pregen = pregenUInt(1);
			conv = (intval)=>(!!intval);
			break;
		}
		case "falsy":{
			const elements = [false, null, undefined, "", 0, NaN];

			pregen = pregenUInt(5);
			conv = (intval)=>(elements[intval]);

			break;
		}
		case "constant":
		{
			const val = ident.args[0];
			
			pregen = ()=>(0);
			
			conv = ()=>(val);
			break;
		}
		case "datetime":
		{
			let a,b;
			if(ident.args.length === 2){
				[a,b] = ident.args.map((date)=>(date.valueOf()));
			}
			else{
				a = 1416499879495; //jsverify legacy
				b = 1416499879495+768000000; //jsverify legacy
			}
			pregen = pregenUInt(b);
			conv = (intval)=>(new Date(intval+a));
			break;
		}

		default:
		{
			throw new Error('Arbitrary is not decomposable');
		}
		
	}
	
	return {pregen, conv};
}



module.exports = {
	wrap:wrapArbitrary,
	libwrap:wrapSelf,
	identOf,
	generationSettingsOf,
	extendWithDefault
};