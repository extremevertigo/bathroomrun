import FlashAnimationLoader from "./FlashAnimationLoader";
class AssetLoader extends createjs.LoadQueue {
	constructor(cache, preferXHR = true) {
		super(preferXHR);

		this.cache = cache;

		this.installPlugin(createjs.Sound);
		this.registerLoader(FlashAnimationLoader);
		this.setMaxConnections(8);
	}
	load(manifest) {
		let copiedManifest = [];
		manifest.forEach(element => {
			// Don't load the sounds multiple times
			if (!createjs.Sound._idHash[element.id]) {
				copiedManifest.push(JSON.parse(JSON.stringify(element)));
			}
		});
		if (copiedManifest.length === 0) {
			return Promise.resolve();
		}
		this.on('fileload', this.handleFileload, this);
		this.loadManifest(copiedManifest);
		return new Promise((resolve) => {
			this.on('complete', (event) => {
				this.handleLoadComplete();
				resolve(this);
			});
		});
	}

	handleFileload(event) {
		if (this.cache) {
			this.cache.add(event);
		}
	}

	handleLoadComplete() {
		this.destroy();
		this.removeAll();
	}
}

export default AssetLoader;