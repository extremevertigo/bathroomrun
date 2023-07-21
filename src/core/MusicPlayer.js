
class MusicPlayer {

    constructor(player = createjs.Sound, volume = 1) {
        this.player = player;
		this.volume = volume;
        this.instance = null;
        this.instanceName = '';
    }
    play(audio) {
        if(audio){
            if (this.instance) {
                let previousInstance = this.instance;
                let tween = this.fadeOutMusic(previousInstance);
                tween.call(previousInstance.stop, null, previousInstance);
            }

            this.instanceName = audio;
            this.instance = this.player.play(audio, { volume: 0, loop: -1 });
            this.fadeInMusic(this.instance);
            return this.instance;
        } else {
            this.instance.play();
        }
    }

    stop() {
        if (this.instance) {
            this.instance.stop();
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.instance) {
            this.instance.volume = volume;
        }
    }

    fadeIn()
    {
        this.fadeInMusic(this.instance);
    }

	fadeOut()
	{
		this.fadeOutMusic(this.instance);
	}

    fadeOutMusic(instance, time = 100) {
        return cjs.Tween.get(instance)
            .to({ volume: 0 }, time);
    }

    fadeInMusic(instance, time = 100) {
        return cjs.Tween.get(instance)
            .to({ volume: this.volume }, time);
    }
}

export default MusicPlayer;