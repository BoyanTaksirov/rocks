const { AnimatedSprite } = require("pixi.js");
const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const SAMOLET_Y_ACCELERATION = require("../globals").SAMOLET_Y_ACCELERATION;
const SAMOLET_MAX_Y_SPEED = require("../globals").SAMOLET_MAX_Y_SPEED;
const SAMOLET_Y_GRAVITY = require("../globals").SAMOLET_Y_GRAVITY;
const SAMOLET_MAX_Y_FALL = require("../globals").SAMOLET_MAX_Y_FALL;
const SAMOLET_MAX_ANGLE = require("../globals").SAMOLET_MAX_ANGLE;

//const RocketIndicator = require("../interface/RocketIndicator");

module.exports = class Samolet {
    constructor(texture, burner1Textures, burner2Textures, parentContainer, deviceCoef) {

        this.deviceCoef = deviceCoef;

        this.container;
        this.sprite;
        this.burner1;
        this.burner2;

        this.reduceVectorCoef = 0.99;

        this.stepX = 0;
        this.stepY = 0;

        this.stepYPressed = 0;

        this.pressed = false;

        this.collisionPoints;

        this.testGraphics;

        this.burnerTransition = "none";

        this.create(texture, burner1Textures, burner2Textures);

        this.container.x = this.setXPosition(INIT_SCREEN_DIMENSIONS.width * 0.15);
        this.container.y = INIT_SCREEN_DIMENSIONS.height * 0.5;

        if (parentContainer) {
            this.addToContainer(parentContainer);
        }

        this.calculateCollisionPoints();

        //this.createTestGraphics();
    }

    create(texture, burner1Textures, burner2Textures) {
        this.container = new PIXI.Container();
        this.sprite = PIXI.Sprite.from(texture);
        this.sprite.x = 0;
        this.sprite.y = 0;

        this.burner1 = new PIXI.AnimatedSprite(burner1Textures);
        this.burner1.scale = new PIXI.ObservablePoint(null, null, 1.2, 1.2);
        this.burner1.x = -this.burner1.width * 0.85;
        this.burner1.y = -this.burner1.height * 0.2;
        this.burner1.blendMode = PIXI.BLEND_MODES.SCREEN;

        this.burner2 = new PIXI.AnimatedSprite(burner2Textures);
        this.burner2.scale = new PIXI.ObservablePoint(null, null, 1.2, 1.2);
        this.burner2.x = -this.burner2.width * 0.85;
        this.burner2.y = -this.burner2.height * 0.2;
        this.burner2.blendMode = PIXI.BLEND_MODES.SCREEN;

        this.container.addChild(this.burner1, this.burner2, this.sprite);

        this.container.scale = new PIXI.ObservablePoint(null, null, 0.4, 0.4);

        this.container.pivot.x = this.container.width - (this.sprite.width * 0.5 * this.container.scale.x);
        this.container.pivot.y = this.container.height - (this.sprite.height * 0.2 * this.container.scale.y);

        this.switchTurboBurner(false);
    }

    switchTurboBurner(isTurbo) {
        if (isTurbo) {
            this.burnerTransition = "turbo";
            this.burner2.play();
            this.burner2.visible = true;


        } else {
            this.burnerTransition = "normal";
            this.burner1.play();
            this.burner1.visible = true;
        }
    }

    /*switchTurboBurner(isTurbo) {
        if(isTurbo) {
            this.burner1.visible = false;
            this.burner1.stop();

            this.burner2.visible = true;
            this.burner2.play();
        } else {
            this.burner1.visible = true;
            this.burner1.play();

            this.burner2.visible = false;
            this.burner2.stop();
        }
    }*/

    createTestGraphics() {
        this.testGraphics = new PIXI.Graphics();

        this.container.parent.addChild(this.testGraphics);

        this.drawTestGraphics();

        this.testGraphics.zIndex = 100000;
    }

    drawTestGraphics() {
        this.testGraphics.clear();
        this.testGraphics.position.set(0, 0);
        this.testGraphics.lineStyle(2, 0xff0000);

        this.testGraphics.moveTo(this.collisionPoints[0].x, this.collisionPoints[0].y);
        for (var i = 0; i < this.collisionPoints.length; i++) {
            this.testGraphics.lineTo(this.collisionPoints[i].x, this.collisionPoints[i].y);
        }

        this.testGraphics.lineTo(this.collisionPoints[0].x, this.collisionPoints[0].y);
    }

    calculateCollisionPoints() {
        this.collisionPoints = [
            { x: this.container.x - this.sprite.width * 0.5 * this.container.scale.x, y: this.container.y, scp: true },
            { x: this.container.x, y: this.container.y - this.sprite.height * 0.5 * this.container.scale.y, scp: true },
            { x: this.container.x + this.sprite.width * 0.5 * this.container.scale.x, y: this.container.y, scp: true },
            { x: this.container.x, y: this.container.y + this.sprite.height * 0.5 * this.container.scale.y, scp: true },
        ]
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.container);
        }
    }

    removeFromContainer() {
        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
    }

    getParentContainer() {
        return this.container.parent;
    }

    setZIndex(zIndex) {
        this.container.zIndex = zIndex;
    }

    initiateMove() {
        this.pressed = true;
        this.stepY /= 2;

        this.switchTurboBurner(true);
    }

    clearVector() {
        this.pressed = false;
        this.stepY /= 2;

        this.switchTurboBurner(false);
    }

    getCollisionPoints() {
        return this.collisionPoints;
    }

    getX() {
        return this.container.x;
    }

    getY() {
        return this.container.y;
    }

    getPosition() {
        return { x: this.container.x, y: this.container.y };
    }

    getCenterPoint() {
        return { x: this.container.x, y: this.container.y };
    }

    setXPosition(xValue) {
        this.container.x = xValue;
    }

    update() {

        if (this.pressed) {
            this.stepY -= SAMOLET_Y_ACCELERATION * this.deviceCoef.coef;
            if (this.stepY < SAMOLET_MAX_Y_SPEED) {
                this.stepY = SAMOLET_MAX_Y_SPEED;
            }

            this.container.angle -= 0.2;
            if (this.container.angle <= -SAMOLET_MAX_ANGLE) {
                this.container.angle = -SAMOLET_MAX_ANGLE;
            }
        } else {
            this.stepY += SAMOLET_Y_GRAVITY * this.deviceCoef.coef;
            if (this.stepY > SAMOLET_MAX_Y_FALL) {
                this.stepY = SAMOLET_MAX_Y_FALL;
            }

            this.container.angle += 0.3;
            if (this.container.angle >= 0) {
                this.container.angle = 0;
            }
        }

        this.container.y += this.stepY;

        if (this.container.y >= INIT_SCREEN_DIMENSIONS.height - this.container.height * 0.5) {
            this.container.y = INIT_SCREEN_DIMENSIONS.height - this.container.height * 0.5;
        } else if (this.container.y < this.container.height * 0.5) {
            this.container.y = this.container.height * 0.5;
        }

        this.calculateCollisionPoints();
        //this.drawTestGraphics();

        if (this.burnerTransition === "turbo") {
            this.burner2.alpha += 0.05;
            if (this.burner2.alpha >= 1) {
                this.burner2.alpha = 1;
                this.burner1.visible = false;
                this.burner1.stop();
                this.burnerTransition = "none";
            }
        } else if (this.burnerTransition === "normal") {
            this.burner2.alpha -= 0.05;
            if (this.burner2.alpha <= 0) {
                this.burner2.alpha = 0;
                this.burner2.visible = false;
                this.burner2.stop();
                this.burnerTransition = "none";
            }
        }

        return true;
    }

    destroy() {
        this.removeFromContainer();
        //console.log(`BOOM!`);
    }
}