const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;

module.exports = class TargetCursor {
    constructor(parentContainer, textures) {

        this.container;
        this.targetActive;
        this.targetInactive;

        this.active = false;

        this.create(textures);
        this.addToContainer(parentContainer);
    }

    create(textures) {
        this.container = new PIXI.Container();
        this.container.scale.set(0.15);
        this.targetActive = new PIXI.Sprite(textures[0]);
        this.targetActive.anchor.set(0.5);
        this.targetInactive = new PIXI.Sprite(textures[1]);
        this.targetInactive.anchor.set(0.5);

        this.container.addChild(this.targetActive, this.targetInactive);
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

    switchActive(isActive) {
        this.active = isActive;
        if(isActive) {
            this.targetActive.visible = true;
            this.targetInactive.visible = false;
        } else {
            this.targetActive.visible = false;
            this.targetInactive.visible = true;
        }
    }

    setPosition(position) {
        this.container.x = position.x;
        this.container.y = position.y;
    }

    setZIndex(zIndex) {
        this.container.zIndex = zIndex;
    }
}