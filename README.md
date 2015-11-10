# js-utilities
This is a collection of unrelated utilities that I use in my JavaScript project from time to time.

## typeinfo.js

This is a helper function for basic type checking.

### Examples:

```javascript
	var str = "hello";
	if (typeInfo(str).isPrimitiveString()) {
		console.log("str is a primitive string");
	}
```

### Available quries:
* `typeInfo(x).isNull()` checks if x is null
* `typeInfo(x).isUndefined()` checks if x is undefined
* `typeInfo(x).isNullOrUndefined()` checks if x is either null or undefined
* `typeInfo(b).isPrimitiveBoolean()` checks if b is a boolean primitive
* `typeInfo(b).isBoolean()` checks if b is a boolean primitive, or a Boolean object
* `typeInfo(n).isPrimitiveNumber()` checks if n is a number primitive
* `typeInfo(n).isNumber()` checks if n is a number primitive, or a Number object
* `typeInfo(s).isPrimitiveString()` checks if s is a string primitive
* `typeInfo(s).isString()` checks if s is a string primitive, or a String object
* `typeInfo(s).isSymbol()` checks if s is a symbol
* `typeInfo(o).isObject()` checks if o is an object
* `typeInfo(f).isFunction()` checks if f is a function
* `typeInfo(a).isArray()` checks if a is an array
* `typeInfo(x).isObjectOfType(t)` checks if x is an object of type t
* `typeInfo(x).isPrimitive()` checks if x is a primitive value

## async.js

A wrapper function that turns a JavaScript [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*).
This is a bit like the async-await feature in C#,
and can save you from having to code deeply nested callbacks.

### Example:

```javascript
function downloadCounter(url) {
	return new Promise((resolve, reject) => {
		$.ajax({
			method: "GET",
			url: url,
			success: resolve,
			error: (_, _, e) => reject(e)
		});
	});	
}

function uploadCounter(url, counter) {
	return new Promise((resolve, reject) => {
		$.ajax({
			method: "PUT",
			url: url,
			data: counter,
			success: resolve,
			error: (_, _, e) => reject(e)
		});
	});	
}

function incrementCounter(url) {
	return asyncf(function* () {
		var counter = yield downloadCounter(url); // yield takes a promise and unwraps it
		counter.value += 1;
		yield uploadCounter(url, counter);
	});	
}
```

## seq.js

This is a simple sequence library that uses ES6 generator 
rather than array for sequence generation and manipulation.

Note that currently only the most updated browsers support ES6 generators.

### Sequence creation

```javascript
	let seq1 = Sequence([1, 2, 3]);              // convert an array to sequence
	let seq2 = Sequence(function*(){             // use a generator to define sequence
		yield "hello";
		yield "world";
	});
	
	let seq3 = Sequence.range(0, 16);            // seq3 = {0, 1, 2, ..., 15}
	let seq4 = Sequence.repeat("blah", 5);       // seq4 = {"blah", "blah", "blah", "blah"}
	let seq5 = Sequence.repeatCall(Math.random); // seq5 = infinite sequence of random numbers
	let seq6 = Sequence.empty();                 // seq6 = empty sequence
```

### Sequence consumption

A sequence can be iterated with the ES6 `for...of` loop. For example:

```javascript
	// print numbers 1 through 10
	let seq = Sequence.range(1, 11);
	for (let n of seq) {
		console.log(n);
	}
```

Alternatively you may choose to use the `forEach()` method, as shown here:

```javascript
	// print numbers 1 through 10
	let seq = Sequence.range(1, 11);
	seq.forEach(console.log);
```

And finally, you can also convert a sequence to an array.
However, a sequence can be infinite whereas an array is subject
to memory allocation limits.

```javascript
	// print numbers 1 through 10
	let seq = Sequence.range(1, 11);
	let arr = seq.toArray();
	arr.forEach(console.log);
```

### Sequence transformation

Sequence provides the standard map/flatMap/filter operators for transformation.

The `map()` method takes a transformation function and applies it to every
element in the sequence, and form a new sequence from the result of each
transformation. For example:

```javascript
	// print random number between 0 and 100
	let decimals = Sequence.repeatCall(Math.random); // sequence of randoms between 0 and 1
	let percents = decimals.map(n => 100.0 * n);         // sequence of randoms between 0 and 100
	let integers = percents.map(Math.round);
```

The `flatMap()` method takes a transformation function that turns each
element into a separate sequence, and concatenates all these sub-sequences
into a single flattened sequence. For example:

```javascript
	let counts = Sequence([1, 2, 3]);                          //        1  2    3  
	                                                           //        | / \ / | \
	let dots   = counts.flatMap(n => Sequence.repeat(".", n)); // dots = . . . . . .
	let ats    = counts.flatMap(n => function*(){              // ats  = @ @ @ @ @ @
		for (let i = 0; i < n; ++i) {
			yield "@";	
		}
	});
```

The `filter()` method takes a predicate function which returns either true or false
given each element in the sequence, and forms a new sequence with elements which
the predicate returns true.

```javascript
	function isOdd(x){ return x % 2 == 1; }
	let seq  = Sequence.range(1, 101);
	let odds = seq.filter(isOdd); // 1, 3, 5, 7, ... , 99
```

### Sequence reduction

The `reduce()` method takes an initial value and a function that reduces two values into
a single value, and reduces the sequence left-to-right. Here is an example to sum
a sequence of numbers using `reduce()`:

```javascript
	let seq = Sequence.range(0, 10);
	let sum = seq.reduce(0, (a, b) => a + b); // sum = 0 + 0 + 1 + ... + 9 == 45
```

The `first()` and `last()` methods return the first and last element of the sequence,
respectively:

```javascript
	let seq   = Sequence(["a", "b", "c"]);
	let first = seq.first(); // "a"
	let last  = seq.last();  // "b"
```

The `count()` method returns the number of elments in the sequence:
```javascript
	let seq1  = Sequence([1,2,3,4,5]);
	let count = seq1.count(); // 5
	
	let seq2 = Sequence.repeatCall(() => "a"); // infinite sequence
	let test = seq2.count();                   // undefined behaviour
```

### Sequence truncation

Simple truncation operators are provided, namely `take()`, `takeWhile()`, and `skip()`.

Example:

```javascript
	let source = Sequence.range(0, 10); // { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }
	let take3  = source.take(3);        // { 0, 1, 2 }
	let skip3  = source.skip(3);        //          { 3, 4, 5, 6, 7, 8, 9 }
	let middle = source.skip(3).take(3);//          { 3, 4, 5 }
	let lower  = source.takeWhile(      // { 0, 1, 2, 3, 4 }
		n => n < 5);
```

Sequence truncation is especially useful when dealing with infinite sequences:

```javascript
	let randoms = Sequence.repeatCall(Math.random);
	let first5  = randoms.take(5); // sequence of 5 random numbers
```

### Combining sequences

The `concat()` method joins two sequences into a single one:

```javascript
	let seq1 = Sequence([1, 2, 3]);
	let seq2 = Sequence([4, 5, 6]);
	let seq3 = seq1.concat(seq2); // { 1, 2, 3, 4, 5, 6 }
```

The `zip()` method combines two sequences by applying a function to corresponding elements
from each sequence. For example:

```javascript
	let seq1 = Sequence([1, 2, 3])
	let seq2 = Sequence([4, 5, 6]);
	let seq3 = seq1.zip(seq2, (x, y) => x * y); // { 4, 10, 18 }
```