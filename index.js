const jsc = require('jsverify');

const prepForAll = require('./variables.js');

const {
	utils,
	szarray
} = require('./arrays.js');

module.exports = {
	prepForAll,
	
	utils:jsc.utils.merge(utils),
	szarray
};