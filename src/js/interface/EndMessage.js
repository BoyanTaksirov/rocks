const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const PORTRAIT = require("../globals").PORTRAIT;
const END_MESSAGE = require("../globals").END_MESSAGE;
const END_MESSAGE_MOBILE = require("../globals").END_MESSAGE_MOBILE;
const Explosion = require("../components/Explosion");

module.exports = class EndMessage {
    constructor(parentContainer, textures, soundManager, appModel) {

        this.bmpText;
        this.explosions = [];
        this.container;

        this.soundManager = soundManager;
        this.appModel = appModel;

        const isPortrait = (this.appModel.getIsMobile() && (this.appModel.getScreenMode() === PORTRAIT)) ? true : false;

        const text = (isPortrait) ? END_MESSAGE_MOBILE : END_MESSAGE;

        this.create(text, isPortrait);

        this.addToContainer(parentContainer);

        this.createExplosions(textures);
    }

    create(text, isPortrait) {
        this.container = new PIXI.Container();
        this.container.zIndex = 200;
        this.container.sortableChildren = true;

        const fontSize = (isPortrait) ? 100 : 200;

        this.bmpText = new PIXI.BitmapText(text, {
            fontName: 'SFAftershockDebris',
            fontSize: fontSize,
            align: 'center',
        });

        this.bmpText.zIndex = 10000;
        this.container.addChild(this.bmpText);
    }

    createExplosions(textures) {
        var numExplosions = Math.round(INIT_SCREEN_DIMENSIONS.width / 120);

        var parentContainerScale = this.getParentContainer().scale.x;
        if (window.innerWidth > INIT_SCREEN_DIMENSIONS.width / parentContainerScale) {
            numExplosions = Math.round(window.innerWidth / 120);
        }

        for (var i = 0; i < numExplosions; i++) {
            var scaleFactor = Math.random() * 1.2 + 0.5;
            var stopFrame = Math.floor(Math.random() * 5) + 12;
            var xPos = (textures[0].width * 0.5) * i;
            var explosion = new Explosion(this.container, textures, xPos, INIT_SCREEN_DIMENSIONS.height * 0.48, scaleFactor, null, false, stopFrame);
            explosion.setZIndex(Math.round(scaleFactor * 100));
            this.explosions.push(explosion);

            this.soundManager.play("SOUND_expl4");
        }
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();

        parentContainer.addChild(this.container);

        var xPos = (INIT_SCREEN_DIMENSIONS.width - this.bmpText.width) / 2;
        var yPos = (INIT_SCREEN_DIMENSIONS.height - this.bmpText.height) / 2;

        const isPortrait = (this.appModel.getIsMobile() && (this.appModel.getScreenMode() === PORTRAIT)) ? true : false;

        if (isPortrait) {
            xPos = (window.innerWidth / parentContainer.scale.x - this.bmpText.width) / 2;
        }

        this.bmpText.x = xPos;
        this.bmpText.y = yPos;
    }

    removeFromContainer() {
        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
    }

    getParentContainer() {
        return this.container.parent;
    }

    destroy() {
        this.removeFromContainer();
        this.bmpText.destroy();

        for (var i = 0; i < this.explosions.length; i++) {
            this.explosions[i].destroy();
        }
    }
}