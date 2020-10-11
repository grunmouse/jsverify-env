# jsverify API


## Обзор кода

```
// Export
var jsc = {
  forall: forall,
  check: check,
  assert: checkThrow,
  assertForall: assertForall,
  checkForall: checkForall,
  property: bddProperty,
  sampler: sampler,
  throws: throws,

  // generators
  fn: fn.fn,
  fun: fn.fn,
  suchthat: suchthat.suchthat,

  // either
  left: either.left,
  right: either.right,

  // sum
  addend: sum.addend,

  // compile
  compile: compile,

  generator: api.generator,
  shrink: api.shrink,

  // internal utility lib
  random: random,

  show: show,
  utils: utils,
  _: {
    FMap: FMap,
  },
  
  //Эквивалентная по смыслу замена последующего for..in
  ...api.arbitrary
};

```

```
var api = {
  arbitrary: {
    small: small.arbitrary,
    bless: bless,
    record: recordWithEnv,
    nonshrink: arbitrary.nonshrink,
    pair: arbitrary.pair,
    either: arbitrary.either,
    unit: arbitrary.unit,
    dict: arbitrary.dict,
    json: arbitrary.json,
    nearray: arbitrary.nearray,
    array: arbitrary.array,
    tuple: arbitrary.tuple,
    sum: arbitrary.sum,
    oneof: arbitrary.oneof,
    recursive: arbitrary.recursive,
    letrec: arbitrary.letrec,
	
    //Эквивалентная по смыслу замена последующего for..in
    ...primitive,
    ...string,
	
  },
  generator: {
    dict: dict.generator,
    json: json.json.generator,
    small: small.generator,
    record: record.generator,
	
    //Эквивалентная по смыслу замена последующего for..in
	...generator
  },
  shrink: {
    record: record.shrink,
	
    //Эквивалентная по смыслу замена последующего for..in
	...shrink
  },
};
```

```
/* primitive */
module.exports = {
  integer: integer,
  nat: nat,
  int8: int8,
  int16: int16,
  int32: int32,
  uint8: uint8,
  uint16: uint16,
  uint32: uint32,
  number: number,
  elements: elements,
  bool: bool,
  falsy: falsy,
  constant: constant,
  datetime: datetime,
};
```

```
/* strings */
module.exports = {
  char: char,
  asciichar: asciichar,
  string: string,
  nestring: nestring,
  asciistring: asciistring,
  asciinestring: asciinestring,
};
```

```
/* generator */
module.exports = {
  pair: generatePair,
  either: generateEither,
  unit: generateUnit,
  tuple: generateTuple,
  sum: generateSum,
  array: generateArray,
  nearray: generateNEArray,
  oneof: generateOneof,
  constant: generateConstant,
  bless: generatorBless,
  combine: generatorCombine,
  recursive: generatorRecursive,
};
```

```
/* shrink */
module.exports = {
  noop: shrinkNoop,
  pair: shrinkPair,
  either: shrinkEither,
  tuple: shrinkTuple,
  sum: shrinkSum,
  array: shrinkArray,
  nearray: shrinkNEArray,
  bless: shrinkBless,
};

```

```
/* show */
module.exports = {
  def: showDef,
  pair: showPair,
  either: showEither,
  tuple: showTuple,
  sum: showSum,
  array: showArray,
};
```

```
/* utils */
module.exports = {
  isArray: isArray,
  isObject: isObject,
  isEqual: isEqual,
  isApproxEqual: isApproxEqual,
  identity: identity,
  pluck: pluck,
  force: force,
  merge: merge,
  div2: div2,
  ilog2: ilog2,
  curried2: curried2,
  curried3: curried3,
  charArrayToString: charArrayToString,
  stringToCharArray: stringToCharArray,
  pairArrayToDict: pairArrayToDict,
  dictToPairArray: dictToPairArray,
  partition: partition,
};


```

## Общая карта API

