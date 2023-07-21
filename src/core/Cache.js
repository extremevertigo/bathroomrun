/**
 * Simple cache system for storing data in an Object
 * Designed to be used with AssetLoader
    assetLoader.addEventListener('load', (event) => {
        cache.add(event);
    });
 */
class Cache {
    constructor() {
        this.files = {};
    }

    /**
     * Add a file to the cache
     * @param {Event} event - the 'fileload' event from a createjs.LoadQueue
     */
    add(event) {
        // Store in the correct object depending on the file's type
        switch (event.item.type) {
            case createjs.Types.SOUND:
                // Ignore sounds, because SoundJS has it's own cache.
                break;
            case 'flash':
                this.files[event.item.id] = event.item.comp.getLibrary();
                break;
            default:
                this.files[event.item.id] = event.result;
                break;
        }
    }

    /**
     * Return the file loaded in the cache
     * @param {String} name - the unique id name of the loaded file
     */
    get(name) {
        return this.files[name];
    }

    /**
     * Remove the cache data by Array Manifest or String name
     * @param {Array || String} item - the unique id name to remove or the Array Manifest with Objects with String id properties
     */
    remove(item) {
        if (Array.isArray(item)) {
            item.forEach(element => this.remove(element.id));
        } else {
            delete this.files[item];
        }
    }

    /**
     * Clear out the cache
     */
    clear() {
        this.files = {};
    }
}

export default Cache;