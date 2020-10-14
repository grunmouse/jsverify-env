const random = require('./random.js');

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
function wrapArbitrary(factory){
	if(typeof factory === 'function'){
		if(factory.based){
			//Защит от двойного оборачивания
			return factory;
		}
		
		const fun = function(...args){
			const arb = factory(...args);
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

/***
 * Опознаёт arbitrary
 */
function identOf(arb){
	if(arb.factory){
		let name = arbNames.get(arb.factory);
		return {
			type:name,
			args:arb.args
		};
	}
	else{
		let name = arbNames.get(arb);
		return {
			type:name,
			isConst:true
		};
	}
}


module.exports = {
	wrap:wrapArbitrary,
	identOf
};