const LANDSCAPE = require("../globals").LANDSCAPE;
const PORTRAIT = require("../globals").PORTRAIT;
const EN = require("../globals").EN;
const BG = require("../globals").BG;
const BEGIN_SCREEN = require("../globals").BEGIN_SCREEN;
const GAME_SCREEN = require("../globals").GAME_SCREEN;
const END_SCREEN = require("../globals").END_SCREEN;

module.exports = class Model {
    constructor() {
        this.screenMode;
        this.appState;
        this.isMobile;
        this.language = BG;
        this.currentScreen = BEGIN_SCREEN;
    }

    setScreenMode(mode) {
        if (mode !== LANDSCAPE && mode !== PORTRAIT) {
            throw new Error("IMPROPER SCREEN MODE GIVEN!");
        }

        this.screenMode = mode;
    }

    getScreenMode() {
        return this.screenMode;
    }

    setIsMobile(isMobile) {
        this.isMobile = isMobile;
    }

    getIsMobile() {
        return this.isMobile;
    }

    setLanguage(lang) {
        if (lang !== EN && lang !== BG) {
            throw new Error("IMPROPER LANGUAGE GIVEN!");
        }

        this.language = lang;
    }

    getLanguage() {
        return this.language;
    }

    setCurrentScreen(screen) {
        if (screen !== BEGIN_SCREEN && screen !== GAME_SCREEN && screen !== END_SCREEN) {
            throw new Error("IMPROPER SCREEN GIVEN!");
        }

        this.currentScreen = screen;
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}