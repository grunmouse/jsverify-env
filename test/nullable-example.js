var jsc = require("jsverify");
var _ = require("underscore");

describe("nullable example", function () {
	/**
	 * either
	 * Два однотипных объекта Left и Right
	 * @property value - просто значение, которое они хранят
	 * @method either(l, r) - вернуть значение, обработанное левой или правой функцией, сообразно классу объекта
	 * @method isEqual(either) - проверка равенства с себе подобным (сравнивает класс и значение)
	 * @method bimap(l, r) - обработать значение левой/правой функцией и запаковать результат в Left/Right
	 * @method first(f) - левый обрабатывает значение и запаковывает в Left, правый возвращает себя
	 * @method second(g) - левый возвращает себя, правый - обрабатывает и запаковывает в Right
	 */
	
	
  function toNullable(e) {
    return e.either(()=>(null), (a)=>(a));
  }

  function fromNullable(n) {
    return n === null ? jsc.left([]) : jsc.right(n);
  }
	/**
	 * @function jsc.compile - компилирует DSL и возвращает arbitrary
	 */
	 
	 /*
	  DSL
	  nat - натуральное число (включая 0)
	  
	  'integer', 'nat', 'number', 'bool', 'falsy', 'char'
	  
	  either - принимает два аргумента, рандомно генерирует значение левым или правым генератором 
		и оборачивает в соотв. Left или Right
	  unit - генерирует пустой массив
	  nat - генерирует натуральное число
	  */
	const arb = jsc.compile("either bool nat");
	/**
	 * @method arbitrary.smap(to, from) - принимает две функции, для преобразования значений туда и обратно
	 * Возвращает новый arbitrary
	 */
  var nullableNatArb = arb.smap(toNullable, fromNullable);
	console.log(nullableNatArb);

  var userEnv = {
    nullablenat: nullableNatArb,
  };

  jsc.property("nullable nat", "nullablenat", userEnv, function (n) {
    return n === null || typeof n === "number";
  });
});