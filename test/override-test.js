var jsc = require("jsverify");
var assert = require("assert");
const {wrap, identOf} = require('../arb-utils.js');

const env = {w:wrap, nat:wrap(jsc.nat)};


describe("override nat", function () {
    it("without arguments", function () {
	  let arb = jsc.compile('nat', env);
	  assert.equal(identOf(arb).name, 'nat', 'ident');
	  assert.deepEqual(identOf(arb).args, [], 'args');
      jsc.assert(jsc.forall(wrap(jsc.nat), function (n) {
        return Math.round(n) === n && n >= 0;
      }));
    });

    it("with maxsize", function () {
	  let arb = jsc.compile('nat 5', env);
	  assert.equal(identOf(arb).name, 'nat', 'ident');
	  assert.deepEqual(identOf(arb).args, [5], 'args');
      jsc.assert(jsc.forall(arb, function (i) {
        return typeof i === "number" && Math.abs(i) <= 5, i>=0;
      }));
    });

});