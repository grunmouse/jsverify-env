const assert = require('assert');
const jsc = require('jsverify');



const {
	szarray
} = require('../arrays.js');
const preparedForAll = require('../variables.js');


describe('variable', ()=>{

	it('my forall', function(){
		const prop = preparedForAll({n:'integer 2 7'}, '(szarray n number)', '(szarray n number)', 'constant n', {szarray}, (a, b, n)=>{
			return a.length === b.length && b.length === n;
		});
		
		jsc.assert(prop);
	});
});