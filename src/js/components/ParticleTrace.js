const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;

module.exports = class ParticleTrace {
    constructor(parentContainer, texture, position, rotationStep = 1, size = INIT_SCREEN_DIMENSIONS.width*0.02, scaleStep = 0.01, alpha = 0.9, alphaStep = 0.01) {
        this.texture = texture;
        this.position = position;
        this.rotationStep = rotationStep;
        this.size = size;
        this.scaleStep = scaleStep;
        this.alpha = alpha;
        this.alphaStep = alphaStep;

        this.finished = false;

        this.create();
        this.addToContainer(parentContainer);

    }

    create() {
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.anchor.set(0.5);
        this.sprite.width = this.size;
        this.sprite.height = this.size;
        this.sprite.alpha = this.alpha;
        //this.sprite.scale = new PIXI.ObservablePoint(null, null, scaleFactor, scaleFactor);

        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.sprite);
        }
    }

    removeFromContainer() {
        if (this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
    }

    getParentContainer() {
        return this.sprite.parent;
    }

    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    update() {
        if(this.finished) {
            return this.finished;
        }

        this.sprite.scale.x += this.scaleStep;
        this.sprite.scale.y += this.scaleStep;
        this.sprite.angle += this.rotationStep;

        this.sprite.alpha -= this.alphaStep;

        if(this.sprite.alpha <= 0) {
            this.sprite.alpha = 0;
            this.finished = true;
        }

        return this.finished;

        //console.log("PARTICLE.X: " + this.sprite.x + " PARTICLE.Y: " + this.sprite.y);
    }

}