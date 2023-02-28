const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const MIN_PARTICLE_POINTS = require("../globals").MIN_PARTICLE_POINTS;
const MAX_PARTICLE_POINTS = require("../globals").MAX_PARTICLE_POINTS;
const PARTICLE_SPEEED = require("../globals").PARTICLE_SPEEED;
const PARTICLE_SPEEED_MAX = require("../globals").PARTICLE_SPEEED_MAX;
const degreesToRadians = require("../globals").degreesToRadians;


module.exports = class Particle {
    constructor(x, y, parentContainer, rockBounds, deviceCoef) {
        this.graphics;
        this.stepX;
        this.stepY;

        this.deviceCoef = deviceCoef;

        this.points = this.getPoints(rockBounds);
        this.graphics;

        this.vector = this.getVector();
        this.rotateStep = Math.random()*PARTICLE_SPEEED - PARTICLE_SPEEED*0.5;

        this.gravityY = 0.1*this.deviceCoef.coef;

        this.create();

        this.graphics.position.set(x, y);

        if (parentContainer) {
            this.addToContainer(parentContainer);
        }
    }

    getPoints(rockBounds) {
        var numPoints = Math.floor(Math.random()*(MAX_PARTICLE_POINTS - MIN_PARTICLE_POINTS)) + MIN_PARTICLE_POINTS;
        //var boundsCoef = (rockBounds.width*rockBounds.height)/25000;
        var baseRadius = Math.random()*5 + 5;
        var maxRadius = 7;
        var angle = 0;

        var points = [];

        for(var i = 0; i < numPoints; i++) {
            var radius = Math.random()*maxRadius + baseRadius;
            var pointX = Math.cos(degreesToRadians(angle))*radius;
            var pointY = Math.sin(degreesToRadians(angle))*radius;

            points.push({x: pointX, y: pointY});

            var angleStep =  (Math.random()*(360 - angle))/(numPoints - i);
            angle += angleStep;
        }

        return points;
    }

    create() {
        this.graphics = new PIXI.Graphics();

        this.graphics.lineStyle(2, 0x000000);
        this.graphics.beginFill(0x000000);

        this.graphics.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 0; i < this.points.length; i++) {
            this.graphics.lineTo(this.points[i].x, this.points[i].y);
        }

        this.graphics.lineTo(this.points[0].x, this.points[0].y);
        this.graphics.endFill();

        this.graphics.zIndex = 20;
    }

    getVector() {
        var angle = degreesToRadians(Math.random()*360);
        var speed = -Math.random()*PARTICLE_SPEEED*this.deviceCoef.coef;

        var stepX = Math.cos(angle)*speed;
        var stepY = Math.sin(angle)*speed;

        return {x: stepX, y: stepY};
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

    update() {
        this.vector.y += this.gravityY;
        if(this.vector.y > PARTICLE_SPEEED_MAX) {
            this.vectorY = PARTICLE_SPEEED_MAX;
        }

        this.graphics.x += this.vector.x;
        this.graphics.y += this.vector.y;

        this.graphics.angle += this.rotateStep;

        if(this.graphics.y > INIT_SCREEN_DIMENSIONS.height) {
            return true;
        }

        return false;
    }

    destroy() {
        this.removeFromContainer();
        //console.log("PARTICLE REMOVED!");
    }
}