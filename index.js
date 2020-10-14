const jsc = require('jsverify');

const prepForAll = require('./variables.js');

const {
	szarray,
	uarray,
	incarray,
	decarray,
	nincarray,
	ndecarray
} = require('./arrays.js');

const utils = jsc.utils.merge(
	require('./arb-utils.js'),
	require('./array-utils.js')
);

module.exports = {
	prepForAll,
	
	utils:jsc.utils.merge(utils),
	szarray
};