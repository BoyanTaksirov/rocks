const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const MIN_RPU_SPEED = require("../globals").MIN_RPU_SPEED;
const MAX_RPU_SPEED = require("../globals").MAX_RPU_SPEED;
const RPU_MA_LENGTH = require("../globals").RPU_MA_LENGTH;
const RPU_TYPE_1 = require("../globals").RPU_TYPE_1;
const RPU_TYPE_2 = require("../globals").RPU_TYPE_2;
const RPU_TYPE_3 = require("../globals").RPU_TYPE_3;
const RPU_TYPE_1_VALUE = require("../globals").RPU_TYPE_1_VALUE;
const RPU_TYPE_2_VALUE = require("../globals").RPU_TYPE_2_VALUE;
const RPU_TYPE_3_VALUE = require("../globals").RPU_TYPE_3_VALUE;

module.exports = class PowerUp {
    constructor(parentContainer, textures, upperTerrain, lowerTerrain, stage, deviceCoef, x, y, type, scale = 0.2) {
        this.textures = textures;
        this.upperTerrain = upperTerrain;
        this.lowerTerrain = lowerTerrain;
        this.stage = stage;
        this.scale = scale;
        this.deviceCoef = deviceCoef;
        this.type = type;
        this.value;

        this.container;
        this.sprite;
        this.text;

        this.xStep;

        this.yCoords = [];

        switch (type) {
            case RPU_TYPE_1:
                this.value = RPU_TYPE_1_VALUE;
                break;

            case RPU_TYPE_2:
                this.value = RPU_TYPE_2_VALUE;
                break;

            case RPU_TYPE_3:
                this.value = RPU_TYPE_3_VALUE;
                break;
        }

        this.taken = false;
        this.forDestroy = false;
        this.destroyCounter = 0;

        this.deviationPercent = Math.random() - 0.5;

        this.create();
        this.setPosition({ x: x, y: y });
        this.addToContainer(parentContainer);
    }

    create() {
        this.container = new PIXI.Container();
        this.sprite = new PIXI.AnimatedSprite(this.textures);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.5;
        this.container.scale = new PIXI.ObservablePoint(null, null, this.scale, this.scale);
        this.container.addChild(this.sprite);

        this.sprite.play();

        this.xStep = Math.random() * (MAX_RPU_SPEED - MIN_RPU_SPEED) + MIN_RPU_SPEED;
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

    setPosition(position) {
        this.container.x = position.x;
        this.container.y = position.y;
    }

    setZIndex(zIndex) {
        this.container.zIndex = zIndex;
    }

    getBounds() {
        var bounds = this.sprite.getBounds();
        var parentContainer = this.getParentContainer();
        var point = new PIXI.Point(bounds.x, bounds.y);
        var localPoint = parentContainer.toLocal(point, this.stage);
        var point1 = { x: localPoint.x, y: localPoint.y };
        var point2 = { x: localPoint.x + bounds.width, y: localPoint.y + bounds.height };

        return [point1, point2];

    }

    getType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }

    collisionTest(point) {
        var bounds = this.getBounds();
        var b1 = bounds[0];
        var b2 = bounds[1];
        if (point.x > b1.x && point.x < b2.x &&
            point.y > b1.y && point.y < b2.y) {
            return true;
        }

        return false;
    }

    initiateDestroy() {
        this.taken = true;
    }

    update() {
        if (this.forDestroy) {
            return;
        }

        if (this.taken) {
            var currentScale = this.container.scale.x;
            currentScale -= 0.01;
            this.container.scale.set(currentScale);
            if (this.container.scale.x <= 0) {
                this.forDestroy = true;
            }

            return;
        }

        this.container.x -= this.xStep*this.deviceCoef.coef;

        var currentPoint = { x: this.container.x, y: this.container.y }

        var upperPointUpdated = this.upperTerrain.getTerrainInterpolationPoint(currentPoint, this.getParentContainer());
        var lowerPointUpdated = this.lowerTerrain.getTerrainInterpolationPoint(currentPoint, this.getParentContainer());

        var averageY = (upperPointUpdated.y + lowerPointUpdated.y) / 2;
        var deviation = (lowerPointUpdated.y - upperPointUpdated.y) * this.deviationPercent;
        averageY += deviation;

        this.yCoords.push(averageY);
        if (this.yCoords.length > RPU_MA_LENGTH) {
            var count = this.yCoords.length - RPU_MA_LENGTH;
            this.yCoords.splice(0, count);
        }

        var mAverageY = this.yCoords.reduce(this.sumElements, 0);
        mAverageY /= this.yCoords.length;

        this.container.x = currentPoint.x;
        this.container.y = mAverageY;

        if (this.container.x < -100) {
            this.forDestroy = true;
        }
    }

    sumElements(total, num) {
        return total + num;
    }

    destroy() {
        this.removeFromContainer();
    }
}