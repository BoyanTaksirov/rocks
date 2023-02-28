const PIXI = require("pixi.js");
const BEGIN_SCREEN = require("../globals").BEGIN_SCREEN;
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const LANDSCAPE = require("../globals").LANDSCAPE;
const PORTRAIT = require("../globals").PORTRAIT;

module.exports = class BeginScreen {
    constructor(app, loadingModule, soundManager, appModel, switchGameScreen, globalContainer) {
        this.app = app;
        this.loadingModule = loadingModule;
        this.soundManager = soundManager;
        this.appModel = appModel;
        this.switchGameScreen = switchGameScreen;
        this.globalContainer = globalContainer;

        this.onPointerDown = this.onPointerDown.bind(this);

        this.idName = BEGIN_SCREEN;

        this.bkg;
        this.bkgPortrait;

        this.create();

        this.addEventListeners();
    }

    addEventListeners() {
        if (this.appModel.getIsMobile()) {
            this.container.on("pointerdown", this.onPointerDown);
        } else {
            this.container.on("mousedown", this.onPointerDown);
        }
    }

    addToContainer() {
        this.app.stage.addChild(this.container);
    }

    removeFromContainer() {
        this.app.stage.removeChild(this.container);
    }

    create() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.sortableChildren = true;

        this.bkg = new PIXI.Sprite(this.loadingModule.getNonAnimatedTexture("splash"));
        this.bkgPortrait = new PIXI.Sprite(this.loadingModule.getNonAnimatedTexture("splashPortrait"));

        this.container.width = INIT_SCREEN_DIMENSIONS.width;
        this.container.height = INIT_SCREEN_DIMENSIONS.height;

        this.resize();
    }

    onPointerDown() {
        this.switchGameScreen();
    }

    setLandscape() {
        this.container.addChild(this.bkg);
        this.container.removeChild(this.bkgPortrait);
    }

    setPortrait() {
        this.container.addChild(this.bkgPortrait);
        this.container.removeChild(this.bkg);
    }



    resize() {
        if (!this.container) {
            return;
        }

        var screenMode = this.appModel.getScreenMode();

        if (screenMode === PORTRAIT) {
            this.setPortrait();
        } else {
            this.setLandscape();
        }

        this.container.width = this.globalContainer.clientWidth;
        this.container.height = this.globalContainer.clientHeight;
    }
}