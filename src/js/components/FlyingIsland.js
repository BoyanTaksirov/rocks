const PIXI = require("pixi.js");
const decToHexColor = require("../globals").decToHexColor;
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const FLYING_ISLANDS_MIN_STEP = require("../globals").FLYING_ISLANDS_MIN_STEP;
const FLYING_ISLANDS_MAX_STEP = require("../globals").FLYING_ISLANDS_MAX_STEP;
const FLYING_ISLANDS_MIN_WIDTH_PERCENT = require("../globals").FLYING_ISLANDS_MIN_WIDTH_PERCENT;
const FLYING_ISLANDS_MAX_WIDTH_PERCENT = require("../globals").FLYING_ISLANDS_MAX_WIDTH_PERCENT;
const FLYING_ISLANDS_TINT_RANGE = require("../globals").FLYING_ISLANDS_TINT_RANGE;

module.exports = class FlyingIsland {
    constructor(parentContainer, textures, deviceCoef, y = null, options = null, rotate = null, scale = 1) {

        this.textures = textures;
        this.deviceCoef = deviceCoef;
        this.rotateStep = (rotate) ? this.getRotateStep() : null;

        this.scale = scale;

        this.widthPercent;
        this.widthPercentValue;
        this.xStep;
        this.tintColorHex;
        this.zIndex;

        this.container;

        this.widthPercentValue = (options && options.widthPercent) ? this.getWidthPercent(options.widthPercent) : this.getWidthPercent();
        this.alphaValue = (options && (options.alpha || options.alpha === 0)) ? options.alpha : this.getAlphaSilhouette();
        this.zIndex = (options && options.zIndex) ? options.zIndex : Math.round(this.widthPercentValue * 100);
        this.xStep = (options && options.xStep) ? options.xStep : this.widthPercent * (FLYING_ISLANDS_MAX_STEP - FLYING_ISLANDS_MIN_STEP) + FLYING_ISLANDS_MIN_STEP;
        this.textureIndex = ((options && options.textureIndex) || (options && options.textureIndex === 0)) ? options.textureIndex : Math.floor(Math.random() * this.textures.length);

        var texture = this.textures[this.textureIndex];
        if(!texture) {
            var index = Math.floor(Math.random()*this.textures.length);
            texture = this.textures[index];
        }

        this.create(texture);
        this.addToContainer(parentContainer);

        if (this.spriteSl) {
            this.spriteSl.alpha = this.alphaValue;

            //console.log("this.spriteSl.alpha: " + this.spriteSl.alpha);
        }

        this.container.zIndex = this.zIndex;

        //console.log("zIndex: " + this.zIndex);

        this.container.x = INIT_SCREEN_DIMENSIONS.width + this.container.width + Math.random() * INIT_SCREEN_DIMENSIONS.width * 0.7;
        this.container.y = y;
        if (!this.container.y) {
            this.container.y = this.getYCoord();
        }

        this.container.pivot.x = this.sprite.width * 0.5;
        this.container.pivot.y = this.sprite.height * 0.5;
    }

    getWidthPercent(widthPercent = null) {
        if (widthPercent) {
            this.widthPercent = widthPercent;
        } else {
            this.widthPercent = Math.random();
        }

        var widthPercentValue = this.widthPercent * (FLYING_ISLANDS_MAX_WIDTH_PERCENT - FLYING_ISLANDS_MIN_WIDTH_PERCENT) + FLYING_ISLANDS_MIN_WIDTH_PERCENT;

        return widthPercentValue;
    }

    getRotateStep() {
        return Math.random() * 0.5;
    }

    getAlphaSilhouette() {
        var alphaValue = 1 - this.widthPercent;

        return alphaValue;
    }

    getWidth() {
        return this.container.width;
    }

    getYCoord() {
        var parentContainer = this.getParentContainer();
        var yPos =  Math.random() * (INIT_SCREEN_DIMENSIONS.height*0.75) + INIT_SCREEN_DIMENSIONS.height*0.1;
    
        var point = new PIXI.Point(0, yPos);
        var localPoint = parentContainer.toLocal(point, this.stage);

        //console.log("localPoint.y: " + localPoint.y);

        return localPoint.y;
    }

    create(textures) {
        this.container = new PIXI.Container();

        this.sprite = PIXI.Sprite.from(textures.base);
        this.container.addChild(this.sprite);

        if (textures.silhouette) {
            this.spriteSl = PIXI.Sprite.from(textures.silhouette);
            this.spriteSl.blendMode = PIXI.BLEND_MODES.SCREEN;
            this.container.addChild(this.spriteSl);
        }

        this.setDimensions();
    }

    setXPos (xPos) {
        this.container.x = xPos;
    }

    setDimensions() {
        var ratio = this.sprite.texture.width / this.sprite.texture.height;
        this.container.width = INIT_SCREEN_DIMENSIONS.width * this.widthPercentValue*this.scale;
        this.container.height = this.container.width / ratio;
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

    destroy() {
        this.removeFromContainer();
        this.container.destroy();
    }

    update() {
        this.container.x -= this.xStep * this.deviceCoef.coef;
        if (this.rotateStep) {
            this.container.angle += this.rotateStep;
        }
        if (this.container.x <= - this.container.width) {
            this.textureIndex++;
            if (this.textureIndex >= this.textures.length) {
                this.textureIndex = 0;
            }

            this.sprite.texture = this.textures[this.textureIndex].base;
            if (this.spriteSl) {
                this.spriteSl.texture = this.textures[this.textureIndex].silhouette;
            }
            this.setDimensions();

            this.container.x = INIT_SCREEN_DIMENSIONS.width + this.container.width;
            this.container.y = this.getYCoord();
        }
    }
}