const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const LEVEL_CONFIGURATION = require("../globals").LEVEL_CONFIGURATION;
const LANDSCAPE = require("../globals").LANDSCAPE;
const PORTRAIT = require("../globals").PORTRAIT;


module.exports = class InfoLabel {
    constructor(parentContainer, gameModel, appModel) {
        this.bmpTextContainer;
        this.bmpText;

        this.gameModel = gameModel;
        this.appModel = appModel;

        this.bkg;

        this.isMobile = this.appModel.getIsMobile();

        this.create();
        this.addToContainer(parentContainer);
    }

    create() {
        this.bmpTextContainer = new PIXI.Container();
        this.bmpTextContainer.sortableChildren = true;

        this.bmpText = new PIXI.BitmapText("blabla", {
            fontName: 'RubikOne',
            fontSize: 10,
            align: 'left',
        });

        this.bkg = new PIXI.Graphics();
        this.bkg.clear();
        this.bkg.lineStyle(0, 0xffffff);
        this.bkg.beginFill(0xffffff, 0.5);
        this.bkg.drawRect(0, 0, window.innerWidth, window.innerHeight);
        this.bkg.endFill();
        this.bmpTextContainer.addChild(this.bkg);
        this.bkg.zIndex = 10;

        this.bmpTextContainer.addChild(this.bmpText);
        this.bmpText.zIndex = 20;

        this.resize();
    }

    resize() {
        var parentContainer = this.getParentContainer();
        if(!parentContainer) {
            return;
        }

        var screenMode = this.appModel.getScreenMode();
        var level = this.gameModel.getLevel();
        var text = LEVEL_CONFIGURATION[level].levelText;
        var fontSize = 50;

        if (this.isMobile && screenMode === PORTRAIT) {
            text = LEVEL_CONFIGURATION[level].levelTextMobile;
            fontSize = window.innerWidth / 36;
        }

        if (parentContainer) {
            this.bkg.width = window.innerWidth / parentContainer.scale.x;
            this.bkg.height = window.innerHeight / parentContainer.scale.y;
        }

        this.bmpText.text = text;
        this.bmpText.fontSize = fontSize;

        var xPos = 0;
        var yPos = (INIT_SCREEN_DIMENSIONS.height - this.bmpText.height) / 2;

        this.bmpText.x = xPos;
        this.bmpText.y = yPos;
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.bmpTextContainer);
        }

        this.bkg.width = window.innerWidth / parentContainer.scale.x;
        this.bkg.height = window.innerHeight / parentContainer.scale.y;
    }

    removeFromContainer() {
        if (this.bmpTextContainer.parent) {
            this.bmpTextContainer.parent.removeChild(this.infoCobmpTextContainerntainer);
        }
    }

    getParentContainer() {
        return this.bmpTextContainer.parent;
    }

    setPosition(position) {
        this.bmpTextContainer.x = position.x;
        this.bmpTextContainer.y = position.y;
    }

    setZIndex(zIndex) {
        this.bmpTextContainer.zIndex = zIndex;
    }

    destroy() {
        this.removeFromContainer();
        this.bmpTextContainer.destroy(true);
    }

}