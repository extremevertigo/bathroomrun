class VisibilityChange
{
	constructor(callback)
	{
		this.callback = (typeof callback === "function") ? callback : () => { };

		this.hidden = this.constructor.getHidden();
		this.visibilityChange = this.constructor.getVisibility();
		if (this.hidden && this.visibilityChange) {
			document.addEventListener(this.visibilityChange, () => this.handleVisibilityChange(), false);
		}
	}
	static getHidden()
	{
		if (typeof document.hidden !== "undefined") {
			return "hidden";
		} else if (typeof document.msHidden !== "undefined") {
			return "msHidden";
		} else if (typeof document.webkitHidden !== "undefined") {
			return "webkitHidden";
		}
	}

	static getVisibility()
	{
		if (typeof document.hidden !== "undefined") {
			return "visibilitychange";
		} else if (typeof document.msHidden !== "undefined") {
			return "msvisibilitychange";
		} else if (typeof document.webkitHidden !== "undefined") {
			return "webkitvisibilitychange";
		}
	}
	handleVisibilityChange()
	{
		this.callback(!document[this.hidden]);
	}
}

export default VisibilityChange;