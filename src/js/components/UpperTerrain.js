const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const SEGMENT_DIVISIONS = require("../globals").SEGMENT_DIVISIONS;
const CONTOUR_ROUGHNESS_PERCENT = require("../globals").CONTOUR_ROUGHNESS_PERCENT;
const CONTOURS_CP_PER_SCREEN = require("../globals").CONTOURS_CP_PER_SCREEN;
const BEGIN_ROCKS_ZONE_COEF = require("../globals").BEGIN_ROCKS_ZONE_COEF;
const RANGE_POINTS_OF_ROCKS = require("../globals").RANGE_POINTS_OF_ROCKS;
const degreesToRadians = require("../globals").degreesToRadians;

module.exports = class UpperTerrain {
    constructor(parentContainer, channelHeightPercent) {
        this.graphics;
        this.baseCPs = [];
        this.detailedCPs = [];

        this.channelHeightPercent = channelHeightPercent;

        this.create();
        this.graphics.x = 0;
        this.graphics.y = 0;
        this.addToContainer(parentContainer);
    }

    setChannelHeightPercent(channelHeightPercent) {
        this.channelHeightPercent = channelHeightPercent;
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.graphics);
        }
    }

    removeFromContainer() {
        if (this.graphics.parent) {
            this.graphics.parent.removeChild(this.graphics);
        }
    }

    getParentContainer() {
        return this.graphics.parent;
    }

    getBaseCPs() {
        return this.baseCPs;
    }

    getDetailedCPs() {
        return this.detailedCPs;
    }

    create() {
        this.graphics = new PIXI.Graphics();
    }

    generateBaseCPs() {
        const step = INIT_SCREEN_DIMENSIONS.width / CONTOURS_CP_PER_SCREEN;
        var maxY = INIT_SCREEN_DIMENSIONS.height*(1 - this.channelHeightPercent);
        for (let i = 0; i < CONTOURS_CP_PER_SCREEN; i++) {
            var pointX;
            var pointY;
            if (i === 0) {
                pointX = INIT_SCREEN_DIMENSIONS.width;
                if (this.baseCPs.length !== 0) {
                    pointY = this.baseCPs[this.baseCPs.length - 1].y;
                } else {
                    pointY = 0;
                }
                this.baseCPs = [];
            } else if (i === CONTOURS_CP_PER_SCREEN - 1) {
                pointX = INIT_SCREEN_DIMENSIONS.width * 2;
                pointY = Math.random() * maxY;
            }
            else {
                pointX = i * step + step * (Math.random() * 0.3 - 0.15) + INIT_SCREEN_DIMENSIONS.width;
                pointY = Math.random() * maxY;
            }

            this.baseCPs.push({ x: pointX, y: pointY });
        }
    }

    generateDetailedCPs() {
        for (var i = 0; i < this.baseCPs.length - 1; i++) {
            var rangeX = this.baseCPs[i + 1].x - this.baseCPs[i].x;
            var rangeY = this.baseCPs[i + 1].y - this.baseCPs[i].y;

            var stepX = rangeX / SEGMENT_DIVISIONS;
            var stepY = rangeY / SEGMENT_DIVISIONS;

            for (var n = 0; n < SEGMENT_DIVISIONS; n++) {
                var pointX = this.baseCPs[i].x + n * stepX;
                if (i === this.baseCPs.length - 2 && n === SEGMENT_DIVISIONS - 1) {
                    pointX = INIT_SCREEN_DIMENSIONS.width * 2;
                }
                var pointY = this.baseCPs[i].y + n * stepY + (Math.random() * INIT_SCREEN_DIMENSIONS.height * CONTOUR_ROUGHNESS_PERCENT - INIT_SCREEN_DIMENSIONS.height * CONTOUR_ROUGHNESS_PERCENT / 2);

                this.detailedCPs.push({ x: pointX, y: pointY });
            }
        }
    }

    deleteAndTranslateCPs() {
        var deleteThreshold = (CONTOURS_CP_PER_SCREEN - 1) * SEGMENT_DIVISIONS;
        if (this.detailedCPs.length >= deleteThreshold * 2) {
            this.detailedCPs.splice(0, deleteThreshold);
        }

        for (var i = 0; i < this.detailedCPs.length; i++) {
            this.detailedCPs[i].x -= INIT_SCREEN_DIMENSIONS.width;
        }
    }

    draw() {
        this.graphics.clear();
        this.graphics.position.set(0, 0);
        this.graphics.lineStyle(2, 0x000000);
        this.graphics.beginFill(0x000000);

        this.graphics.moveTo(this.detailedCPs[0].x, this.detailedCPs[0].y);
        for (var i = 0; i < this.detailedCPs.length; i++) {
            this.graphics.lineTo(this.detailedCPs[i].x, this.detailedCPs[i].y);
        }

        this.graphics.lineTo(this.detailedCPs[this.detailedCPs.length - 1].x, -INIT_SCREEN_DIMENSIONS.height * 0.5);
        this.graphics.lineTo(this.detailedCPs[0].x, -INIT_SCREEN_DIMENSIONS.height * 0.5);
        this.graphics.lineTo(this.detailedCPs[0].x, this.detailedCPs[0].y);
        this.graphics.endFill();
    }

    calculateStartAndEndIndexes(point, gameContainer) {
        var startIndex = null;
        var endIndex = null;
        var startPointLocal = this.graphics.toLocal(new PIXI.Point(point.x, point.y), gameContainer);

        var matchIndex = null;
        for (var n = 0; n < this.detailedCPs.length - 1; n++) {
            if (startPointLocal.x >= this.detailedCPs[n].x && startPointLocal.x <= this.detailedCPs[n + 1].x) {
                matchIndex = n;
                break;
            }
        }

        var leftDev = Math.ceil(Math.random() * (RANGE_POINTS_OF_ROCKS * 0.4)) + 2;
        var rightDev = Math.ceil(Math.random() * (RANGE_POINTS_OF_ROCKS * 0.4)) + 2;

        startIndex = matchIndex - leftDev;
        if (startIndex < 0) {
            startIndex = 0;
        }

        endIndex = matchIndex + rightDev;
        if (endIndex > this.detailedCPs.length - 1) {
            endIndex = this.detailedCPs.length - 1;
        }

        var range = endIndex - startIndex;
        var startPoint = startIndex;

        return { startPoint: startPoint, range: range };
    }

    chooseRandomStartAndEndIndexes(gameContainer) {
        var screenStartPointX = INIT_SCREEN_DIMENSIONS.width * BEGIN_ROCKS_ZONE_COEF;
        var startPointLocal = this.graphics.toLocal(new PIXI.Point(screenStartPointX, 0), gameContainer);
        var screenEndPointX = INIT_SCREEN_DIMENSIONS.width;
        var endPointLocal = this.graphics.toLocal(new PIXI.Point(screenEndPointX, 0), gameContainer);
        var startIndex = null;
        var endIndex = null;
        for (var n = 0; n < this.detailedCPs.length; n++) {
            if (!startIndex) {
                if (this.detailedCPs[n].x > startPointLocal.x && this.detailedCPs[n].x < endPointLocal.x) {
                    startIndex = n;
                }
            }

            if (!endIndex) {
                if (this.detailedCPs[n].x > endPointLocal.x) {
                    endIndex = n;
                }
            }

            if (startIndex && endIndex) {
                break;
            }
        }

        var range = Math.floor(Math.random() * RANGE_POINTS_OF_ROCKS * 0.5) + RANGE_POINTS_OF_ROCKS;
        var startPoint = Math.floor(Math.random() * (endIndex - startIndex) - range) + startIndex;

        if (startPoint < 0) {
            return null;
        }

        return { startPoint: startPoint, range: range };
    }

    createHole(gameContainer, point = null) {
        var startPoint;
        var range;
        var data;

        if (!point) {
            data = this.chooseRandomStartAndEndIndexes(gameContainer);
        } else {
            data = this.calculateStartAndEndIndexes(point, gameContainer);
        }

        if (!data) {
            return;
        }

        startPoint = data.startPoint;
        range = data.range;

        if (!(startPoint && range)) {
            //console.log("NO POINT FOUND!");
            return null;
        }

        var oldCoords = [];
        var newCoords = [];
        var angle = 0;
        var angleStep = 180 / range;

        for (var i = startPoint; i < startPoint + range; i++) {
            var newY = this.setHolePoint(this.detailedCPs[i].y, angle);
            angle += angleStep;

            oldCoords.push({
                x: this.detailedCPs[i].x,
                y: this.detailedCPs[i].y,
            })
            newCoords.push({
                x: this.detailedCPs[i].x,
                y: newY
            });
        }

        this.detailedCPs.splice(startPoint, range, ...newCoords);

        newCoords.reverse();
        var rockCoords = oldCoords.concat(newCoords);

        //console.log(" startPoint: " + startPoint + " range: " + range + " this.upperContourRealCPs.length: " + this.upperContourRealCPs.length);

        this.draw();

        for (var r = 0; r < rockCoords.length; r++) {
            rockCoords[r] = this.convertToGlobalCoords(rockCoords[r]);
        }

        return rockCoords;

        //console.log("Hole created!");
    }

    setHolePoint(oldCoordY, angle) {
        var medianValueY = INIT_SCREEN_DIMENSIONS.height * 0.05;
        var diff = medianValueY * Math.sin(degreesToRadians(angle));
        var baseValueY = oldCoordY - diff;
        var newCoordY = baseValueY;

        if (newCoordY > oldCoordY) {
            newCoordY = Math.random() * 10;
        }

        return newCoordY;
    }

    checkPointForCollision(point, gameContainer) {
        if(!point) {
            return false;
        }
        
        var pointLocal = this.graphics.toLocal(new PIXI.Point(point.x, point.y), gameContainer);

        var indexBegin = 0;
        var indexEnd = 0;
        for (var i = 0; i < this.detailedCPs.length - 1; i++) {
            if (pointLocal.x >= this.detailedCPs[i].x && pointLocal.x <= this.detailedCPs[i + 1].x) {
                indexBegin = i;
                indexEnd = i + 1;
                break;
            }
        }

        var deltaX = this.detailedCPs[indexEnd].x - this.detailedCPs[indexBegin].x;
        var distanceX = pointLocal.x - this.detailedCPs[indexBegin].x;
        var percentX = distanceX / deltaX;
        var deltaY = this.detailedCPs[indexEnd].y - this.detailedCPs[indexBegin].y;
        var crossPointY = deltaY * percentX + this.detailedCPs[indexBegin].y;
        if (pointLocal.y <= crossPointY) {
            return true;
        }

        return false;
    }

    getXCoordCorrespondingIndexes(point, pointContainer) {
        //console.log("point x: " + point.x + " point y: " + point.y + " point: " + point);
        var localPoint = this.graphics.toLocal(new PIXI.Point(point.x, point.y), pointContainer);
        //console.log("localPoint: " + localPoint);
        var index1 = null;
        var index2 = null;
        for (var i = 0; i < this.detailedCPs.length - 1; i++) {
            if (localPoint.x >= this.detailedCPs[i].x && localPoint.x <= this.detailedCPs[i + 1].x) {
                index1 = i;
                index2 = i + 1;
                break;
            }
        }

        return [index1, index2];
    }

    getTerrainInterpolationPoint(point, pointContainer) {
        var localPoint = this.graphics.toLocal(new PIXI.Point(point.x, point.y), pointContainer);

        var corespondingPoints = this.getXCoordCorrespondingIndexes(point, pointContainer);
        var index1 = corespondingPoints[0];
        var index2 = corespondingPoints[1];

        if (!(index1 && index2)) {
            //throw new Error("THE GIVEN X COORDINATES MAY BE WRONG!");

            var cpArrayLength = this.detailedCPs.length - 1;
            var globalInterpolationPointBackup = this.graphics.toGlobal(new PIXI.Point(this.detailedCPs[cpArrayLength].x, this.detailedCPs[cpArrayLength].y));
            var pcInterpolationPointBackup = pointContainer.toLocal(globalInterpolationPointBackup);
            return pcInterpolationPointBackup;
        }

        var deltaX = this.detailedCPs[index2].x - this.detailedCPs[index1].x;
        var progressX = localPoint.x - this.detailedCPs[index1].x;
        var percentProgressX = progressX / deltaX;

        var deltaY = this.detailedCPs[index2].y - this.detailedCPs[index1].y;
        var interpolationY = deltaY * percentProgressX + this.detailedCPs[index1].y;
        var localInterpolationPoint = { x: localPoint.x, y: interpolationY };
        var globalInterpolationPoint = this.graphics.toGlobal(new PIXI.Point(localInterpolationPoint.x, localInterpolationPoint.y));
        var pcInterpolationPoint = pointContainer.toLocal(globalInterpolationPoint);

        return pcInterpolationPoint;
    }

    getTerrainInterpolationPointLocal(point, pointContainer) {
        var parentContainer = this.getParentContainer();
        var localPoint = parentContainer.toLocal(new PIXI.Point(point.x, point.y), pointContainer);

        var corespondingPoints = this.getXCoordCorrespondingIndexes(point, pointContainer);
        var index1 = corespondingPoints[0];
        var index2 = corespondingPoints[1];

        if (!(index1 && index2)) {
            //throw new Error("THE GIVEN X COORDINATES MAY BE WRONG!");

            var cpArrayLength = this.detailedCPs.length - 1;
            var localInterpolationPointBackup = { x: this.detailedCPs[cpArrayLength].x, y: this.detailedCPs[cpArrayLength].y };

            return localInterpolationPointBackup;
        }

        var deltaX = this.detailedCPs[index2].x - this.detailedCPs[index1].x;
        var progressX = localPoint.x - this.detailedCPs[index1].x;
        var percentProgressX = progressX / deltaX;

        var deltaY = this.detailedCPs[index2].y - this.detailedCPs[index1].y;
        var interpolationY = deltaY * percentProgressX + this.detailedCPs[index1].y;
        var localInterpolationPoint = { x: localPoint.x, y: interpolationY };

        return localInterpolationPoint;
    }

    convertToGlobalCoords(point) {
        var pointPixi = new PIXI.Point(point.x, point.y)
        return this.graphics.toGlobal(pointPixi);
    }

    destroy() {
        this.graphics.clear();
        this.graphics.destroy();

        this.baseCPs = [];
        this.detailedCPs = [];
    }
}