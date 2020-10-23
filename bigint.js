
//let c = 1024n**3n -1n; //Предельный размер BigInt
//Array.from({length:16}, ()=>(1n<<c)); //Предел разрешённой памяти

function ilog2_pe(value, base=2n) {
      // example: ilog2_pe(255n) returns { p: 128n, e: 7n }
    if (base  <= value) {
        let i = ilog2_pe(value, base**2n);
        let t = i.p*base
        return (t <= value)
          ? { p: t,   e: i.e*2n + 1n }
          : { p: i.p, e: i.e*2n }
    }
    return { p: 1n, e: 0n };
}

/**
 * Сужает вилку a,b при условии b-a>=1 && fun(a) && !fun(b)
 * @param Function<BigInt, Boolean> fun
 * @param BigInt a - нижняя граница вилки, такая, что fun(a)==true
 * @param BigInt b - верхняя граница вилки, такая, что b>a && fun(b)==false
 * @return param
 */
function vilka(fun, a, b){
	let m;
	while((b-a)>1n){
		m = (a+b)>>1n;
		if(fun(m)){
			a = m;
		}
		else{
			b = m;
		}
	}
	return {a, b};
}

function ilog2(value, ebase=1n) {
 let base = 1n<<ebase;
    if (base  <= value) {
        let {e,p} = ilog2(value, ebase<<1n);
		//e = e<<1n;
		value = value/p
        if(base <= value){
			p=p*base;
			e++;
		}
        return { p: p, e: e };
    }
    return { p: 1n, e: 0n };
}

function over2(value){
	let b=1n;
	while(value > (1n<<b)){
		b = b<<1n;
	}
	let a = b>>1n;

	while((b-a)>1n){
		m = (a+b)>>1n;
		if(value>>m){
			a = m;
		}
		else{
			b = m;
		}
	}
	
	if(value === 1n<<a){
		return a;
	}
	else{
		return b;
	}
}

console.log(over2(1n<<30n));

module.exports = {
	over2
};