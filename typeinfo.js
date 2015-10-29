var typeInfo = (() => {
    var TypeInfo = function (x) { this.x = x; };
    var scope = TypeInfo.prototype;
    scope.isNull = function(){ return this.x === null && (typeof x) === "object"; };
    scope.isUndefined =  function(){ return this.x == null && (typeof x) === "undefined"; };
    scope.isNullOrUndefined =  function(){ return this.x == null; };
    scope.isPrimitiveBoolean =  function(){ return (typeof this.x) === "boolean"; };
    scope.isPrimitiveString =  function(){ return (typeof this.x) === "string"; };
    scope.isPrimitiveNumber =  function(){ return (typeof this.x) === "number"; };
    scope.isFunction = function(){ return (typeof this.x) === "function"; };
    scope.isSymbol =  function(){ return (typeof this.x) === "symbol"; };
    scope.isObject =  function(){ return (typeof this.x) === "object" && this.x !== null; };
    scope.isArray =  function(){ return (typeof this.x) === "object" && this.x !== null && this.x instanceof Array; };
    scope.isObjectOfType =  function(type){ return (typeof this.x) === "object" && this.x !== null && this.x instanceof type; };
    scope.isPrimitive = function(){ return 
        this.isNullOrUndefined(this.x) || 
        this.isPrimitiveBoolean(this.x) || 
        this.isPrimitiveString(this.x) || 
        this.isPrimitiveNumber(this.x);
    };
        
    scope.isString = function(){ return this.isPrimitiveString() || this.isObjectOfType(String); };
    scope.isNumber = function(){ return this.isNumber() || this.isObjectOfType(Number); };
    scope.isBoolean = function(){ return this.isBoolean() || this.isObjectOfType(Boolean); };
    
    return x => new (TypeInfo)(x);
})();