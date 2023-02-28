const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const degreesToRadians = require("../globals").degreesToRadians;
const radiansToDegrees = require("../globals").radiansToDegrees;


module.exports = class RocketTrigger {
    constructor(parentContainer, callback, navCallback, stage) {
        this.callback = callback;
        this.navCallback = navCallback;
        this.stage = stage;

        this.container;
        this.centerPoint;
        this.outerRadius;
        this.arrow;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.MOUSE_DOWN = false;
        this.MOUSE_OVER = false;


        this.create();

        this.addToContainer(parentContainer);
    }

    create() {
        this.container = new PIXI.Container();
        this.container.interactive = true;

        this.outerRadius = new PIXI.Graphics();
        this.outerRadius.clear();
        this.outerRadius.position.set(0, 0);
        this.outerRadius.lineStyle(6, 0x000000);
        this.outerRadius.beginFill(0xff0000, 0.1);
        this.outerRadius.drawCircle(0, 0, INIT_SCREEN_DIMENSIONS.height * 0.22);
        this.outerRadius.endFill();
        this.container.addChild(this.outerRadius);

        this.centerPoint = new PIXI.Graphics();
        this.centerPoint.clear();
        this.centerPoint.position.set(0, 0);
        this.centerPoint.lineStyle(6, 0x000000);
        this.centerPoint.beginFill(0x000000);
        this.centerPoint.drawCircle(0, 0, INIT_SCREEN_DIMENSIONS.width * 0.02);
        this.centerPoint.endFill();
        this.container.addChild(this.centerPoint);

        this.arrow = new PIXI.Graphics();
        this.arrow.clear();
        this.arrow.position.set(0, 0);
        this.arrow.lineStyle(4, 0x000000);
        this.arrow.beginFill(0x000000);
        this.arrow.moveTo(-INIT_SCREEN_DIMENSIONS.height * 0.02, 0);
        this.arrow.lineTo(0, -INIT_SCREEN_DIMENSIONS.height * 0.2);
        this.arrow.lineTo(INIT_SCREEN_DIMENSIONS.height * 0.02, 0);
        this.arrow.lineTo(-INIT_SCREEN_DIMENSIONS.height * 0.02, 0);
        this.arrow.endFill();
        //this.container.addChild(this.arrow);

        this.addEventListeners();
    }

    addEventListeners() {
        this.container.on("mousedown", this.onMouseDown);
        this.container.on("mouseup", this.onMouseUp);
        this.container.on("mousemove", this.onMouseMove);
        this.container.on("mouseover", this.onMouseOver);
        this.container.on("mouseout", this.onMouseOut);      
    }

    onMouseDown(e) {
        this.MOUSE_DOWN = true;

        var angle = this.calculateVector(e);

        this.callback(angle);
    }

    onMouseUp(e) {
        this.MOUSE_DOWN = false;
    }

    onMouseMove(e) {
        if(!this.MOUSE_OVER) {
            return;
        }

        var angle = this.calculateVector(e);
        this.navCallback(angle);
    }

    onMouseOver(e) {
        this.MOUSE_OVER = true;
    }

    onMouseOut(e) {
        this.MOUSE_OVER = false;
    }

    getBounds() {
        return this.outerRadius.getBounds();
    }

    calculateVector(e) {
        var localCoords = this.container.toLocal(new PIXI.Point(e.data.global.x, e.data.global.y), this.stage);
        //console.log(`x: ${localCoords.x}`);
        //console.log(`y: ${localCoords.y}`);

        var deltaX = localCoords.x;
        var deltaY = -localCoords.y;
        var hypotenuse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var sinValue = deltaY / hypotenuse;

        //console.log(`delta x: ${deltaX}`);
        //console.log(`delta y: ${deltaY}`);

        var angle = Math.asin(sinValue);
        angle = radiansToDegrees(angle);

        //console.log("INITIAL ANGLE: " + angle);

        if (deltaX >= 0 && deltaY >= 0) {
            //var addonX = 0;
            //angle = 90 + addonX;
        } else if (deltaX < 0 && deltaY >= 0) {
            var addonX = 90 - angle;
            angle = 90 + addonX;
        } else if (deltaX < 0 && deltaY < 0) {
            angle = 180 - angle;
        } else if (deltaX >= 0 && deltaY < 0) {
            angle = 360 + angle;
        }

        this.arrow.angle = 90 - angle;

        //console.log("ANGLE: " + angle);

        return angle;
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
}