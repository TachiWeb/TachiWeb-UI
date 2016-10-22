var Util = {
	debounce: function(func, wait, immediate) {
		let timeout;
		return function() {
			var context = this,
				args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},
	
	group: function(func, wait) {
		var calls = []; //Queued calls
		let timeout;
		return function() {
			var context = this,
				args = arguments;
			var later = function() {
				timeout = null;
				//Apply queued calls
				for(let call of calls) {
					func.apply(context, call);
				}
				calls = [];
			};
			//Queue the call
			calls.push(args);
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	},

	guid: function() {
		let S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
	},

	indexInParent: function(node) {
		var i = 0;
		while (node = node.previousSibling) {
			if (node.nodeType === 1) {
				++i
			}
		}
		return i;
	}
}
//Utility array peek function
Array.prototype.peek = function() {
	return this[this.length - 1];
}