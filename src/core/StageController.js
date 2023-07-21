
class stageController {
    constructor() {
        this.current = null;
        this.allScenes = {};
        this.mainLayer = null;
        this.transitionLayer = null;
    }

    registerScene(name, scene) {
        this.allScenes[name] = scene;
    }

    setMainLayer(layer) {
        this.mainLayer = layer;
    }

    setTransitionLayer(transition, layer) {
        this.transition = transition;
        this.transitionLayer = layer;
        layer.addChild(transition);
    }

    gotoScene(name, bool) {
        if (this.current) {
            this.unloadSceneThenLoad(name, bool);
        } else {
            this.loadScene(name, bool);
        }
    }

    async unloadSceneThenLoad(name, bool){
        if(bool){return;}
        this.current.setActive(false);
        this.current.end();
        await this.current.animateOut();
        if(this.transition){
            await this.transition.animateIn();
        }
        this.unloadAndRemove();
        this.loadScene(name);
    }

    async loadScene(name, bool){
        this.current = new this.allScenes[name]();
        this.mainLayer.addChild(this.current);
        await this.current.preload();
        this.current.build();
        if (this.transition && !bool) {
            await this.transition.animateOut();
        }
        await this.current.animateIn();
        this.setActiveAndStart();
    }
    setActiveAndStart() {
        this.current.setActive(true);
        this.current.start();
    }

    unloadAndRemove() {
        this.current.unload();
        this.removeScene(this.current, this.mainLayer);
    }
    removeScene(scene, layer) {
        if (scene) {
            scene.removeAllEventListeners();
            scene.removeAllChildren();
            scene = null;
        }
        if (layer) {
            layer.removeAllEventListeners();
            layer.removeAllChildren();
        }
    }
}

export default stageController;