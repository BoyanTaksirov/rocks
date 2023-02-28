const PIXI = require("pixi.js");
const { GAME_STATES } = require("../globals");

module.exports = class RocketsBtn {
    constructor(parentContainer, textures, setRocketsStateCallback, gameModel) {

        this.setRocketsStateCallback = setRocketsStateCallback;
        this.gameModel = gameModel;

        this.container;
        this.onBtn;
        this.offBtn;

        this.onMouseDown = this.onMouseDown.bind(this);

        this.switched = true;

        this.create(textures);

        this.addToContainer(parentContainer);

        this.addEventListeners();

        this.switchOff();
    }

    addEventListeners() {
        this.container.on("pointerdown", this.onMouseDown) 
    }

    create(textures) {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.onBtn = PIXI.Sprite.from(textures[0]);
        this.offBtn = PIXI.Sprite.from(textures[1]);
        this.container.addChild(this.onBtn, this.offBtn);
        this.container.scale = new PIXI.ObservablePoint(null, null, 0.5, 0.5);
    }

    onMouseDown(e) {
        if(this.gameModel.getGameState() !== GAME_STATES.GAME_STARTED) {
            return;
        }
        if(this.switched) {
            this.switchOff();
        } else {
            this.switchOn();
        }

        this.setRocketsStateCallback(this.switched);
    }

    switchOn() {
        this.onBtn.visible = true;
        this.offBtn.visible = false;
        this.switched = true;
        //console.log("ROCKETS BUTTON SWITCHED ON!");
    }

    switchOff() {
        this.onBtn.visible = false;
        this.offBtn.visible = true;
        this.switched = false;
        //console.log("ROCKETS BUTTON SWITCHED OFF!");
    }

    switch(state) {
        if(state) {
            this.switchOn();
        } else {
            this.switchOff();
        }
    }

    getState() {
        return this.switched;
    }

    getWidth() {
        return this.container.width;
    }

    getHeight() {
        return this.container.height;
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

    setSize(width, height) {
        this.container.width = width;
        this.container.height = height;
    }

    setZIndex(zIndex) {
        this.container.zIndex = zIndex;
    }
}