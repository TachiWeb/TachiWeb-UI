//Pass functions between polymer elements
(function() {
    let lastFunctionId = -1;
    let functionDb = {};
    Function.prototype.to = function() {
        lastFunctionId++;
        let stringFunctionId = lastFunctionId.toString()
        functionDb[stringFunctionId] = this;
        return stringFunctionId;
    };
    Function.from = function(functionId) {
        return functionDb[functionId];
    };
})();