var jsc = require("jsverify");
var assert = require("assert");
const {wrap} = require('../arb-utils.js');

const env = {w:wrap};


describe("primitive arbitraries", function () {
  describe("wrap falsy", function () {
    const arb = wrap(jsc.falsy);
	it("wrap falsy - as same", ()=>{
		assert.equal(arb, jsc.falsy);
	});
	
    it("wrap falsy", function () {
      jsc.assert(jsc.forall(arb, function (x) {
        return !x;
      }));
    });

    it("wrap falsy, dsl", function () {
      jsc.assert(jsc.forall("w falsy", env, function (x) {
        return !x;
      }));
    });

  });

  describe("wrap integer", function () {
    const wrapped = wrap(jsc.integer);
    it("use without args", function () {
	  let arb = wrapped();
	  assert.equal(arb.factory, jsc.integer, 'factory');
	  assert.deepEqual(arb.args, [], 'args');
      jsc.assert(jsc.forall(arb, function (i) {
        return Math.round(i) === i;
      }));
    });

    jsc.property("with maxsize", "nat", function (n) {
		let arb = wrapped(n);
	  assert.equal(arb.factory, jsc.integer, 'factory');
	  assert.deepEqual(arb.args, [n], 'args');
      return jsc.forall(arb, function (i) {
        return Math.round(i) === i && Math.abs(i) <= n;
      });
    });

    jsc.property("with maxsize == 0", function () {
      return jsc.forall(wrapped(0), function (i) {
        return i === 0;
      });
    });

    jsc.property("with min & max", "integer", "integer", function (n, m) {
      if (n >= m) { return true; }
	  let arb = wrapped(n, m);
	  assert.equal(arb.factory, jsc.integer, 'factory');
	  assert.deepEqual(arb.args, [n, m], 'args');
      return jsc.forall(arb, function (i) {
        return Math.round(i) === i && i >= n && i <= m;
      });
    });
	
	jsc.property('with min & max, dsl', "nat", "nat", function (n, m) {
      if (n >= m) { return true; }
	  let arb = jsc.compile(`(w integer) ${n} ${m}`, env);
	  assert.equal(arb.factory, jsc.integer, 'factory');
	  assert.deepEqual(arb.args, [n, m], 'args');
      return jsc.forall(arb, function (i) {
        return Math.round(i) === i && i >= n && i <= m;
      });
    });
  });

  describe("wrap nat", function () {
	  const wrapped = wrap(jsc.nat);
    it("without arguments", function () {
	  let arb = wrapped();
	  assert.equal(arb.factory, jsc.nat, 'factory');
	  assert.deepEqual(arb.args, [], 'args');
      jsc.assert(jsc.forall(arb, function (n) {
        return Math.round(n) === n && n >= 0;
      }));
    });

    it("with maxsize", function () {
	  let arb = wrapped(5);
	  assert.equal(arb.factory, jsc.nat, 'factory');
	  assert.deepEqual(arb.args, [5], 'args');
      jsc.assert(jsc.forall(arb, function (i) {
        return typeof i === "number" && Math.abs(i) <= 5, i>=0;
      }));
    });

  });

  describe("wrap number", function () {
	const wrapped = wrap(jsc.number);
    it("generates numbers", function () {
	  let arb = wrapped();
	  assert.equal(arb.factory, jsc.number, 'factory');
	  assert.deepEqual(arb.args, [], 'args');
      jsc.assert(jsc.forall(arb, function (x) {
        return typeof x === "number";
      }));
    });

    it("with maxsize", function () {
	  let arb = wrapped(5.5);
	  assert.equal(arb.factory, jsc.number, 'factory');
	  assert.deepEqual(arb.args, [5.5], 'args');
      jsc.assert(jsc.forall(arb, function (i) {
        return typeof i === "number" && Math.abs(i) < 5.5;
      }));
    });

    it("with min & max, generates numbers: min ≤ _ < max", function () {
	  let arb = wrapped(2.2, 5.5);
	  assert.equal(arb.factory, jsc.number, 'factory');
	  assert.deepEqual(arb.args, [2.2, 5.5], 'args');
      jsc.assert(jsc.forall(arb, function (i) {
        return typeof i === "number" && i >= 2.2 && i < 5.5;
      }));
    });

  });

  describe("wrap uint8", function () {
    const arb = wrap(jsc.uint8);
	it("wrap uint8 - as same", ()=>{
		assert.equal(arb, jsc.uint8);
	});
	
    it("wrap uint8, dsl", function () {
      jsc.assert(jsc.forall("w uint8", env, function (x) {
        return typeof x === "number";
      }));
    });

    it("generates integral numbers between 0 and 255", function () {
      jsc.assert(jsc.forall("w uint8", env, function (x) {
        return (x & 0xff) === x;
      }));
    });
  });

  describe("wrap bool", function () {
    const arb = wrap(jsc.bool);
	it("wrap bool - as same", ()=>{
		assert.equal(arb, jsc.bool);
	});
  });

  describe("wrap elements", function () {
	const wrapped = wrap(jsc.elements);
    it("picks one from argument array", function () {
      jsc.assert(jsc.forall(jsc.nearray(), function (arr) {
		let arb = wrapped(arr);
	    assert.equal(arb.factory, jsc.elements, 'factory');
	    assert.deepEqual(arb.args, [arr], 'args');
		
        return jsc.forall(arb, function (e) {
          return arr.includes(e);
        });
      }));
    });
  });

  describe("datetime", function () {
	const wrapped = wrap(jsc.datetime);
    jsc.property("wrap datetime, dsl", "w datetime", env, function (d) {
      return d instanceof Date;
    });

    it("takes two parameters for range", function () {
      var now = new Date();
      var nextHour = new Date(now.getTime() + 3600 * 1000);
		let arb = wrapped(now, nextHour);
	    assert.equal(arb.factory, jsc.datetime, 'factory');
	    assert.deepEqual(arb.args, [now, nextHour], 'args');
	  
	  
      jsc.assert(jsc.forall(arb, function (d) {
        return now.getTime() <= d.getTime() && d.getTime() <= nextHour.getTime();
      }));
    });
  });

  describe("constant", function () {
	const wrapped = wrap(jsc.constant);
    it("should always generate the given value", function () {
      jsc.assert(jsc.forall(jsc.json, function (a) {
		let arb = wrapped(a);
	    assert.equal(arb.factory, jsc.constant, 'factory');
	    assert.deepEqual(arb.args, [a], 'args');

        return jsc.forall(arb, function (b) {
          return a === b;
        });
      }));
    });
  });

});