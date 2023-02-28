const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;

module.exports = class Explosion {
    constructor(parentContainer, textureRes, x, y, scaleFactor = 1, callback = null, powerRing = false, frameStop = null) {

        this.callback = callback;
        this.powerRing = powerRing;

        this.frameStop = frameStop;

        this.finished = false;

        this.animatedSprite = new PIXI.AnimatedSprite(textureRes);
        this.animatedSprite.x = x;
        this.animatedSprite.y = y;
        this.animatedSprite.scale = new PIXI.ObservablePoint(null, null, scaleFactor, scaleFactor);
        this.animatedSprite.animationSpeed = 1.2;
        this.animatedSprite.loop = false;
        this.animatedSprite.anchor.set(0.5);
        this.animatedSprite.angle = Math.random()*360;
        this.animatedSprite.zIndex = 30;
        if (this.powerRing) {
            this.animatedSprite.blendMode = PIXI.BLEND_MODES.SCREEN;
        }
        //this.animatedSprite.blendMode = PIXI.BLEND_MODES.SCREEN;  // DEBUG;
        this.addToContainer(parentContainer);

        this.onNewFrame = this.onNewFrame.bind(this);

        this.animatedSprite.onFrameChange = this.onNewFrame;
        this.animatedSprite.gotoAndPlay(0);
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.animatedSprite);
        }
    }

    removeFromContainer() {
        if (this.animatedSprite.parent) {
            this.animatedSprite.parent.removeChild(this.animatedSprite);
        }
    }

    getParentContainer() {
        return this.animatedSprite.parent;
    }

    onNewFrame() {
        var frameToStop = (this.frameStop) ? this.frameStop : this.animatedSprite.textures.length - 1;
        if (this.animatedSprite.currentFrame >= frameToStop) {
            this.animatedSprite.stop();
            if (this.callback) {
                this.callback();
            }

            //console.log("finished!");
            this.finished = true;
        }
    }

    getScale() {
        return this.animatedSprite.scale.x;
    }

    setZIndex(zIndex) {
        this.animatedSprite.zIndex = zIndex;
    }

    stopAnim() {
        this.animatedSprite.stop();
    }

    setPosition(point) {
        //console.log("PR Point: " + point.x + " " + point.y);
        this.animatedSprite.x = point.x;
        this.animatedSprite.y = point.y;

        //console.log("Anim Sprite: " + this.animatedSprite.x + " " + this.animatedSprite.y);
    }

    destroy() {
        this.removeFromContainer();
        this.animatedSprite.destroy();
    }
}