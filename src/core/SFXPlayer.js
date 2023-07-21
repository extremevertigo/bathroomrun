
class SFXPlayer {
    constructor(player = createjs.Sound, volume = 1) {
        this.player = player;
		this.volume = volume;
        this.instances = [];
    }

    play(audio, volume = this.volume, loop){
		let instance = this.player.play(audio, {volume: volume, loop: loop});
		instance.name = audio;
		instance.savedVolume = volume;
        instance.on('complete', event => this.handleInstanceComplete(event));
        this.instances.push(instance);
        return instance;
    }

    setVolume(volume){
        this.volume = volume;
        this.instances.forEach(instance => {
            instance.volume = volume;
        });
    }

    stopAll(){
        this.instances.forEach(instance => {
            instance.stop();
            instance.removeAllEventListeners();
        });
        this.instances = [];
	}

	stop(instance)
	{
		instance.stop();
		instance.removeAllEventListeners();
		this.instances.splice(this.instances.indexOf(instance), 1);
	}

    handleInstanceComplete(event){
        let instance = event.target;
        instance.removeAllEventListeners();
        this.instances.splice(this.instances.indexOf(instance), 1);
    }

}

export default SFXPlayer;