const PIXI = require("pixi.js");
const classifyPoint = require("robust-point-in-polygon");
const ROCK_MIN_X_PERCENT = require("../globals").ROCK_MIN_X_PERCENT;
const ROCK_MAX_X_PERCENT = require("../globals").ROCK_MAX_X_PERCENT;
const ROCK_MIN_Y_STEP = require("../globals").ROCK_MIN_Y_STEP;
const ROCK_MAX_Y_STEP = require("../globals").ROCK_MAX_Y_STEP;
const ROCK_MIN_ROT_STEP = require("../globals").ROCK_MIN_ROT_STEP;
const ROCK_MAX_ROT_STEP = require("../globals").ROCK_MAX_ROT_STEP;
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const EXPLOSION_PARTICLES_COEF = require("../globals").EXPLOSION_PARTICLES_COEF;
const checkPointInBounds = require("../globals").checkPointInBounds;

module.exports = class Rock {
    constructor(points, terrainContainerStep, parentContainer = null, rockID, gameContainer, stage, deviceCoef, xStep = null, yStep = null, rotationStep = null) {
        this.points = points;
        this.terrainContainerStep = terrainContainerStep;
        this.gameContainer = gameContainer;
        this.stage = stage;
        this.deviceCoef = deviceCoef;

        this.xStep = xStep || this.generateXStep();
        this.yStep = yStep || this.generateYStep();
        this.rotationStep = rotationStep || this.generateRotationStep();

        this.updatedPoints = [];

        this.container;
        this.graphics;
        this.testGraphics;

        this.rockID = rockID;

        this.averageX;
        this.averageY;

        this.create();

        if (parentContainer) {
            this.addToContainer(parentContainer);
        }
    }

    create() {
        this.container = new PIXI.Container();

        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);

        var mmPoints = this.findMinMaxPoints(this.points);

        this.averageX = (mmPoints.maxX + mmPoints.minX) / 2;
        this.averageY = (mmPoints.maxY + mmPoints.minY) / 2;

        this.container.position.set(this.averageX, this.averageY);

        //console.log("ROCK X: " + this.averageX + " ROCK Y: " + this.averageY);

        for (var a = 0; a < this.points.length; a++) {
            this.points[a].x -= this.averageX;
            this.points[a].y -= this.averageY;
        }

        this.draw();

        //-------------------draw bounding rect (DEBUG)--------------------


        /*this.graphics.lineStyle(6, 0xff0000);
        this.graphics.moveTo(0, 0);
        //this.graphics.lineTo(this.points[0].x, this.points[0].y);

        var bounds = this.graphics.getBounds();
        this.graphics.drawRect(-bounds.width/2, -bounds.height/2, bounds.width, bounds.height);*/
    }

    findMinMaxPoints(points) {
        var minX = 10000;
        var maxX = -10000;
        var minY = 10000;
        var maxY = -10000;

        for (var n = 0; n < points.length; n++) {
            if (minX > points[n].x) {
                minX = points[n].x;
            }

            if (maxX < points[n].x) {
                maxX = points[n].x;
            }

            if (minY > points[n].y) {
                minY = points[n].y;
            }

            if (maxY < points[n].y) {
                maxY = points[n].y;
            }
        }

        return {
            maxX: maxX,
            minX: minX,
            maxY: maxY,
            minY: minY,
        }
    }

    draw() {
        this.graphics.clear();
        //this.graphics.position.set(this.averageX, this.averageY);
        this.graphics.lineStyle(2, 0x000000);
        this.graphics.beginFill(0x000000);

        this.graphics.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 0; i < this.points.length; i++) {
            this.graphics.lineTo(this.points[i].x, this.points[i].y);
        }

        this.graphics.lineTo(this.points[0].x, this.points[0].y);
        this.graphics.endFill();
    }

    drawTestGraphics() {  //--------------DEBUG----------------   

        if(!this.updatedPoints || this.updatedPoints.length <= 0) {
            return;
        }

        if (!this.testGraphics) {
            this.testGraphics = new PIXI.Graphics();
            this.testGraphics.x = 0;
            this.testGraphics.y = 0;
            this.testGraphics.zIndex = 10000;
            this.gameContainer.addChild(this.testGraphics);
        }

        this.testGraphics.clear();
        this.testGraphics.lineStyle(6, 0xff0000);

        /*var bounds = this.container.getBounds();
        var bMC = this.getParentContainer().toLocal(new PIXI.Point(bounds.x, bounds.y));
        this.testGraphics.drawRect(bMC.x, bMC.y, bounds.width, bounds.height);*/

        this.testGraphics.moveTo(this.updatedPoints[0][0], this.updatedPoints[0][1]);
        for (var i = 0; i < this.updatedPoints.length; i++) {
            this.testGraphics.lineTo(this.updatedPoints[i][0], this.updatedPoints[i][1]);
        }

        this.testGraphics.lineTo(this.updatedPoints[0][0], this.updatedPoints[0][1]);
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

    generateXStep() {
        var percent = Math.random() * (ROCK_MAX_X_PERCENT - ROCK_MIN_X_PERCENT) + ROCK_MIN_X_PERCENT;
        return -this.terrainContainerStep * percent;
    }

    generateYStep() {
        return Math.random() * (ROCK_MAX_Y_STEP - ROCK_MIN_Y_STEP) + ROCK_MIN_Y_STEP;
    }

    generateRotationStep() {
        return Math.random() * (ROCK_MAX_ROT_STEP - ROCK_MIN_ROT_STEP) + ROCK_MIN_ROT_STEP;
    }

    getRockBounds() {
        var bounds = this.graphics.getBounds();

        var pointMC = this.gameContainer.toLocal(new PIXI.Point(bounds.x, bounds.y));
        bounds.x = pointMC.x;
        bounds.y = pointMC.y;
        return bounds;
    }

    update() {
        this.container.x += this.xStep * (1 + this.deviceCoef.coef * 0.1);
        this.container.y += this.yStep * this.deviceCoef.coef;
        this.graphics.angle += this.rotationStep;

        this.updatePoints();

        //this.drawTestGraphics();

        if (this.checkForLowerScreenBorder()) {
            return false;
        }

        return true;
    }

    updatePoints() {
        var convertedPoints = [];
        for (var i = 0; i < this.points.length; i++) {
            var convertedPoint = this.gameContainer.toLocal(new PIXI.Point(this.points[i].x, this.points[i].y), this.graphics);
            convertedPoints[i] = convertedPoint;
            this.updatedPoints[i] = [convertedPoint.x, convertedPoint.y];
        }
    }

    checkForLowerScreenBorder() {
        if (this.container.y >= INIT_SCREEN_DIMENSIONS.height * 1.2) {
            return true;
        }

        return false;
    }

    checkForPointCollision(point) {
        if (this.updatedPoints.length === 0) {
            return;
        }

        var cWidth = this.container.width;
        var cHeight = this.container.height;

        if(point.x < this.container.x - cWidth/2 || point.x > this.container.x + cWidth/2) {
            //console.log("[Rock] Point not in bounds!");
            return false;
        }

        if(point.y < this.container.y - cHeight/2 || point.y > this.container.y + cHeight/2) {
            //console.log("[Rock] Point not in bounds!");
            return false;
        }

        var isInside = this.checkPointInsidePolygon([point.x, point.y], this.updatedPoints);
        return isInside;

        //var isInside = classifyPoint(this.updatedPoints, [point.x, point.y]);     
        //return (isInside === -1) ? true : false;
    }

    checkPointInsidePolygon(point, vs) {
        var x = point[0], y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };


    getExplosionPoints() {
        return this.calculateExplosionPoints();
    }

    calculateExplosionPoints() {
        var ePoints = [];

        /*var boundsArea = bounds.width * bounds.height;
        var count = Math.ceil(boundsArea*EXPLOSION_PARTICLES_COEF);*/

        var bounds = this.graphics.getBounds();

        var count = this.updatedPoints.length * EXPLOSION_PARTICLES_COEF;

        for (var i = 0; i < count; i++) {
            var xd = Math.random() * bounds.width + bounds.x;
            var yd = Math.random() * bounds.height + bounds.y;
            var mcPoint = this.gameContainer.toLocal(new PIXI.Point(xd, yd));

            if (this.checkPointInsidePolygon([mcPoint.x, mcPoint.y], this.updatedPoints)) {
                ePoints.push({ x: mcPoint.x, y: mcPoint.y });
            }
        }

        return ePoints;
    }

    destroy() {
        this.removeFromContainer();
        this.container.destroy();
        //this.testGraphics.destroy();       
        //console.log(`"Rock# ${this.rockID} destroyed`);
    }
}