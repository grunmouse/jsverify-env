const {
	ensureIntegerArgs,
	ensureFloatArgs,
	ensureFloatLim,
	
	expandFloat,
	uint32ToFloat
} = require('./random.js');

const jsc = require('jsverify');


const arbNames = new Map(
	Object.entries(jsc).map(a=>a.reverse())
);

function uintToElement(elements){
	const len = elements.length;
	return (intval)=>(elements[intval % len]);
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
	if(arb.factory){
		let name = arb.name || arbNames.get(arb.factory);
		return {
			name:name,
			args:arb.args
		};
	}
	else{
		let name = arbNames.get(arb);
		return {
			name:name,
			isConst:true
		};
	}
}

const combine = (a, b)=>((x)=>(b(a(x))));


/***
 * Возвращает установки для генерации случайных значений, соответствующих arbitrary
 * @param arb : arbitrary
 * @return {a:Int32, b:Int32, conv:(Int32)=>(any)}
 */
function generationSettingsOf(arb){
	const ident = identOf(arb);
	
	let a, b, conv = (a)=>(a);;
	
	switch(ident.name){
		case "integer":
		case "nat":
		{
			[a, b] = ensureIntegerArgs(...ident.args);
			break;
		}
		case "int8":
		{
			a = -128; b = 127;
			break;
		}
		case "int16":
		{
			a = -0x8000; b = 0x7FFF;
			break;
		}
		case "int32":
		{
			a = -0x80000000; b = 0x7FFFFFFF;
			break;
		}
		case "uint8":
		{
			a = 0; b = 256;
			break;
		}
		case "uint16":
		{
			a = 0; b = 0xFFFF;
			break;
		}
		case "uint32":
		{
			a = 0; b = 0xFFFFFFFF;
			break;
		}
		case "number":
		{
			let limits = ensureFloatArgs(...ident.args);
			a = 0; b = 0xFFFFFFFF;
			
			conv = combine(uint32ToFloat(), expandFloat(...limits));
			break;
		}
		case "elements":
		{
			const elements = ident.args[0];
			a = 0; b = elements.length - 1;
			
			conv = (intval)=>(elements[intval]);
			break;
		}
		case "bool":
		{
			a = 0; b = 1;
			conv = (intval)=>(!!intval);
			break;
		}
		case "falsy":{
			const elements = [false, null, undefined, "", 0, NaN];
			a = 0; b = 5;

			conv = (intval)=>(elements[intval]);
			break;
		}
		case "constant":
		{
			const val = ident.args[0];
			a = 0; b = 0;
			conv = ()=>(val);
			break;
		}
		case "datetime":
		{
			if(ident.args.length === 2){
				[a,b] = ident.args.map((date)=>(date.valueOf()));
			}
			else{
				a = 1416499879495; //jsverify legacy
				b = 1416499879495+768000000; //jsverify legacy
			}
			conv = (val)=>(new Date(val));
			break;
		}
		//New primitives
		case "close":
		{
			let limits = ensureFloatArgs(...ident.args);
			[a, b] = ensureIntegerArgs();
			conv = combine(uint32ToFloat(false, false), expandFloat(...limits));
			break;
		}
		case "open":
		{
			let limits = ensureFloatArgs(...ident.args);
			[a, b] = ensureIntegerArgs();
			conv = combine(uint32ToFloat(true, true), expandFloat(...limits));
			break;
		}
		case "openbottom":
		{
			let limits = ensureFloatArgs(...ident.args);
			[a, b] = ensureIntegerArgs();
			conv = combine(uint32ToFloat(true, false), expandFloat(...limits));
			break;
		}
	}
	
	return {a, b, conv};
}



module.exports = {
	wrap:wrapArbitrary,
	libwrap:wrapSelf,
	identOf,
	generationSettingsOf
};