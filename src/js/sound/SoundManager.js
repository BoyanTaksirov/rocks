const PIXI = require("pixi.js");
const sound = require("@pixi/sound").sound;  //Sound Library

module.exports = class SoundManager {
    constructor(soundsUrl) {
        this.sounds = {};

        this.currentSoundName;

        this.createSounds(soundsUrl);
    }

    createSounds(soundsUrl) {
        for (var i = 0; i < soundsUrl.length; i++) {
            this.sounds[soundsUrl[i].name] = sound.add(soundsUrl[i].name, soundsUrl[i].path);
        }
    }

    play(soundName) {
        this.currentSoundName = soundName;
        this.sounds[soundName].play();
    }

    setLooped(soundName, isLooped) {
        this.sounds[soundName].loop = isLooped;
    }

    setVolume(soundName, volume) {
        this.sounds[soundName].volume = volume;
    }

    stopSound(soundName) {
        this.sounds[soundName].stop();

        //console.log("SOUND " + name + " STOPPED!");
    }

    stopAllSounds() {
        for(var soundName in this.sounds) {
            if(this.sounds.hasOwnProperty(soundName)) {
                this.stopSound(soundName);
            }
        }
    }
}