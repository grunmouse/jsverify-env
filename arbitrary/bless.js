const jsc = require('jsverify');


function extendWithDefault(arb) {
  var def = arb();
  arb.pregen = def.pregen;
  arb.conv = def.conv;
  arb.generator = def.generator;
  arb.shrink = def.shrink;
  arb.show = def.show;
  arb.smap = def.smap;
  
  return arb;
}

function smap(f, g, newShow){
  var arb = this;
  let res = {
    show: newShow || jsc.show.def
  };
  
  if(g){
	res.shrink = arb.shrink.smap(f, g);
  }
  
  if(arb.pregen && arb.conv){
	res.pregen = arb.pregen;
	res.conv = (raw)=>(f(arb.conv(raw)));
  }
  else{
	res.generator = arb.generator.map(f);
  }
  
  return bless(res);
}

function bless(arb){
	if(typeof arb === 'function'){
		arb = {generator:arb};
	}

	if(!arb.generator && arb.pregen && arb.conv){
		arb.generator = function(size){
			return arb.conv(arb.pregen(0, size), size);
		};
	}
	
	jsc.bless(arb);
	arb.smap = smap;
	
	return arb;
	
}

module.exports = bless;