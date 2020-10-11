const jsc = require("jsverify");

const arbPosit = {
    generator: (size) => {
        return jsc.random(1, size);
    },
    shrink: (value) => {
        const yieldOne = (value > 1)
            ? () => jsc.random(1, value - 1)
            : () => 1;
        const smaller = [];
        for (let i = 0; i < 5; i++) {
            smaller.push(yieldOne);
        }
        return smaller;
    },
    show: (value) => {
        return value + "";
    },
};

module.exports = arb