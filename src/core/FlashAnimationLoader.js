class FlashAnimationLoader extends createjs.AbstractLoader {
    constructor(loadItem, preferXHR) {
        super(loadItem, preferXHR, "flash");
        this._manifestQueue = null;
        this.compositionsIDMap = {};
    }

    static get MANIFEST_PROGRESS() {
        return 0.25;
    };

    static canLoadItem(item) {
        return item.type === "flash";
    }

    destroy() {
        super._destroy();
        this._manifestQueue.close();
    }

    _createRequest() {
        this._request = new createjs.JavaScriptLoader(this._item);
    }

    handleEvent(event) {
        switch (event.type) {
            case "complete":

                this._rawResult = event.target.getResult(true);
                if (!AdobeAn.compositions) throw ("Using out of date flash export! " + this._item.src);


                let compId;

                if (this.compositionsIDMap[this._item.src]) {
                    compId = this.compositionsIDMap[this._item.src];
                }
                else {
                    let compIds = Object.keys(AdobeAn.compositions);

                    for (let i = 0, l = compIds.length; i < l; i++) {
                        if (!this.compositionsIDMap[compIds[i]]) {
                            compId = compIds[i];
                            break;
                        }
                    }
                    this.compositionsIDMap[this._item.src] = compId;
                }

                this._item.assetsPath = this._item.src.slice(0, this._item.src.lastIndexOf('/') + 1);

                let comp = this._item.comp = AdobeAn.compositions[compId];
                let lib = this._result = this._item.lib = comp.getLibrary();

                // Clean up. Keep lib references exclusively with this.compositionsIDMap
                delete AdobeAn.compositions[compId];

                if (!lib) {
                    throw ("Something went wrong. Lib not found");
                }

                this._sendProgress(FlashAnimationLoader.MANIFEST_PROGRESS);
                this._loadManifest(lib);
                return;

            case "progress":

                event.loaded *= FlashAnimationLoader.MANIFEST_PROGRESS;
                this.progress = event.loaded / event.total;
                if (isNaN(this.progress) || this.progress === Infinity) {
                    this.progress = 0;
                }
                this._sendProgress(event);
                return;
        }
        super._handleEvent(event);
    }

    _loadManifest(lib) {
        if (lib.properties.manifest && lib.properties.manifest.length) {
            let queue = this._manifestQueue = new createjs.LoadQueue(this._preferXHR, this._item.assetsPath, this._item.crossOrigin);
            queue.installPlugin(createjs.Sound);
            queue.on("complete", this._handleManifestComplete, this, true);
            queue.on("fileload", this._handleManifestFileLoad, this);
            queue.on("progress", this._handleManifestProgress, this);
            queue.on("error", this._handleManifestError, this, true);

            let manifest = [];
            for (let i = 0, l = lib.properties.manifest.length; i < l; i++) {
                // Don't load the freakin' sounds that Animate CC insists on putting in the export no matter what.
                if (lib.properties.manifest[i].src.indexOf('sound') === -1) {
                    manifest.push(lib.properties.manifest[i]);
                }
            }

            queue.loadManifest(manifest);
        } else {
            this._sendComplete();
        }
    }

    _handleManifestFileLoad(e) {
        if (e && (e.item.type === "image")) {
            let comp = this._item.comp;
            let images = comp.getImages();
            images[e.item.id] = e.result;
        }
    }

    _handleManifestComplete(e) {
        let comp = this._item.comp;
        let lib = comp.getLibrary();
        let ss = comp.getSpriteSheet();
        let queue = e.target;
        let ssMetadata = lib.ssMetadata;
        for (let i = 0; i < ssMetadata.length; i++) {
            ss[ssMetadata[i].name] = new createjs.SpriteSheet({ "images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames });
        }
        this._sendComplete();
    }

    _handleManifestProgress(event) {
        this.progress = event.progress * (1 - FlashAnimationLoader.MANIFEST_PROGRESS) + FlashAnimationLoader.MANIFEST_PROGRESS;
        this._sendProgress(this.progress);
    }

    _handleManifestError(event) {
        let newEvent = new createjs.Event("fileerror");
        newEvent.item = event.data;
        this.dispatchEvent(newEvent);
    }
}

export default FlashAnimationLoader;