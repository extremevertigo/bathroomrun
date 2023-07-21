import './extensions/array-extended';
import './extensions/createjs-extended';
import './extensions/math-extended';
import './extensions/tweengroup';
import './tools/box2d/box2d';


import manifest from "./config/assets.json";
import Cache from './core/Cache';
import AssetLoader from "./core/AssetLoader";
import Device from './core/Device';
import Keyboard from './core/Keyboard';
import Layer from "./core/Layer";
import System from "./core/System";
import Transition from './core/Transition';
import Controller from "./core/StageController";
import SFXPlayer from "./core/SFXPlayer";
import MusicPlayer from "./core/MusicPlayer.js";
import Loader from './tools/Loader';
import Physics from './tools/Physics';

import Game from './scenes/Game';
import Title from './scenes/Title';


/** Display sizing information for this game */
const appDisplayOptions = {
    safeWidth: 768,
    safeHeight: 1024,
    maxWidth: 768,
    maxHeight: 1664
};

/** System with stage resizing and RAF */
const system = new System('content', 'stage', appDisplayOptions);

/** Controls switching between Scenes */
const stageController = new Controller();

/** Object to store loaded items */
const cache = new Cache();

/** Simple asset loader that stores on our Cache Object */
const assetLoader = new AssetLoader(cache);

const loader = new Loader();

/** Browser User Agent Testing */
const device = new Device();

const keyboard = new Keyboard();

/** Audio controllers */
const sfxPlayer = new SFXPlayer();
const musicPlayer = new MusicPlayer();

const physics = new Physics();
/** Black shape for transitioning between scenes */
const transition = new Transition(appDisplayOptions.maxWidth, appDisplayOptions.maxHeight);

/** Layers on the stage for sorting the game containers */
const layers = {
    Game: new Layer('Game', 0.5, 0.5),
    UI: new Layer('UI', 0.5, 0.5),
    Transition: new Layer('Transition', 0.5, 0.5)
};

const global = {
    extraLevel:null
};

// Start the Game
function start()
{
    //Set Larger Default Timeout to prevent slow servers from timing out: Default was 8000ms
    cjs.LoadItem.LOAD_TIMEOUT_DEFAULT = 60000;
    //Register SoundJS
    cjs.Sound.registerPlugins([cjs.WebAudioPlugin, cjs.HTMLAudioPlugin]);
    cjs.Sound.alternateExtensions = ["mp3"];

    // Enable touch (if not supported CreateJS will fail gracefully)
    if (device.mobile) {
        cjs.Touch.enable(system.stage, false);
        system.stage.enableDOMEvents(false);
    } else {
        system.stage.enableMouseOver(30);
    }

    /** Add the layers to the stage */
    addLayersToStage();

    // Register all our Scenes to the controller
	registerstageController();
    loader.build();
    layers.Transition.addChild(loader);
    loader.loadGame(manifest.Game);


    setTimeout(function(){
        if(window.edit){
            window.edit.init(system.stage);
        }
    }, 2000);

    createBox2dWorld();
}

function createBox2dWorld()
{
    physics.createWorld(0,35.8);
    physics.addContactListeners();
}

/**
 * Create the different layers for the game rendering
 */
function addLayersToStage()
{
    /** Push all the layers to the main stage */
    for (let layer in layers) {
        system.stage.addChild(layers[layer]);
    }
    system.resize();
}

/** Register all the Scenes to the stageController */
function registerstageController()
{
    stageController.registerScene("Game", Game);
    stageController.registerScene("Title", Title);
    stageController.setMainLayer(layers.Game);
    stageController.setTransitionLayer(transition, layers.Transition);
}


/**
 * Use the SFX controller to play an audio file
 * @param {String} audio - name of audio file to play
 */
function playSFX(audio, volume, loop) {
    return sfxPlayer.play(audio, volume, loop);
}

/**
 * Set the volume on the SFX controller
 * @param {Number} volume - volume to set the SFX player too
 */
function setSFXVolume(volume) {
    sfxPlayer.setVolume(volume);
}

function stopSFX(audio)
{
    sfxPlayer.stop(audio);
}
function stopAllSound()
{
    sfxPlayer.stopAll();
}

function fadeInSFX(audio, time){
    sfxPlayer.fadeInSound(audio, time);
}

function fadeOutSFX(audio, time){
    sfxPlayer.fadeOutSound(audio, time);
}

/**
 * Set the sound volume for the CreateJS Sound
 * @param {Number} volume - volume to set sound too
 */
function setSoundVolume(volume) {
    cjs.Sound.volume = volume;
}

function playMusic(audio) {
    musicPlayer.play(audio);
}
function stopMusic(){
    musicPlayer.stop();
}

/**
 * Set the volume of the music playing
 * @param {Number} volume - volume to set the music at
 */
function setMusicVolume(volume) {
    musicPlayer.setVolume(volume);
}

function fadeOutMusic()
{
    musicPlayer.instance.volume = 0;
}
function fadeInMusic()
{
    musicPlayer.instance.volume = 1;
}


export
{
    appDisplayOptions,
    assetLoader,
    loader,
    cache,
    device,
    keyboard,
    layers,
    manifest,
    system,
    transition,
    start,
    stageController,
    playSFX,
    setSFXVolume,
    musicPlayer,
    setSoundVolume,
    playMusic,
    stopMusic,
    fadeInMusic,
    fadeOutMusic,
    stopSFX,
    fadeInSFX,
    fadeOutSFX,
    stopAllSound,
    setMusicVolume,
    physics,
    global
};
