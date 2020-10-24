
const prim = require('./primitives.js');
const arrays = require('./arrays.js');

const env = {
	...prim,
	...arrays
};

module.exports = env;