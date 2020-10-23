/***
 * Представляет собой упорядоченное множество целых неотрицательных чисел, которые
 * первоначально стоят по порядку, под индексами, равными значению,
 * но их можно обменивать местами
 */
class PermutatedTail extends Map{
	/**
	 * Метод получения числа по индексу
	 */
	get(index){
		if(this.has(index)){
			return super.get(index);
		}
		else{
			return index;
		}
	}
	
	/**
	 * Метод обмена позиций во множестве значениями
	 * @param a - индекс первого числа
	 * @param b - индекс второго числа
	 */
	swap(a, b){
		let A = this.get(a);
		let B = this.get(b);
		
		this.set(b, A);
		this.set(a, B);
	}
}


function uniqueRandom(n, gen){
	let tail = new PermutatedTail();

	let result = [];
	for(let i = 0; i<n; ++i){
		let k = gen(i);
		result.push(tail.get(k));
		let alt = typeof k === 'bigint' ? BigInt(i) : i;
		tail.swap(k, alt);
	}
	
	return result;
}

module.exports = {
	uniqueRandom
};