```
// Export
var jsc = {
  forall: forall,
  check: check,
  assert: checkThrow,
  assertForall: assertForall,
  checkForall: checkForall,
  property: bddProperty,
  sampler: sampler,
  throws: throws,

  // generators
  fn: fn.fn,
  fun: fn.fn,
  suchthat: suchthat.suchthat,

  // either
  left: either.left,
  right: either.right,

  // sum
  addend: sum.addend,

  // compile
  compile: compile,
  
  /* api.generator */
  generator: {
    dict: dict.generator,
    json: json.json.generator,
    small: small.generator,
    record: record.generator,
	
	/* ...generator */
    pair: generatePair,
    either: generateEither,
    unit: generateUnit,
    tuple: generateTuple,
    sum: generateSum,
    array: generateArray,
    nearray: generateNEArray,
    oneof: generateOneof,
    constant: generateConstant,
    bless: generatorBless,
    combine: generatorCombine,
    recursive: generatorRecursive,
	/* end ...generator */
  },
  /* api.shrink */
  shrink: {
    record: record.shrink,
	
	/* ...shrink */
    noop: shrinkNoop,
    pair: shrinkPair,
    either: shrinkEither,
    tuple: shrinkTuple,
    sum: shrinkSum,
    array: shrinkArray,
    nearray: shrinkNEArray,
    bless: shrinkBless,
	/* end ...shrink */
  },

  // internal utility lib
  random: random,

  show:  {
    def: showDef,
    pair: showPair,
    either: showEither,
    tuple: showTuple,
    sum: showSum,
    array: showArray,
  },
  
  utils: utils,
  _: {
    FMap: FMap,
  },
  
  /* ...api.arbitrary */
  small: small.arbitrary,
  bless: bless,
  record: recordWithEnv,
  nonshrink: arbitrary.nonshrink,
  pair: arbitrary.pair,
  either: arbitrary.either,
  unit: arbitrary.unit,
  dict: arbitrary.dict,
  json: arbitrary.json,
  nearray: arbitrary.nearray,
  array: arbitrary.array,
  tuple: arbitrary.tuple,
  sum: arbitrary.sum,
  oneof: arbitrary.oneof,
  recursive: arbitrary.recursive,
  letrec: arbitrary.letrec,
	
  /*  ...primitive, */
  integer: integer,
  nat: nat,
  int8: int8,
  int16: int16,
  int32: int32,
  uint8: uint8,
  uint16: uint16,
  uint32: uint32,
  number: number,
  elements: elements,
  bool: bool,
  falsy: falsy,
  constant: constant,
  datetime: datetime,
  /* end ...primitive, */
  
  /* ...string, */
  char: char,
  asciichar: asciichar,
  string: string,
  nestring: nestring,
  asciistring: asciistring,
  asciinestring: asciinestring,
  /* end ...string, */
  
  /* end ...api.arbitrary */
	
};

```

## Разбор описания функций

```
@function jsc.forall(...gens, env?, block)
@param ...gens - несколько аргументов arbitrary
@param env : Object? - пользовательское окружение
@param block : Function - функция валидации
@return Property
```

```
//Property
function (size) {
    var x = gens.map(function (arb) { return arb.generator(size); });
    var r = test(size, x, 0);
    return r;
  };
```

Объект Property - это функция, которая оборачивает в себя функцию block и правила генерации аргументов для неё.
При запуске она генерирует по заданным правилам случайные аргументы и вызывает с ними block.
Если block не проходит - она применяет shrinks для уменьшения аргументов и прогоняет block с ними, причём рекурсивно. Таким образом ищется наименьший сбойный аргумент.

```
@function jsc.check(prop: property, opts: checkoptions?): result
@param prop : Property - наподобие того, что возвразает forall
@param opts : Object
@param opts.tests : Number - test count to run, default 100
@param opts.size : Number - maximum size of generated values, default 50
@param opts.quiet - do not `console.log`
@param opts.rngState - state string for the rng

@return true| Object
      The `result` is `true` if check succeeds, otherwise it's an object with various fields:
      - `counterexample` - an input for which property fails.
      - `tests` - number of tests run before failing case is found
      - `shrinks` - number of shrinks performed
      - `exc` - an optional exception thrown by property function
      - `rngState` - random number generator's state before execution of the property
```

Вызывает prop несколько раз, пока не произойдёт сбой, затем возвращает данные о сбое.

```
@function jsc.assert(property, opts)
@void
```

Похожа на check, но результат выводит не в return, а в throw

```
@function jsc.assertForall()

function assertForall() {
  return checkThrow(forall.apply(null, arguments));
}
```


```

@function jsc.checkForall()

function checkForall() {
  return check(forall.apply(null, arguments));
}
```

Полагаю, комментарии излишни

```
@function jsc.property(name: string, ...)


      it(name, function () {
        jsc.assert(jsc.forall(...));
      }

      jsc.property("+0 === -0", function () {
        return +0 === -0;
      });
```


```
@function jsc.sampler(arb, size)
@param arb : Arbitary
@param size: Number
@return Function<(number), any> - возвращает указанное число значений, сгенеренных arb(size);
```
Оборачивает генераторы и размер в функцию


```
@function jsc.throws(block, error, message)
@param block : Function
@param error : Function
@param message : String
```

Проверяет, чтобы