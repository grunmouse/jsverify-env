
// example `generator hydra`
const generatorHydra = (size) => {
    const hydra = { heads: size ** 2 };
    return hydra;
};

const randomGreetingGenerator = (ignoredSize) => {
    const pseudoRandomIndex = jsc.random(0, 2);
    return ['hi', 'yo', 'sup'][pseudoRandomIndex];
};

// example `shrink hydra`
const shrinkHydra = (hydra) => {
    if (hydra.heads <= 0) return [];
    // theoretically valid but impractically inefficient:
    return [{ heads: hydra.heads - 1 }];
};

// example `show : hydra -> string`
const showHydra = (hydra) => `{ heads: ${hydra.heads} }`;

// example `arbitrary hydra`
const arbitraryHydra = {
    generator: generatorHydra,
    shrink: shrinkHydra,
    show: showHydra
};

/**
 * @function jsc.bless - добавляет методы интерфейса,
 * автоматически оборачивает generator и shrink как надо,
 * добавляет дефолтные shrink и show
 */
const hydra = jsc.bless(arbitraryHydra);

const env = {
    hydra: arbitraryHydra
};


const exampleProp = jsc.forall(
    'nat',             // asking for built-in `arbitrary natural`
    'hydra',           // asking for custom `arbitrary hydra`
    env,               // object providing the `hydra` arbitrary
    (nat, hydra) => {  // property verifier receiving both data
        return hydra.heads + nat > 0
    }
)


/**
 * У генератора есть map
 */
const evenGenerator = jsc.generator.nat.map(n => n * 2)


const yellGenerator = jsc.generator.string.map(s => s + '!')