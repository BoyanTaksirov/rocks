const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const degreesToRadians = require("../globals").degreesToRadians;
const radiansToDegrees = require("../globals").radiansToDegrees;

module.exports = class RocketIndicator {
    constructor(parentContainer, stage) {
        this.stage = stage;

        this.arrow;

        this.create();

        this.addToContainer(parentContainer);
    }

    create() {
        this.arrow = new PIXI.Graphics();
        this.arrow.clear();
        this.arrow.position.set(0, 0);
        this.arrow.lineStyle(4, 0xff0000);
        this.arrow.beginFill(0xff0000);
        this.arrow.moveTo(-INIT_SCREEN_DIMENSIONS.height * 0.01, 0);
        this.arrow.lineTo(0, -INIT_SCREEN_DIMENSIONS.height * 0.1);
        this.arrow.lineTo(INIT_SCREEN_DIMENSIONS.height * 0.01, 0);
        this.arrow.lineTo(-INIT_SCREEN_DIMENSIONS.height * 0.01, 0);
        this.arrow.endFill();
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.arrow);
        }
    }

    removeFromContainer() {
        if (this.arrow.parent) {
            this.arrow.parent.removeChild(this.arrow);
        }
    }

    getParentContainer() {
        return this.arrow.parent;
    }

    setPosition(position) {
        this.arrow.x = position.x;
        this.arrow.y = position.y;
    }

    setRotation(angle) {
        this.arrow.angle = 90 - angle;
    }

    setZIndex(zIndex) {
        this.arrow.zIndex = zIndex;
    }
}