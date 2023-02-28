const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const SEGMENT_DIVISIONS = require("../globals").SEGMENT_DIVISIONS;
const CONTOUR_ROUGHNESS_PERCENT = require("../globals").CONTOUR_ROUGHNESS_PERCENT;
const CONTOURS_CP_PER_SCREEN = require("../globals").CONTOURS_CP_PER_SCREEN;

module.exports = class LowerTerrain {
    constructor(parentContainer, channelHeightPercent) {
        this.graphics;
        this.baseCPs = [];
        this.detailedCPs = [];

        this.channelHeightPercent = channelHeightPercent;

        this.firstCalc = true;

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

    create() {
        this.graphics = new PIXI.Graphics();
    }

    generateBaseCPs(upperTerrainBaseCPs) {
        //this.baseCPs = [];
        for (var i = 0; i < upperTerrainBaseCPs.length; i++) {
            var yValue;
            var channelHeight = INIT_SCREEN_DIMENSIONS.height * this.channelHeightPercent;

            if (i === 0) {
                if (this.baseCPs.length !== 0) {
                    yValue = this.baseCPs[this.baseCPs.length - 1].y;
                    this.baseCPs = [];
                } else {
                    yValue = INIT_SCREEN_DIMENSIONS.height;
                }
            } else if (i === upperTerrainBaseCPs.length - 1) {
                yValue = INIT_SCREEN_DIMENSIONS.height;
            }
            else {
                var addonY = (Math.random() * 0.2 - 0.1) * INIT_SCREEN_DIMENSIONS.height;
                yValue = upperTerrainBaseCPs[i].y + channelHeight + addonY;
            }

            var xValue = upperTerrainBaseCPs[i].x;
            this.baseCPs.push({ x: xValue, y: yValue });
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

        this.graphics.lineTo(this.detailedCPs[this.detailedCPs.length - 1].x, INIT_SCREEN_DIMENSIONS.height * 1.5);
        this.graphics.lineTo(this.detailedCPs[0].x, INIT_SCREEN_DIMENSIONS.height * 1.5);
        this.graphics.lineTo(this.detailedCPs[0].x, this.detailedCPs[0].y);
        this.graphics.endFill();
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
        if (pointLocal.y >= crossPointY) {
            return true;
        }

        return false;
    }

    getTerrainInterpolationPoint(point, pointContainer) {
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

            /*if (i === this.detailedCPs.length - 2) {
                console.log("localPoint.x: " + localPoint.x + " this.detailedCPs[i].x: " + this.detailedCPs[i].x);
                console.log("localPoint.x: " + localPoint.x + " this.detailedCPs[i + 1].x: " + this.detailedCPs[i + 1].x);
            }*/
        }

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

    destroy() {
        this.graphics.clear();
        this.graphics.destroy();

        this.baseCPs = [];
        this.detailedCPs = [];
    }

}
