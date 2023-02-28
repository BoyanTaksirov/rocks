const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const MAX_ROCKET_STEP = require("../globals").MAX_ROCKET_STEP;
const ROCKET_ACCELERATION = require("../globals").ROCKET_ACCELERATION;
const degreesToRadians = require("../globals").degreesToRadians;
const radiansToDegrees = require("../globals").radiansToDegrees;

module.exports = class Raketa {
    constructor(textures, startPoint, angle, parentContainer, deviceCoef) {

        this.startPoint = startPoint;
        this.angle = -angle;

        this.deviceCoef = deviceCoef;

        this.sprite;

        this.stepX = 0;
        this.stepY = 0;
        this.coefX = Math.cos(degreesToRadians(angle));
        this.coefY = Math.sin(degreesToRadians(angle));
        this.acceleration = ROCKET_ACCELERATION;

        this.collisionPoint;

        this.testGraphics;

        this.create(textures);

        this.sprite.x = this.startPoint.x;
        this.sprite.y = this.startPoint.y;

        if (parentContainer) {
            this.addToContainer(parentContainer);
        }

        this.calculateCollisionPoint();

        //this.createTestGraphics();
    }

    create(textures) {
        this.sprite = new PIXI.AnimatedSprite(textures)

        var ratio = this.sprite.texture.width / this.sprite.texture.height;
        this.sprite.width = INIT_SCREEN_DIMENSIONS.width * 0.034;
        this.sprite.height = this.sprite.width / ratio;

        this.sprite.animationSpeed = 0.2;

        this.sprite.angle = this.angle;

        this.sprite.zIndex = 20;

        this.sprite.play();
    }

    createTestGraphics() {
        this.testGraphics = new PIXI.Graphics();

        this.drawTestGraphics();

        this.sprite.parent.addChild(this.testGraphics);

        this.testGraphics.zIndex = 10;
    }

    drawTestGraphics() {
        this.testGraphics.clear();
        this.testGraphics.position.set(0, 0);
        this.testGraphics.lineStyle(2, 0xff0000);
        this.testGraphics.beginFill(0xff0000);
        this.testGraphics.drawCircle(0, 0, INIT_SCREEN_DIMENSIONS.width * 0.005);
        this.testGraphics.endFill();
    }

    calculateCollisionPoint() {
        var sinValue = Math.sin(degreesToRadians(this.angle));
        var cosValue = Math.cos(degreesToRadians(this.angle));
        var xWidth = this.sprite.width * cosValue;
        var yHeight = this.sprite.width * sinValue;

        this.collisionPoint = { x: this.sprite.x + xWidth, y: this.sprite.y + yHeight };
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

        if (this.testGraphics) {
            this.testGraphics.parent.removeChild(this.testGraphics);
        }
    }

    getParentContainer() {
        return this.sprite.parent;
    }

    setZIndex(zIndex) {
        this.sprite.zIndex = zIndex;
    }

    getCollisionPoint() {
        return this.collisionPoint;
    }

    stopAnim() {
        this.sprite.stop();
    }

    update() {
        if (this.checkForOutScreen()) {
            return true;
        }

        this.stepX += (this.acceleration * this.coefX);
        if (this.stepX / this.coefX > MAX_ROCKET_STEP) {
            this.stepX = MAX_ROCKET_STEP * this.coefX;
        }
        this.stepY -= (this.acceleration * this.coefY);
        if (this.stepY / this.coefY < -MAX_ROCKET_STEP) {
            this.stepY = -MAX_ROCKET_STEP * this.coefY;
        }

        this.sprite.y += this.stepY*this.deviceCoef.coef;
        this.sprite.x += this.stepX*this.deviceCoef.coef;

        this.calculateCollisionPoint();

        if (this.testGraphics) {
            this.testGraphics.x = this.collisionPoint.x;
            this.testGraphics.y = this.collisionPoint.y;
        }

        return false;
    }

    checkForOutScreen() {

        if (this.sprite.x > INIT_SCREEN_DIMENSIONS.width) {
            return true;
        }

        if (this.sprite.x < 0) {
            return true;
        }

        if (this.sprite.y < 0) {
            return true;
        }

        if (this.sprite.y > INIT_SCREEN_DIMENSIONS.height) {
            return true;
        }



        return false;
    }

    destroy() {
        this.removeFromContainer();
        //console.log(`ROCKET OUT OF SCREEN!`);
    }
}