const {
	ensureIntegerArgs,
	ensureFloatArgs,
	ensureFloatLim,
	
	expandFloat,
	uint32ToFloat,
	uint32ToInt,
	
	randomUInt32
} = require('./random.js');

const jsc = require('jsverify');


const arbNames = new Map(
	Object.entries(jsc).map(a=>a.reverse())
);

function uintToElement(elements){
	const len = elements.length;
	return (intval)=>(elements[intval % len]);
}

function extendWithDefault(arb) {
  var def = arb();
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
		extendWithDefault(fun);
		
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
	let factory = arb.factory || arb.based || typeof arb === 'function' && arb;
	
	let args = arb.args || [];
	
	let name = typeof arb !== 'function' && arb.name || factory && arbNames.get(factory) || arbNames.get(arb);

	let {pregen, conv} = factory && factory.getConv && factory.getConv(arb.args) || arb;
	
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
	
	if(ident.conv && ident.conv){
		return ident;
	}
	
	let pregen = randomUInt32, conv = (a)=>(a);
	
	switch(ident.name){
		case "integer":
		case "nat":
		{
			let args = ensureIntegerArgs(...ident.args);
			let [a, b] = args;
			conv = uint32ToInt(a, b);
			break;
		}
		case "int8":
		{
			conv = uint32ToInt(-0x80, 0x7F);
			break;
		}
		case "int16":
		{
			conv = uint32ToInt(-0x8000, 0x7FFF);
			break;
		}
		case "int32":
		{
			conv = uint32ToInt(-0x80000000, 0x7FFFFFFF);
			break;
		}
		case "uint8":
		{
			conv = uint32ToInt(0, 0xFF);
			break;
		}
		case "uint16":
		{
			conv = uint32ToInt(0, 0xFFFF);
			break;
		}
		case "uint32":
		{
			conv = uint32ToInt(0, 0xFFFFFFFF);
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
			const toLimit = uint32ToInt(0, elements.length - 1);
			conv = (intval)=>(elements[toLimit(intval)]);
			break;
		}
		case "bool":
		{
			pregen = ()=>(randomUInt(0,1));
			conv = (intval)=>(!!intval);
			break;
		}
		case "falsy":{
			const elements = [false, null, undefined, "", 0, NaN];

			const toLimit = uint32ToInt(0, 5);
			conv = (intval)=>(elements[toLimit(intval)]);

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
			const toLimit = uint32ToInt(a, b);
			conv = (intval)=>(new Date(toLimit(intval)));
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
	generationSettingsOf
};