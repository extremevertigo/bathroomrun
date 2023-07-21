Object.defineProperty(Array.prototype, 'erase', {
	value: function (item)
	{
		var i = this.indexOf(item);
		if (i >= 0) this.splice(i, 1);
		return this;
	}
});

Object.defineProperty(Array.prototype, 'random', {
	value: function ()
	{
		return this[0 | (Math.random() * this.length)];
	}
});

Object.defineProperty(Array.prototype, 'shuffle', {
	value: function ()
	{
		var i = this.length, j, temp;
		if (i === 0) return this;
		while (--i) {
			j = Math.floor(Math.random() * (i + 1));
			temp = this[i];
			this[i] = this[j];
			this[j] = temp;
		}
		return this;
	}
});

Object.defineProperty(Array.prototype, 'clone', {
	value: function ()
	{
		return this.slice(0);
	}
});