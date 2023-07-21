/**
 * Used mainly to detect mobile or non-mobile to the best of our ability
 * Browser Sniffing
 */
class Device{
	constructor(){
		// Mobile Platforms
		this.android = /android/i.test(navigator.userAgent);
		this.iPhone = /iPhone/i.test(navigator.userAgent);
		this.iPod = /iPod/i.test(navigator.userAgent);
		this.iPad = /iPad/i.test(navigator.userAgent);
		this.kindle = /Silk/i.test(navigator.userAgent);
		this.touchDevice = (('ontouchstart' in window) || (window.navigator.msMaxTouchPoints));

		// Browser sniffing (not great but it's something)
		this.safari = /safari/i.test(navigator.userAgent);
		this.chrome = /chrome/i.test(navigator.userAgent);
		this.edge = /edge/i.test(navigator.userAgent);
		this.IE11 = /trident/i.test(navigator.userAgent);
		this.firefox = /firefox/i.test(navigator.userAgent);

		// More specific
		this.iOS = this.determineIOS();
		this.mobile = this.determineMobile();
	}

	determineIOS(){
		return this.iPhone || this.iPad || this.iPod;
	}

	determineMobile(){
		return this.iOS || this.android || this.winPhone || this.kindle || /mobile/i.test(navigator.userAgent);
	}
}

export default Device;