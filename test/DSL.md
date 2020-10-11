# Расшифровка потрохов DSL

Из typify выходит AST, где каждый узел помечен типом

```
    case "ident": return compileIdent(env, type);
    case "application": return compileApplication(env, type);
    case "function": return compileFunction(env, type);
    case "brackets": return compileBrackets(env, type);
    case "disjunction": return compileDisjunction(env, type);
    case "conjunction": return compileConjunction(env, type);
    case "record": return compileRecord(env, type);
    case "number": return type.value;
    case "recursive": return compileRecursive(env, type);
	
```

+ compileIdent - возвращает значение из окружения по имени
+ compileApplication - компилирует функцию, потом каждый аргумент, потом вызывает функцию с аргументами и возвращает результат
+ compileFunction - компилирует тип результата и создаёт функцию, которая будет его возвращать
+ compileBrackets - возвращает генератор массива 
+ compileDisjunction - создаёт генератор union
+ compileConjunction - создаёт генератор кортежа
+ compileRecord - создаёт генератор структуры
+ compileRecursive - рекурсивно заданный тип, юнион, который может содержать в себе аналогичный юнион

```
var environment = utils.merge(primitive, string, {
  pair: arbitrary.pair,
  unit: arbitrary.unit,
  either: arbitrary.either,
  dict: arbitrary.dict,
  array: arbitrary.array,
  nearray: arbitrary.nearray,
  json: arbitrary.json,
  fn: fn.fn,
  fun: fn.fn,
  nonshrink: arbitrary.nonshrink,
  small: small.arbitrary,
});
```

+ pair - принимает два аргумента, создаёт генератор "пар" - кортежей из двух элементов
+ unit - генератор пустого массива
+ either - принимает два аргумента - левый и правый arbitrary, рандомно генерирует значение левым или правым генератором и оборачивает соответственно в Left или Right
+ dict - принимает один аргумент, генерирует словарь со значениями соответствующего типа
+ array - принимает один аргумент, генерирует массив значений этого типа
+ nearray - принимает один аргумент, генерирует непустой массив 
+ json - рекурсивный dict, что-то вроде rec json->primitives|dict json|array json
+ fn, fun - принимают один аргумент, генерирует функцию, возвращающую этот тип
+ nonshrink - унарная функция, создаёт Non shrinkable version of arbitrary `arb`.
+ small - создаёт укороченную версию пререданного arbitrary (вместо длины использует логарифм длины)

```
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

+ integer - принимает ни одного, один или два аргумента, верхний или нижний и верхний пределы значений, или встроенные.
+ int8, int16, int32 - integer с предустановленными пределами
+ nat - натуральные числа, принимает до одного аргумента (максимальное значение
+ uint8, uint16, uint32 - nat с предустановленными пределами
+ number - тоже может принимать пределы, JavaScript numbers, "doubles", `NaN` and `Infinity` are not included.
+ elements - принимает массив аргументов, рандомно возвращает один из них
+ bool - булево значение
+ falsy - `false`, `null`, `undefined`, `""`, `0`, and `NaN`
+ constant - принимает аргумент и возвращает его
+ datetime - возвращает дату, может принимать пределы


```
module.exports = {
  char: char,
  asciichar: asciichar,
  string: string,
  nestring: nestring,
  asciistring: asciistring,
  asciinestring: asciinestring,
};
```

+ char - любой однобайтовый символ (ерунда какая-то)
+ asciichar - любой неслужебный символ из первой половины ascii
+ string - строка из char
+ nestring - непустая строка из char
+ asciistring, asciinestring - то же для ascii