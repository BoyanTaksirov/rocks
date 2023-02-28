const PIXI = require("pixi.js");
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const INFO_DISPLAY_HEIGHT = require("../globals").INFO_DISPLAY_HEIGHT;
const INFO_DISPLAY_TEXT_SIZE = require("../globals").INFO_DISPLAY_TEXT_SIZE;
const INFO_DISPLAY_TEXT_SIZE_PORTRAIT = require("../globals").INFO_DISPLAY_TEXT_SIZE_PORTRAIT;
const PORTRAIT = require("../globals").PORTRAIT;

module.exports = class InfoDisplay {
    constructor(parentContainer, appModel) {
        this.appModel = appModel;

        this.portrait = false;
        this.isMobile = this.appModel.getIsMobile();
        var screenMode = this.appModel.getScreenMode();
        if(this.isMobile && screenMode === PORTRAIT) {
            this.portrait = true;
        }

        this.fontSize = (this.portrait) ? INFO_DISPLAY_TEXT_SIZE_PORTRAIT : INFO_DISPLAY_TEXT_SIZE;

        this.infoContainer;
        this.bkg;

        this.create();
        this.addToContainer(parentContainer);
    }

    create() {
        this.infoContainer = new PIXI.Container();
        this.bkg = new PIXI.Graphics();

        var displayWidth = INIT_SCREEN_DIMENSIONS.width * 1

        this.bkg.clear();
        this.bkg.beginFill(0x000000, 0.5);
        this.bkg.drawRect(0, 0, displayWidth, INFO_DISPLAY_HEIGHT);
        this.bkg.endFill();

        this.infoContainer.addChild(this.bkg);

        this.infoContainer.x = (INIT_SCREEN_DIMENSIONS.width - displayWidth)/2;

        this.createRocketsLeft();

        this.createEnemiesKilled();

        this.createDistanceCounter();

        this.createLevelCounter();

        this.createScoreCounter();

    }

    createRocketsLeft() {
        this.rocketsLeftContainer = new PIXI.Container();
        this.infoContainer.addChild(this.rocketsLeftContainer);

        this.rocketsLeftText = new PIXI.BitmapText("Rockets: ", {
            fontName: 'RubikOneWhite',
            fontSize: this.fontSize,
            align: 'left',
        });

        this.rocketsLeftContainer.x = 20;
        this.rocketsLeftContainer.addChild(this.rocketsLeftText);
    }

    createEnemiesKilled() {
        this.enemiesKilledContainer = new PIXI.Container();
        this.infoContainer.addChild(this.enemiesKilledContainer);

        this.enemiesKilledText = new PIXI.BitmapText("Enemies: ", {
            fontName: 'RubikOneWhite',
            fontSize: this.fontSize,
            align: 'left',
        });

        this.enemiesKilledContainer.x = 450;
        this.enemiesKilledContainer.addChild(this.enemiesKilledText);
    }

    createDistanceCounter() {
        this.distanceCounterContainer = new PIXI.Container();
        this.infoContainer.addChild(this.distanceCounterContainer);

        this.distanceCounterText = new PIXI.BitmapText("Distance: ", {
            fontName: 'RubikOneWhite',
            fontSize: this.fontSize,
            align: 'left',
        });

        this.distanceCounterContainer.x = 900;
        this.distanceCounterContainer.addChild(this.distanceCounterText);
    }

    createLevelCounter() {
        this.levelCounterContainer = new PIXI.Container();
        this.infoContainer.addChild(this.levelCounterContainer);

        this.levelCounterText = new PIXI.BitmapText("Level: ", {
            fontName: 'RubikOneWhite',
            fontSize: this.fontSize,
            align: 'left',
        });

        this.levelCounterContainer.x = 1250;
        this.levelCounterContainer.addChild(this.levelCounterText);
    }

    createScoreCounter() {
        this.scoreCounterContainer = new PIXI.Container();
        this.infoContainer.addChild(this.scoreCounterContainer);

        this.scoreCounterText = new PIXI.BitmapText("Score: ", {
            fontName: 'RubikOneWhite',
            fontSize: this.fontSize,
            align: 'left',
        });

        this.scoreCounterContainer.x = 1550;
        this.scoreCounterContainer.addChild(this.scoreCounterText);
    }

    addToContainer(parentContainer) {
        this.removeFromContainer();
        if (parentContainer) {
            parentContainer.addChild(this.infoContainer);
        }
    }

    removeFromContainer() {
        if (this.infoContainer.parent) {
            this.infoContainer.parent.removeChild(this.infoContainer);
        }
    }

    getParentContainer() {
        return this.infoContainer.parent;
    }

    setPosition(position) {
        this.infoContainer.x = position.x;
        this.infoContainer.y = position.y;
    }

    setZIndex(zIndex) {
        this.infoContainer.zIndex = zIndex;
    }

    updateRocketsLeftNumber(rocketsNumber) {
        this.rocketsLeftText.text = "Rockets: " + rocketsNumber;
    }

    updateEnemiesKilled(enemiesKilled) {
        this.enemiesKilledText.text = "Enemies: " + enemiesKilled;
    }

    updateDistanceCovered(distance) {
        this.distanceCounterText.text = "Distance: " + distance + " km.";
    }

    updateLevel(level) {
        this.levelCounterText.text = "Level: " + level;
    }

    updateScore(score) {
        this.scoreCounterText.text = "Score: " + score;
    }

    resize() {
        var parentContainer = this.getParentContainer();

        var displayWidth = INIT_SCREEN_DIMENSIONS.width * 1

        var screenMode = this.appModel.getScreenMode();
        if(this.isMobile && screenMode === PORTRAIT) {
            this.portrait = true;
        } else {
            this.portrait = false;
        }

        const portraitWidth = 250;
        const portraitHeight = 270;
        
        if(this.portrait) {
            this.infoContainer.x = window.innerWidth / parentContainer.scale.x - portraitWidth;
            this.infoContainer.y = INIT_SCREEN_DIMENSIONS.height - portraitHeight;

            this.rocketsLeftContainer.x = 10;
            this.rocketsLeftContainer.y = 10;

            this.enemiesKilledContainer.x = 10;
            this.enemiesKilledContainer.y = 50;

            this.distanceCounterContainer.x = 10;
            this.distanceCounterContainer.y = 90;

            this.levelCounterContainer.x = 10;
            this.levelCounterContainer.y = 130;

            this.scoreCounterContainer.x = 10;
            this.scoreCounterContainer.y = 170;

            this.bkg.clear();
            this.bkg.beginFill(0x000000, 0.5);
            this.bkg.drawRect(0, 0, portraitWidth, portraitHeight);
            this.bkg.endFill();

        } else {
            this.infoContainer.x = (INIT_SCREEN_DIMENSIONS.width - displayWidth)/2;
            this.infoContainer.y = 0;

            this.bkg.clear();
            this.bkg.beginFill(0x000000, 0.5);
            this.bkg.drawRect(0, 0, INIT_SCREEN_DIMENSIONS.width, INFO_DISPLAY_HEIGHT);
            this.bkg.endFill();

            this.rocketsLeftContainer.x = 20;
            this.rocketsLeftContainer.y = 0;

            this.enemiesKilledContainer.x = 450;
            this.enemiesKilledContainer.y = 0;

            this.distanceCounterContainer.x = 900;
            this.distanceCounterContainer.y = 0;

            this.levelCounterContainer.x = 1250;
            this.levelCounterContainer.y = 0;

            this.scoreCounterContainer.x = 1550;
            this.scoreCounterContainer.y = 0;
        }
    }
}