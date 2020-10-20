const jsc = require('jsverify');

function smap(f, g, newShow){
  var arb = this;
  let res = bless({
    shrink: arb.shrink.smap(f, g),
    show: newShow || jsc.show.def,
	pregen:arb.pregen,
	conv:(raw)=>(f(arb.conv(raw)))
  });
  
  return res;
}

function bless(arb){
	arb.generator = function(size){
		return arb.conv(arb.pregen(size), size);
	};
	
	jsc.bless(arb);
	arb.smap = smap;
	
	return arb;
}

module.exports = bless;