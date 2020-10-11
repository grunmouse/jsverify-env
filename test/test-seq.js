var lazyseq = require("lazy-seq");
const {
	cons,
	fold,
	iterate
} = lazyseq;

/**
 * @function fold(seq, start, f)
 * @param seq - список (лисп-подобный) или то, что можно к нему привести
 * @param start - начальное значение
 * @param f(x, rec) - функция свёртки, где x - значение головы, а rec() - функция, которая лениво вычислит fold от хвоста
 */
/*
fold (cons h t) x f = f x (fold t h f)

fold(cons(h,t),x,f) = f(x, fold(t,h,f))

fold (cons a (cons b c)) x f = f x (fold (cons b c) a f) = f x (f b (fold c b f))
*/

let lazyTail = cons(1,()=>(cons(2,()=>(3))));
let str = cons(0,1);

let seq = iterate(10, (x)=>(x>0 ? x-1 : 0));

//console.log(seq.force());
try{
console.log(seq.fold(1, (x, rest)=>{
	let r = x && x+rest();
	console.log(x, r);
	return r;
}));
}
catch(e){
	let m = e.message;
	let s = e.stack;
	console.log(e.message);
}