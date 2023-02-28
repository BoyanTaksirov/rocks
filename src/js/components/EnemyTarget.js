const PIXI = require("pixi.js");
const radiansToDegrees = require("../globals").radiansToDegrees;
const ParticleSource = require("./ParticleSource");

module.exports = class EnemyTarget {
    constructor(parentContainer, gameContainer, pTraceContainer, textures, particleTextures, particleHolder, stage, x, y, deviceCoef, scale = 0.5) {
        this.textures = textures;
        this.particleTextures = particleTextures;
        this.stage = stage;
        this.parentContainer = parentContainer;
        this.gameContainer = gameContainer;
        this.pTraceContainer = pTraceContainer;
        this.deviceCoef = deviceCoef;

        this.container;
        this.sprite;

        this.xStep;
        this.yStep;

        this.testGraphics;   //DEBUG

        this.particleSource;

        this.active = false;
        this.activeSteps = 400;

        this.create(scale, particleHolder);
        this.setPosition({ x: x, y: y });
        this.addToContainer(parentContainer);
    }

    create(scale, particleHolder) {
        this.container = new PIXI.Container();
        this.sprite = new PIXI.AnimatedSprite(this.textures);
        this.sprite.x = 0;
        this.sprite.y = 0;

        this.sprite.animationSpeed = 0.5;
        this.container.scale = new PIXI.ObservablePoint(null, null, scale, scale);
        this.container.addChild(this.sprite);

        var pivotOffset = this.getPivotOffset();

        this.container.pivot.x = pivotOffset.offsetX;
        this.container.pivot.y = pivotOffset.offsetY;

        this.sprite.play();

        this.particleSource = new ParticleSource(this.parentContainer, this.pTraceContainer, this.particleTextures, particleHolder);

        this.testGraphics = new PIXI.Graphics();
        //this.drawTestGraphicsRadius(); 
    }


    //-----------------------------DEBUG---------------------------------------------
    drawTestGraphics() {
        this.testGraphics.clear();
        var bounds = this.getBounds();
        if (!bounds) {
            return;
        }
        this.testGraphics.lineStyle(6, 0xff0000);
        this.testGraphics.drawRect(bounds[0].x, bounds[0].y, bounds[2], bounds[3]);
    }

    drawTestGraphicsRadius() {
        this.testGraphics.clear();
        this.testGraphics.lineStyle(6, 0xff0000);
        this.testGraphics.drawCircle(this.container.x, this.container.y, this.container.width * 0.5);
    }
    //---------------------------END DEBUG--------------------------------------------------------------

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.container);
            parentContainer.addChild(this.testGraphics);
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

    getPivotOffset() {
        var offsetX = this.sprite.width * 0.5;
        var offsetY = this.sprite.height * 0.5;

        return {
            offsetX: offsetX,
            offsetY: offsetY
        }
    }

    getPosition() {
        return { x: this.container.x, y: this.container.y };
    }

    getPositionConverted(targetContainer) {
        var position = this.getPosition();

        var currentPos = new PIXI.Point(position.x, position.y);
        var convertedPos = targetContainer.toLocal(currentPos, this.getParentContainer());
        return convertedPos;
    }

    setPosition(position) {
        this.container.x = position.x;
        this.container.y = position.y;
    }

    setXPosition(xCoord) {
        this.container.x = xCoord;
    }

    setYPosition(yCoord) {
        this.container.y = yCoord;
    }

    setZIndex(zIndex) {
        this.container.zIndex = zIndex;
    }

    incrementXPosition(xPlus) {
        this.container.x += xPlus;
    }

    getBounds() {
        var bounds = this.sprite.getBounds();
        var parentContainer = this.getParentContainer();
        if (!parentContainer) {
            return null;
        }

        var pointTopLeft = new PIXI.Point(bounds.x, bounds.y);
        var localPointTL = parentContainer.toLocal(pointTopLeft, this.stage);

        var pointBottomRight = new PIXI.Point(bounds.x + bounds.width, bounds.y + bounds.height);
        var localPointBR = parentContainer.toLocal(pointBottomRight, this.stage);

        var point1 = { x: localPointTL.x, y: localPointTL.y };
        var point2 = { x: localPointBR.x, y: localPointBR.y };

        var width = localPointBR.x - localPointTL.x;
        var height = localPointBR.y - localPointTL.y;
        return [point1, point2, width, height];
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

    collisionTestRadius(point, radiusPercent = 1) {
        var radius = this.container.width * 0.5 * radiusPercent;

        var distanceX = Math.abs(this.container.x - point.x);
        var distanceY = Math.abs(this.container.y - point.y);

        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance <= radius) {
            return true;
        }

        return false;
    }

    calculateAngle(posMC, samoletCP) {
        var deltaX = posMC.x - samoletCP.x;
        var deltaY = posMC.y - samoletCP.y;
        var hypotenuse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var sinValue = deltaY / hypotenuse;

        //console.log(`delta x: ${deltaX}`);
        //console.log(`delta y: ${deltaY}`);

        var angle = Math.asin(sinValue);
        angle = radiansToDegrees(angle) + 90;

        return angle;
    }

    stopAnim() {
        this.sprite.stop();
    }

    activate() {
        if (!this.active) {
            this.active = true;
            this.particleSource.activate();
            return true;
        } else {
            return false;
        }
    }

    update(samoletCP) {
        var pos = this.getPosition();
        var posMC = this.gameContainer.toLocal(new PIXI.Point(pos.x, pos.y), this.getParentContainer());
        var bounds = this.getBounds();
        var b1 = bounds[0];
        var b2 = bounds[1];
        var width = b2.x - b1.x;
        //console.log("POS_MC.X: " + posMC.x);
        if (posMC.x < -width) {
            return true;
        }

        //this.drawTestGraphicsRadius();

        if (this.active) {
            if (samoletCP) {
                var xDist = samoletCP.x - posMC.x;
                var yDist = samoletCP.y - posMC.y;

                this.xStep = xDist / this.activeSteps;
                this.yStep = yDist / this.activeSteps;
             
                this.container.angle = this.calculateAngle(posMC, samoletCP);
            } 

            this.container.x += this.xStep * this.deviceCoef.coef;
            this.container.y += this.yStep * this.deviceCoef.coef;

            this.activeSteps--;
            if (this.activeSteps <= 0) {
                return true;
            }

            this.particleSource.update(this.getPosition());
        }

        return false;
    }

    destroy() {
        this.removeFromContainer();
        this.sprite.destroy();
    }
}