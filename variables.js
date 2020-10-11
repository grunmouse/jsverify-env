const jsc = require('jsverify');


function preparedForAll(prev, ...args){
	let block = args.pop();
	let env, gens;
	
	var lastgen = args[args.length - 1];

	if (typeof lastgen !== "string" && !lastgen.generator) {
		env = args.pop();
	} 
	
	gens = args;
  
	let vars = [...Object.entries(prev)].map(([name, value])=>{
		if(typeof value === 'string'){
			value = jsc.compile(value, env);
		}
		return [name,value];
	});
	
	return function(size){
		let values = jsc.utils.pairArrayToDict(vars.map(([name, value])=>{
			if(value.generator){
				value = value.generator(size);
			}
			return [name, value];
		}));
		let local = jsc.utils.merge(env, values);

		let prop = jsc.forall(...gens, local, block);
		
		return prop(size);
	}
};

module.exports = preparedForAll;