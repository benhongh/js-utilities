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
	return new Promise(resolve => {
		$.getJSON(url, data => resolve(data));
	});	
}

function uploadCounter(url, counter) {
	return new Promise(resolve => {
		$.ajax({
			method: "PUT",
			url: url,
			data: counter
		});
	});	
}

function incrementCounter(url) {
	return async(function* () {
		var counter = yield downloadCounter(url); // yield takes a promise and unwraps it
		counter.value += 1;
		yield uploadCounter(url, counter);
	});	
}
```


