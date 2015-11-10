"use strict";

let Sequence = (function(){
	function Sequence(gen) {
		this[Symbol.iterator] = gen;
	}
	
	Sequence.prototype.map = function(transform) {
		let _this = this;
		return new Sequence(function*(){
			for (let x of _this) {
				yield transform(x);
			}
		});
	};
	
	Sequence.prototype.flatMap = function (transform) {		
		let _this = this;
		return new Sequence(function*(){
			for (let x of _this) {
				let subsequence = transform(x);
				if (typeof subsequence === "function") {
					for (let y of subsequence()) {
						yield y;
					}
				}
				else {
					for (let y of subsequence) {
						yield y;
					}
				}
			}
		});
	};
	
	Sequence.prototype.filter = function (predicate) {
		let _this = this;
		return new Sequence(function*(){
			for (let x of _this) {
				if (predicate(x)) {
					yield x;
				}
			}
		});
	};
	
	Sequence.prototype.forEach = function (action) {
		for (let x of this) {
			action(x);
		}
	};
	
	Sequence.prototype.first = function () {
		for (let x of this) {
			return x;
		}	
	};
	
	Sequence.prototype.last = function () {
		let last = undefined;
		for (let x of this) {
			last = x;
		}	
		
		return last;
	};
	
	Sequence.prototype.take = function (n) {
		let _this = this;
		return new Sequence(function*(){
			let taken = 0;
			for (let x of _this) {
				++taken;
				if (taken > n)
					break;
					
				yield x;
			}
		});
	};
	
	Sequence.prototype.takeWhile = function (predicate) {
		let _this = this;
		return new Sequence(function*(){
			for (let x of _this) {
				if (!predicate(x))
					break;
				else
					yield x;
			}	
		});
	};
	
	Sequence.prototype.skip = function (n) {
		let _this = this;
		return new Sequence(function*(){
			let index = 0;
			for (let x of _this) {
				++index;
				if (index >= n)
					yield x;
			}
		});
	};
	
	Sequence.prototype.reduce = function (init, reduction) {
		let left = init;
		for (var x of this) {
			let right = x;
			left = reduction(left, right);
		}
		
		return left;
	};
	
	Sequence.prototype.count = function () {
		let count = 0;
		for (var x of this) {
			++count;
		}	
		
		return count;
	};
	
	Sequence.prototype.toArray = function () {
		let array = [];
		for (let x of this) {
			array.push(x);
		}
		
		return array;
	};
	
	Sequence.prototype.reverse = function () {
		let array = this.toArray();
		return new Sequence(function*(){
			for (let i = array.length - 1; i >= 0; --i) {
				yield array[i];
			}
		});
	};
	
	Sequence.prototype.concat = function (seq) {
		let _this = this;
		return new Sequence(function*(){
			for (let x of _this)
				yield x;
			
			for (let x of seq)
				yield seq;
		});
	};
	
	Sequence.prototype.zip = function (seq, zipper) {
		let _this = this;
		return new Sequence(function*(){
			let seqGen = seq[Symbol.iterator]();
			for (let x of _this) {
				let other = seqGen.next();
				if (other.done)
					break;
				else
					yield zipper(x, other.value);
			}
		});
	};
	
	let factory = gen => {
		if (typeof gen === "function") {
			return new Sequence(gen);
		}
		else {
			return new Sequence(function*(){
				for (let x of gen) {
					yield x;
				}
			});
		}
	};
	
	factory.range = function (nFrom, nTo) {
		return new Sequence(function*(){
			for (let i = nFrom; i < nTo; ++i) {
				yield i;
			}
		});
	};
	
	factory.repeat = function (value, n) {
		return new Sequence(function*(){
			for (let i = 0; i < n; ++i) {
				yield value;
			}
		});
	};
	
	factory.repeatCall = function (f) {
		return new Sequence(function*(){
			while (true) {
				yield f();
			}
		});
	};
	
	factory.empty = function () {
		return new Sequence(function*(){});	
	};
	
	return factory;
})();