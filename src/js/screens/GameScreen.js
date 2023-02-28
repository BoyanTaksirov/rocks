const PIXI = require("pixi.js");
const Timer = require("../utils/Timer");
const Samolet = require("../components/Samolet");
const RocketsBtn = require("../interface/RocketsBtn");
const InfoDisplay = require("../interface/InfoDisplay");
const InfoLabel = require("../interface/InfoLabel");
const EndMessage = require("../interface/EndMessage");
const Explosion = require("../components/Explosion");
const UpperTerrain = require("../components/UpperTerrain");
const LowerTerrain = require("../components/LowerTerrain");
const Rock = require("../components/Rock");
const Particle = require("../components/Particle");
const Raketa = require("../components/Raketa");
const GameModel = require("../model/GameModel");
const PowerUp = require("../components/PowerUp");
const EnemyTarget = require("../components/EnemyTarget");
const TargetCursor = require("../components/TargetCursor");
const FlyingIsland = require("../components/FlyingIsland");
const { GAME_STATES, LEVEL_CONFIGURATION } = require("../globals");
const CE = require("../globals").CE;
const GAME_SCREEN = require("../globals").GAME_SCREEN;
const SCORE_TABLE = require("../globals").SCORE_TABLE;
const INIT_SCREEN_DIMENSIONS = require("../globals").INIT_SCREEN_DIMENSIONS;
const CONTOURS_START_POSITION = require("../globals").CONTOURS_START_POSITION;
const ROCKS_TIMER_INTERVAL_MSEC = require("../globals").ROCKS_TIMER_INTERVAL_MSEC;
const GAME_FINISH_TIME_SEC = require("../globals").GAME_FINISH_TIME_SEC;
const SAMOLET_X_POS_LANDSCAPE = require("../globals").SAMOLET_X_POS_LANDSCAPE;
const SAMOLET_X_POS_PORTRAIT = require("../globals").SAMOLET_X_POS_PORTRAIT;

//-------------------Device adaptation---------------------------
const GAME_LOOP_BASE_MS = require("../globals").GAME_LOOP_BASE_MS;

const DISTANCE_PER_LEVEL = require("../globals").DISTANCE_PER_LEVEL;

const FLYING_ISLANDS_PARAMS = require("../globals").FLYING_ISLANDS_PARAMS;
const FLYING_ROCKS_PARAMS = require("../globals").FLYING_ROCKS_PARAMS;
const CLOUDS_PARAMS = require("../globals").CLOUDS_PARAMS;

const RPU_TYPE_1 = require("../globals").RPU_TYPE_1;
const RPU_TYPE_2 = require("../globals").RPU_TYPE_2;
const RPU_TYPE_3 = require("../globals").RPU_TYPE_3;
const degreesToRadians = require("../globals").degreesToRadians;
const radiansToDegrees = require("../globals").radiansToDegrees;


module.exports = class GameScreen {
    constructor(app, loadingModule, soundManager, appModel, switchBeginScreen, globalContainer) {
        this.app = app;
        this.loadingModule = loadingModule;
        this.soundManager = soundManager;
        this.appModel = appModel;
        this.switchBeginScreen = switchBeginScreen;
        this.globalContainer = globalContainer;

        //---------------Check Desktop or Mobile------------------
        this.IS_MOBILE = this.appModel.getIsMobile();

        //----------------------Device performance test-------------------------
        this.deviceCoef = { coef: 1 };

        this.counterr = 0;

        //----------------------bind functions---------------------------
        this.gameLoop = this.gameLoop.bind(this)
        this.createGameElements = this.createGameElements.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.initiateRock = this.initiateRock.bind(this);
        this.finishGame = this.finishGame.bind(this);
        this.setRocketsState = this.setRocketsState.bind(this);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        //-------------------end bind functions-------------------------------


        //---------------------System---------------------------------
        this.idName = GAME_SCREEN;
        this.assets;
        this.scaleFactor;
        this.finishGameTimeoutID = null;

        this.timer = new Timer(ROCKS_TIMER_INTERVAL_MSEC, this.onTimer);

        //-------------------model---------------------
        this.gameModel;

        //-------------------Mouse/Tap Interactions-----------------
        this.MOUSE_DOWN = false;

        //-----------------------game objects---------------------

        this.gameContainer = null;
        this.terrainContainer = null;
        this.islandsContainer = null;
        this.explosionsContainer = null;
        this.rocksContainer = null;
        this.particleTraceContainer = null;

        this.samolet = null;

        this.upperTerrain = null;
        this.lowerTerrain = null;

        this.terrainBkg = null;

        this.islandTextures = [];
        this.rockTextures = [];
        this.cloudTextures = [];
        this.particleTextures = [];
        this.particleTraceHolder = [];
        this.particleTraceHolder.id = "PARTICLE_HOLDER";

        this.targetCursor = null;

        this.fallingRocks = [];
        this.explosionParticles = [];
        this.rockets = [];
        this.RPUs = [];
        this.rocketExplosions = [];
        this.enemyTargets = [];
        this.flyingIslands = [];

        this.infoLabel = null;
    }

    resetAll() {
        clearTimeout(this.finishGameTimeoutID);

        this.gameContainer = null;
        this.terrainContainer = null;
        this.islandsContainer = null;
        this.explosionsContainer = null;
        this.rocksContainer = null;
        this.particleTraceContainer = null;

        this.samolet = null;

        this.upperTerrain = null;
        this.lowerTerrain = null;

        this.terrainBkg = null;

        this.islandTextures = [];
        this.rockTextures = [];
        this.cloudTextures = [];
        this.particleTextures = [];
        this.particleTraceHolder = [];
        this.particleTraceHolder.id = "PARTICLE_HOLDER";

        this.targetCursor = null;

        this.fallingRocks = [];
        this.explosionParticles = [];
        this.rockets = [];
        this.RPUs = [];
        this.rocketExplosions = [];
        this.enemyTargets = [];
        this.flyingIslands = [];
    }

    addToContainer() {
        this.app.stage.addChild(this.gameContainer);
    }

    removeFromContainer() {
        this.app.stage.removeChild(this.gameContainer);
    }

    addEventListeners() {
        if (this.appModel.getIsMobile()) {
            this.gameContainer.on("pointerdown", this.onMouseDown);
            this.gameContainer.on("pointerup", this.onMouseUp);
            this.gameContainer.on("pointermove", this.onMouseMove);
        } else {
            this.gameContainer.on("mousedown", this.onMouseDown);
            this.gameContainer.on("mouseup", this.onMouseUp);
            this.gameContainer.on("mousemove", this.onMouseMove);
        }

        window.addEventListener("keypress", this.onKeyDown);
    }

    createGameElements() {
        //------------------game model--------------------------
        this.gameModel = new GameModel(this.deviceCoef);

        //------------------main container-------------------------
        this.gameContainer = new PIXI.Container();
        this.gameContainer.interactive = true;
        this.gameContainer.sortableChildren = true;

        //--------------------Version/Debug label---------------------------
        /* this.versionLabel = new PIXI.Text("V2", {
             fontFamily: 'Arial Black',
             fontSize: 16,
             fill: 0xff0000,
             align: 'center',
         });
 
         this.gameContainer.addChild(this.versionLabel); */

        //------------------Retrieve textures------------------------
        this.particleTextures = this.getParticleTextures();

        //---------------------------Interface---------------------------
        this.infoDisplay;
        this.endMessage;

        //------------------terrain container-------------------
        this.terrainContainer = new PIXI.Container();
        this.gameContainer.addChild(this.terrainContainer);
        this.upperTerrain = new UpperTerrain(this.terrainContainer, this.gameModel.getChannelHeightPercent());
        this.lowerTerrain = new LowerTerrain(this.terrainContainer, this.gameModel.getChannelHeightPercent());
        this.terrainContainer.x = CONTOURS_START_POSITION;

        this.createAdditionalContourCPs();
        this.redrawContours();

        //-------------------------sky container-------------------
        this.skyContainer = new PIXI.Container();
        this.gameContainer.addChild(this.skyContainer);
        this.skySprite = PIXI.Sprite.from(this.loadingModule.getNonAnimatedTexture("sky"));
        this.skyContainer.addChild(this.skySprite);

        //------------------------rocks container--------------------------
        this.rocksContainer = new PIXI.Container();
        this.rocksContainer.x = 0;
        this.rocksContainer.y = 0;
        this.gameContainer.addChild(this.rocksContainer);

        //-----------------Enemy Particle Trace Container-------------------------
        this.particleTraceContainer = new PIXI.Container();
        this.particleTraceContainer.x = 0;
        this.particleTraceContainer.y = 0;
        this.particleTraceContainer.ID = "PARTICLE_TRACE_CONTAINER"

        this.gameContainer.addChild(this.particleTraceContainer);

        //------------------background mountain or whatever-----------------------
        //this.createBackground();

        this.createIslandsAndRocks();

        //----------------------rockets button---------------------------------
        this.rocketsBtn = new RocketsBtn(this.gameContainer, [this.loadingModule.getNonAnimatedTexture("rocketsOn"), this.loadingModule.getNonAnimatedTexture("rocketsOff")],
            this.setRocketsState, this.gameModel);

        this.setRocketBtnPositionAndSize(this.getEnvironmentStatus());

        //----------------------samolet - the protagonist :)------------------
        this.samolet = new Samolet(this.loadingModule.getNonAnimatedTexture("samolet"), this.loadingModule.getBurner1Textures(), this.loadingModule.getBurner2Textures(),
            this.gameContainer, this.deviceCoef);

        //-----------------------Explosions Container----------------------
        this.explosionsContainer = new PIXI.Container();
        this.gameContainer.addChild(this.explosionsContainer);

        //-----------------------Info display-------------------------
        this.infoDisplay = new InfoDisplay(this.gameContainer, this.appModel);
        this.infoDisplay.setPosition({ x: 0, y: 0 });

        this.gameModel.setInfoDisplay(this.infoDisplay);

        //------------------------Target Cursor-----------------------------
        var targetActiveTexture = this.loadingModule.getNonAnimatedTexture("targetActive");
        var targetInactiveTexture = this.loadingModule.getNonAnimatedTexture("targetInactive");
        this.targetCursor = new TargetCursor(this.gameContainer, [targetActiveTexture, targetInactiveTexture]);
        //this.targetCursor.removeFromContainer();

        this.setZIndexes();

        this.resize();
        this.addEventListeners();
    }

    prepareNewGame() {
        this.createGameElements();
        this.setBeforeStartState();
    }

    setBeforeStartState() {
        this.gameModel.setGameState(GAME_STATES.GAME_BEFORE_START);
        this.gameModel.reset();     
        this.infoLabel = new InfoLabel(this.gameContainer, this.gameModel, this.appModel);
        this.infoLabel.setZIndex(150);
    }

    startGame() {
        if (this.infoLabel) {
            this.infoLabel.destroy();
            this.infoLabel = null;
        }

        this.gameModel.setGameState(GAME_STATES.GAME_STARTED);
        this.switchToNewLevel(this.gameModel.getLevel());

        this.soundManager.setLooped("SOUND_falling1", true);
        this.soundManager.setVolume("SOUND_falling1", 0.5);
        this.soundManager.play("SOUND_falling1");

        this.soundManager.setLooped("SOUND_engine_turbo", true);
        this.soundManager.setVolume("SOUND_engine_turbo", 0.1);

        //console.log("Game Started");

        this.app.ticker.add(this.gameLoop);

        //this.timer.start();
    }

    setRocketBtnPositionAndSize(status) {
        var rocketBtnX;
        var rocketBtnY;

        if (!status.isMobile) {
            this.rocketsBtn.setSize(INIT_SCREEN_DIMENSIONS.width * 0.15, INIT_SCREEN_DIMENSIONS.width * 0.05);
            //rocketBtnX = INIT_SCREEN_DIMENSIONS.width * 0.5 - this.rocketsBtn.getWidth() * 0.5;
            if (window.innerWidth / this.gameContainer.scale.x < INIT_SCREEN_DIMENSIONS.width) {
                rocketBtnX = window.innerWidth / this.gameContainer.scale.x - this.rocketsBtn.getWidth();
            } else {
                rocketBtnX = INIT_SCREEN_DIMENSIONS.width - this.rocketsBtn.getWidth();
            }
            rocketBtnY = INIT_SCREEN_DIMENSIONS.height - this.rocketsBtn.getHeight();
        } else {
            if (status.isLandscape) {
                this.rocketsBtn.setSize(INIT_SCREEN_DIMENSIONS.width * 0.15, INIT_SCREEN_DIMENSIONS.width * 0.05);
                if (window.innerWidth / this.gameContainer.scale.x < INIT_SCREEN_DIMENSIONS.width) {
                    rocketBtnX = window.innerWidth / this.gameContainer.scale.x - this.rocketsBtn.getWidth();
                } else {
                    rocketBtnX = INIT_SCREEN_DIMENSIONS.width - this.rocketsBtn.getWidth();
                }
                rocketBtnY = INIT_SCREEN_DIMENSIONS.height - this.rocketsBtn.getHeight();
            } else {
                this.rocketsBtn.setSize(INIT_SCREEN_DIMENSIONS.width * 0.1, INIT_SCREEN_DIMENSIONS.width * 0.03);
                rocketBtnX = window.innerWidth / this.gameContainer.scale.x - this.rocketsBtn.getWidth();
                rocketBtnY = INIT_SCREEN_DIMENSIONS.height - this.rocketsBtn.getHeight();
            }
            //rocketBtnX = window.innerWidth / this.gameContainer.scale.x - this.rocketsBtn.getWidth();


        }

        this.rocketsBtn.setPosition({ x: rocketBtnX, y: rocketBtnY });
    }

    setZIndexes() {
        //--------------------set zIndexes----------------
        this.skyContainer.zIndex = 10;
        this.islandsContainer.zIndex = 20;
        //this.terrainBkg.zIndex = 30;
        this.rocksContainer.zIndex = 40;
        this.particleTraceContainer.zIndex = 45;
        this.terrainContainer.zIndex = 50;
        this.samolet.setZIndex(60);
        this.explosionsContainer.zIndex = 70;
        this.targetCursor.setZIndex(90);
        this.infoDisplay.setZIndex(100);
        this.rocketsBtn.setZIndex(110);
    }

    getParticleTextures() {
        var particleTex1 = this.loadingModule.getNonAnimatedTexture("particle1");
        var particleTex2 = this.loadingModule.getNonAnimatedTexture("particle2");
        var particleTex3 = this.loadingModule.getNonAnimatedTexture("particle3");

        return [particleTex1, particleTex2, particleTex3];
    }

    createIslandsAndRocks() {
        //---------------------------------Create Flying Islands--------------------------------
        this.islandsContainer = new PIXI.Container();
        this.islandsContainer.sortableChildren = true;
        this.gameContainer.addChild(this.islandsContainer);

        var baseName = "island";
        for (var index = 1; index < 1000; index++) {
            var currentName = baseName + index;
            var currentNameSl = baseName + index + "s";

            var islandTexture = this.loadingModule.getNonAnimatedTexture(currentName);
            var islandTextureSl = this.loadingModule.getNonAnimatedTexture(currentNameSl);
            if (islandTexture) {
                var textures = {
                    base: islandTexture,
                    silhouette: islandTextureSl
                }
                this.islandTextures.push(textures);
            } else {
                break;
            }
        }

        for (var fi = 0; fi < FLYING_ISLANDS_PARAMS.length; fi++) {
            var flyingIsland = new FlyingIsland(this.islandsContainer, this.islandTextures, this.deviceCoef, null, FLYING_ISLANDS_PARAMS[fi]);
            this.flyingIslands.push(flyingIsland);
        }

        //---------------------------------Create Flying Rocks--------------------------------
        var baseNameRock = "rock"
        for (var index = 1; index < 1000; index++) {
            var currentName = baseNameRock + index;
            var currentNameSl = baseNameRock + index + "s";
            var rockTexture = this.loadingModule.getNonAnimatedTexture(currentName);
            var rockTextureSl = this.loadingModule.getNonAnimatedTexture(currentNameSl);
            if (rockTexture) {
                var textures = {
                    base: rockTexture,
                    silhouette: rockTextureSl
                }
                this.rockTextures.push(textures);
            } else {
                break;
            }
        }

        for (var fr = 0; fr < FLYING_ROCKS_PARAMS.length; fr++) {
            var flyingRock = new FlyingIsland(this.islandsContainer, this.rockTextures, this.deviceCoef, null, FLYING_ROCKS_PARAMS[fr], true, 0.1);
            this.flyingIslands.push(flyingRock);
        }

        //---------------------------------Create Clouds--------------------------------
        var baseNameCloud = "cloud"
        for (var index = 1; index < 1000; index++) {
            var currentName = baseNameCloud + index;
            var cloudTexture = this.loadingModule.getNonAnimatedTexture(currentName);
            if (cloudTexture) {
                var textures = {
                    base: cloudTexture,
                    silhouette: null
                }
                this.cloudTextures.push(textures);
            } else {
                break;
            }
        }

        for (var c = 0; c < CLOUDS_PARAMS.length; c++) {
            var cloud = new FlyingIsland(this.islandsContainer, this.cloudTextures, this.deviceCoef, null, CLOUDS_PARAMS[c]);
            cloud.setXPos(INIT_SCREEN_DIMENSIONS.width * 1.5 * Math.random());
            this.flyingIslands.push(cloud);
        }
    }

    switchToNewLevel(level) {
        this.gameModel.setLevel(level);
        this.upperTerrain.setChannelHeightPercent(this.gameModel.getChannelHeightPercent());
        this.lowerTerrain.setChannelHeightPercent(this.gameModel.getChannelHeightPercent());
    }

    incrementLevel() {
        this.gameModel.incrementLevel();
        this.upperTerrain.setChannelHeightPercent(this.gameModel.getChannelHeightPercent());
        this.lowerTerrain.setChannelHeightPercent(this.gameModel.getChannelHeightPercent());
    }

    onMouseDown(e) {
        //console.log("Mouse Down!");
        if (this.gameModel.getGameState() === GAME_STATES.GAME_OVER) {
            this.quitGame();
            return;
        }

        if (this.gameModel.getGameState() === GAME_STATES.GAME_BEFORE_START) {
            this.startGame();
            return;
        }

        if (!this.samolet) {
            return;
        }

        this.MOUSE_DOWN = true;

        this.samolet.initiateMove();

        this.soundManager.play("SOUND_engine_turbo");
        this.soundManager.stopSound("SOUND_falling1");

        this.fireRocketScreen(e);
    }

    onMouseUp(e) {
        //console.log("Mouse Up!");
        var gameState = this.gameModel.getGameState();
        if (gameState != GAME_STATES.GAME_STARTED && gameState != GAME_STATES.GAME_BEFORE_OVER) {

            return;
        }

        this.MOUSE_DOWN = false;

        if (this.samolet) {
            this.samolet.clearVector();
        }

        this.soundManager.play("SOUND_falling1");
        this.soundManager.stopSound("SOUND_engine_turbo");
    }

    onMouseMove(e) {
        //console.log("Mouse Move!");

        var gameState = this.gameModel.getGameState();
        if (gameState != GAME_STATES.GAME_STARTED && gameState != GAME_STATES.GAME_BEFORE_OVER) {

            return;
        }

        var x = e.data.global.x;
        var y = e.data.global.y;

        var globalPoint = new PIXI.Point(x, y);

        var mcPoint = this.gameContainer.toLocal(globalPoint, this.app.stage);

        this.targetCursor.setPosition({ x: mcPoint.x, y: mcPoint.y });

        if (!this.MOUSE_DOWN) {
            return;
        }
    }

    onKeyDown(e) {
        var gameState = this.gameModel.getGameState();
        if (gameState != GAME_STATES.GAME_STARTED && gameState != GAME_STATES.GAME_BEFORE_OVER) {

            return;
        }

        if (e.keyCode === 32) {
            var state = !this.gameModel.getRocketsState();
            this.setRocketsState(state);
            this.rocketsBtn.switch(state);
        }
    }

    createAdditionalContourCPs() {
        this.upperTerrain.generateBaseCPs();
        this.lowerTerrain.generateBaseCPs(this.upperTerrain.getBaseCPs());

        this.generateRealContourCPs();
    }

    updateEnemyXCoords() {
        for (var i = 0; i < this.enemyTargets.length; i++) {
            this.enemyTargets[i].incrementXPosition(-INIT_SCREEN_DIMENSIONS.width);
        }
    }

    //------------------------Terrain-------------------------------
    deleteAndTranslateCPs() {
        this.upperTerrain.deleteAndTranslateCPs();
        this.lowerTerrain.deleteAndTranslateCPs();
    }

    generateRealContourCPs() {
        this.upperTerrain.generateDetailedCPs();
        this.lowerTerrain.generateDetailedCPs();
    }

    setRocketsState(isActive) {
        this.gameModel.setRocketsState(isActive);
        this.targetCursor.switchActive(isActive);
    }

    updateTerrainContainer() {
        this.updateEnemyXCoords()
        this.deleteAndTranslateCPs();
        this.createAdditionalContourCPs();
        this.redrawContours();
    }

    redrawContours() {
        this.upperTerrain.draw();
        this.lowerTerrain.draw();
    }

    //----------------------------End Terrain-----------------------------------

    updateDistanceCounters(speed) {
        var distanceCounters = this.gameModel.updateDistanceCounters(speed);

        if (distanceCounters.distReset) {
            this.gameModel.resetDistanceCounter();
            this.gameModel.incrementDistance();

            if (this.gameModel.getDistance() % DISTANCE_PER_LEVEL === 0) {
                this.incrementLevel();
            }
        }

        if (distanceCounters.newObjReset) {
            this.decideForNewGameObjects();
        }
    }

    decideForNewGameObjects() {
        var rockChance = Math.random();
        if (rockChance < this.gameModel.getRockChance()) {
            this.initiateRock();
        }

        var rpuChance = Math.random();
        if (rpuChance < this.gameModel.getRPUChance()) {  // DEBUG
            this.initiateRPU();
        }

        if (this.enemyTargets.length > 0) {
            this.activateEnemy();
        }

        var newEnemyChance = Math.random();
        if (newEnemyChance < this.gameModel.getETChance()) {    // DEBUG
            this.initiateETarget();
        }
    }

    activateEnemy() {
        var numActivations = Math.floor(Math.random() * 2) + 1;

        for (var i = 0; i < numActivations; i++) {
            if (!this.enemyTargets[i]) {
                return;
            }
            var enemyActivationChance = Math.random();
            if (enemyActivationChance < this.gameModel.getEnemyActivationChance()) {
                var activated = this.enemyTargets[i].activate();
                if (activated) {
                    this.soundManager.play("SOUND_enemy_active");
                }
            }
        }
    }

    initiateRock() {
        var rockPoints = this.upperTerrain.createHole(this.gameContainer);
        if (rockPoints && rockPoints.length > 0) {
            this.createRock(rockPoints);
        }
    }

    createRock(rockCoords) {
        for (var n = 0; n < rockCoords.length; n++) {
            rockCoords[n] = this.rocksContainer.toLocal(new PIXI.Point(rockCoords[n].x, rockCoords[n].y));
        }

        var rockID = this.gameModel.incrementRocks();
        var rock = new Rock(rockCoords, this.gameModel.getSpeed(), this.rocksContainer, rockID, this.gameContainer, this.app.stage, this.deviceCoef);
        this.fallingRocks.push(rock);
    }

    fireRocketScreen(e) {
        if (!this.samolet) {
            return;
        }
        if (!this.gameModel.getRocketsState()) {
            return;
        }

        if (this.gameModel.getRocketsLeft() <= 0) {
            return;
        }

        this.soundManager.play("SOUND_rocket1");

        var angle = this.calculateVector(e);
        var texturesRaketa = [this.loadingModule.getNonAnimatedTexture("raketa"), this.loadingModule.getNonAnimatedTexture("raketa2")];
        var frontPoint = this.samolet.getCenterPoint();
        var rocket = new Raketa(texturesRaketa, { x: frontPoint.x, y: frontPoint.y }, angle, this.gameContainer, this.deviceCoef);
        this.rockets.push(rocket);

        this.gameModel.incrementRocketsFired();
    }

    initiateRPU() {
        var x = INIT_SCREEN_DIMENSIONS.width * 1.1;
        var y = Math.random() * INIT_SCREEN_DIMENSIONS.height * 0.4 + INIT_SCREEN_DIMENSIONS.height * 0.3;
        var types = [RPU_TYPE_1, RPU_TYPE_2, RPU_TYPE_3];
        var index = Math.floor(Math.random() * (types.length));
        var type = types[index];
        var textures;
        var scale;
        switch (type) {
            case RPU_TYPE_1:
                textures = this.loadingModule.getRPU1Textures();
                scale = 0.2;
                break;

            case RPU_TYPE_2:
                textures = this.loadingModule.getRPU2Textures();
                scale = 0.22;
                break;

            case RPU_TYPE_3:
                textures = this.loadingModule.getRPU3Textures();
                scale = 0.25;
                break;
        }

        var rpu = new PowerUp(this.gameContainer, textures, this.upperTerrain, this.lowerTerrain, this.app.stage, this.deviceCoef, x, y, type, scale);
        rpu.setZIndex(50);
        this.RPUs.push(rpu);
    }

    initiateETarget() {
        var basePoint = { x: INIT_SCREEN_DIMENSIONS.width * 1.1, y: 0 };
        var interpolationPoint = this.upperTerrain.getTerrainInterpolationPointLocal(basePoint, this.gameContainer);
        var yCoord = interpolationPoint.y * Math.random();

        //console.log("NEW E-TARGET!");

        var enemyTarget = new EnemyTarget(this.terrainContainer, this.gameContainer, this.particleTraceContainer, this.loadingModule.getSkullTextures(), this.particleTextures, this.particleTraceHolder,
            this.app.stage, interpolationPoint.x, yCoord, this.deviceCoef);
        this.enemyTargets.push(enemyTarget);
    }

    gameLoop() {
        if (!this.gameModel) {
            return;
        }

        var gameState = this.gameModel.getGameState();

        this.updateObjects(gameState);
        this.checkCollisions(gameState);
    }

    updateObjects(gameState) {
        if (gameState != GAME_STATES.GAME_STARTED && gameState != GAME_STATES.GAME_BEFORE_OVER) {
            return;
        }

        if (gameState === GAME_STATES.GAME_BEFORE_OVER) {
            //console.log("GAME BEFORE OVER");
        }

        this.updateDeviceCoef();

        var speed = this.gameModel.getSpeed();
        //-----------------move terrain and bkg containers-------------------------
        if (this.terrainContainer) {
            this.terrainContainer.x -= speed;

            if (this.terrainContainer.x <= -INIT_SCREEN_DIMENSIONS.width) {
                this.terrainContainer.x = 0;

                this.updateTerrainContainer();
            }

            this.updateDistanceCounters(speed);
        }

        if (this.skyContainer) {
            this.skyContainer.x -= speed * 0.2;

            var xCoef = this.skySprite.width / this.skySprite.texture.width;
            if (this.skyContainer.x <= -INIT_SCREEN_DIMENSIONS.width) {
                this.skyContainer.x = 0;
            }
        }

        if (this.terrainBkg) {
            this.terrainBkg.x -= speed * 0.4;

            var xCoef = this.terrainBkg.width / this.terrainBkg.texture.width;
            if (this.terrainBkg.x <= -(this.terrainBkg.width - INIT_SCREEN_DIMENSIONS.width * xCoef)) {
                this.terrainBkg.x = 0;
            }
        }

        if (this.samolet) {
            this.samolet.update();
        }

        //---------------------------------------------------------------------------

        var rockInd = 0;
        var rocketInd = 0;
        var explInd = 0;
        var explPartInd = 0;
        var enemyInd = 0
        var rpuInd = 0;
        var islandInd = 0;
        var pTraceInd = 0;

        var rockEnded = false;
        var rocketEnded = false;
        var explEnded = false;
        var explPartEnded = false;
        var enemyEnded = false;
        var rpuEnded = false;
        var islandEnded = false;
        var pTraceEnded = false;

        //var counter  =0;
        while (!(rockEnded && rocketEnded && explEnded && explPartEnded && enemyEnded && rpuEnded && islandEnded && pTraceEnded)) {

            /*console.log("updating... " + counter);
            counter++;

            console.log("rockInd: " + rockInd + " rocketInd: " + rocketInd + " explInd: " + explInd + " explPartInd: " + explPartInd + 
            " enemyInd: " + enemyInd + " rpuInd: " + rpuInd + " islandInd: " + islandInd);*/

            if (this.fallingRocks[rockInd]) {
                if (!this.fallingRocks[rockInd].update()) {
                    this.destroyArrayObject(this.fallingRocks, rockInd);  //if rock is out of screen borders
                    rockInd--;
                }
                rockInd++;
            } else {
                rockEnded = true;
            }

            if (this.explosionParticles[explPartInd]) {
                if (this.explosionParticles[explPartInd].update()) {
                    this.destroyArrayObject(this.explosionParticles, explPartInd);  //if explosion particle is out of screen borders
                    explPartInd--;
                }
                explPartInd++;
            } else {
                explPartEnded = true;
            }

            if (this.rockets[rocketInd]) {
                if (this.rockets[rocketInd].update()) {
                    this.destroyArrayObject(this.rockets, rocketInd);  //if rocket is out of screen borders
                    rocketInd--;
                }
                rocketInd++;
            } else {
                rocketEnded = true;
            }

            if (this.enemyTargets[enemyInd]) {
                var samoletCP = (this.samolet) ? this.samolet.getCenterPoint() : null;
                if (this.enemyTargets[enemyInd].update(samoletCP)) {
                    /*if (this.enemyTargets[enemyInd].active) {
                        this.samoletCollide();
                    }*/
                    this.destroyArrayObject(this.enemyTargets, enemyInd);  //if enemy is out of screen borders
                    //console.log("this.enemyTargets.length: " + this.enemyTargets.length);
                    enemyInd--;
                }
                enemyInd++;
            } else {
                enemyEnded = true;
            }

            //console.log("rocketExplosions length: " + this.rocketExplosions.length);

            if (this.rocketExplosions[explInd]) {
                if (this.rocketExplosions[explInd].powerRing && this.samolet) {
                    this.rocketExplosions[explInd].setPosition(this.samolet.getCenterPoint());
                }

                if (this.rocketExplosions[explInd].finished) {
                    this.destroyArrayObject(this.rocketExplosions, explInd);  //if explosion finished
                    //console.log("EXPLOSION CLEARED! " + this.rocketExplosions.length);
                    explInd--;
                }
                explInd++;
            } else {
                explEnded = true;
            }

            if (this.RPUs[rpuInd]) {
                this.RPUs[rpuInd].update();
                if (this.RPUs[rpuInd].forDestroy) {
                    this.destroyArrayObject(this.RPUs, rpuInd);  //if explosion finished
                    //console.log("RPU CLEARED: " + this.RPUs.length);
                    rpuInd--;
                }
                rpuInd++;
            } else {
                rpuEnded = true;
            }


            if (this.flyingIslands[islandInd]) {
                this.flyingIslands[islandInd].update();   //------------------------------------------THIS COULD BE BETTER WITH INCREMENTATION!!!---------------
                islandInd++;
            } else {
                islandEnded = true;
            }

            if (this.particleTraceHolder[pTraceInd]) {
                if (this.particleTraceHolder[pTraceInd].update()) {
                    this.destroyArrayObject(this.particleTraceHolder, pTraceInd);  //if ParticleTrace finished
                    pTraceInd--;

                    //console.log("this.particleTraceHolder: " + this.particleTraceHolder.length);
                }
                pTraceInd++;
            } else {
                pTraceEnded = true;
            }
        }
    }

    checkCollisions(gameState) {
        if (gameState != GAME_STATES.GAME_STARTED) {
            return;
        }

        var samoletCollisionPoints = this.samolet.getCollisionPoints();
        var samoletColPoints = [samoletCollisionPoints[1], samoletCollisionPoints[2], samoletCollisionPoints[3]];

        //-------------------------Samolet with upper and lower terrains collision---------------------------
        for (var col = 0; col < samoletColPoints.length; col++) {
            var upperTerrainCollide;
            var lowerTerrainCollide;

            if (col === 0 || col === 1) {
                upperTerrainCollide = this.upperTerrain.checkPointForCollision(samoletColPoints[col], this.gameContainer);
                if (upperTerrainCollide) {
                    //console.log("UPPER TERRAIN COLLISION!!!");
                    this.samoletCollide();
                    return;
                }
            }

            if (col === 1 || col === 2) {
                lowerTerrainCollide = this.lowerTerrain.checkPointForCollision(samoletColPoints[col], this.gameContainer);
                if (lowerTerrainCollide) {
                    //console.log("LOWER TERRAIN COLLISION!!!");
                    this.samoletCollide();
                    return;
                }
            }
        }


        SamoletCPLoop:
        for (var s = 0; s < samoletCollisionPoints.length; s++) {
            for (var fs = 0; fs < this.fallingRocks.length; fs++) {
                var isCollision = this.fallingRocks[fs].checkForPointCollision(samoletCollisionPoints[s]);
                if (isCollision) {
                    this.samoletCollide();  //if rock has collided with samolet
                    return;
                }
            }

            var samoletCollisionPointPixi = new PIXI.Point(samoletCollisionPoints[s].x, samoletCollisionPoints[s].y);
            var samoletCollisionPointTerrain = this.terrainContainer.toLocal(samoletCollisionPointPixi, this.gameContainer);

            for (var et = 0; et < this.enemyTargets.length; et++) {
                if (this.enemyTargets[et].collisionTestRadius(samoletCollisionPointTerrain, 0.7)) {
                    var enemyPosition = this.enemyTargets[et].getPositionConverted(this.gameContainer);
                    this.startSkullExplosion(enemyPosition);

                    this.destroyArrayObject(this.enemyTargets, et);

                    this.samoletCollide();

                    return;
                }
            }

            RPUsLoop:
            for (var p = 0; p < this.RPUs.length; p++) {
                if (!this.RPUs[p].taken && this.RPUs[p].collisionTest(samoletCollisionPoints[s])) {
                    var newRockets = this.RPUs[p].getValue();
                    this.gameModel.addRockets(newRockets);

                    this.soundManager.play("SOUND_powerUp");

                    this.RPUs[p].initiateDestroy();
                    this.startRPUImplosion(this.samolet.getCenterPoint());

                    var rpuType = this.RPUs[p].getType();
                    var score;
                    switch (rpuType) {
                        case RPU_TYPE_1:
                            score = SCORE_TABLE.POWER_UP_1;
                            break;

                        case RPU_TYPE_2:
                            score = SCORE_TABLE.POWER_UP_2;
                            break;

                        case RPU_TYPE_3:
                            score = SCORE_TABLE.POWER_UP_3;
                            break;
                    }

                    this.gameModel.updateScore(score);

                    break RPUsLoop;
                }
            }
        }


        RocketsLoop:
        for (var r = 0; r < this.rockets.length; r++) {

            var rocketCollisionPoint = this.rockets[r].getCollisionPoint();

            //rocket collision test - upper terrain
            var upperTerrainRocketCollide = this.upperTerrain.checkPointForCollision(rocketCollisionPoint, this.gameContainer);
            if (upperTerrainRocketCollide) { // make the hole in the terrain and create the falling rock----------------
                //console.log("UPPER TERRAIN ROCKET COLLISION!!!");
                var rockPoints = this.upperTerrain.createHole(this.gameContainer, rocketCollisionPoint);
                if (rockPoints && rockPoints.length > 0) {
                    this.createRock(rockPoints);
                }
                this.startRocketExplosion(rocketCollisionPoint);

                this.destroyArrayObject(this.rockets, r);
                r--;

                continue RocketsLoop;
            }

            //rocket collision test - lower terrain
            var lowerTerrainRocketCollide = this.lowerTerrain.checkPointForCollision(rocketCollisionPoint, this.gameContainer);
            if (lowerTerrainRocketCollide) {
                //console.log("LOWER TERRAIN ROCKET COLLISION!!!");
                this.startRocketExplosion(rocketCollisionPoint);

                this.destroyArrayObject(this.rockets, r);
                r--;

                continue RocketsLoop;
            }

            RocketsRocksLoop:
            for (var f = 0; f < this.fallingRocks.length; f++) {
                // ---------------------------------------------if this is rocket collision point-----------------------

                var isRocketCollision = this.fallingRocks[f].checkForPointCollision(rocketCollisionPoint);
                if (isRocketCollision) {  // if rock has collided with rocket
                    this.blowUpRock(this.fallingRocks[f]);
                    this.startRocketExplosion(rocketCollisionPoint);

                    this.destroyArrayObject(this.fallingRocks, f);
                    this.destroyArrayObject(this.rockets, r);
                    r--;

                    this.gameModel.updateScore(SCORE_TABLE.ROCK);

                    continue RocketsLoop;
                }
            }

            var rocketCollisionPointPixi = new PIXI.Point(rocketCollisionPoint.x, rocketCollisionPoint.y);
            var rocketCollisionPointTerrain = this.terrainContainer.toLocal(rocketCollisionPointPixi, this.gameContainer);

            EnemyTargets:
            for (var eta = 0; eta < this.enemyTargets.length; eta++) {  //check current rocket collision against all enemies
                if (this.enemyTargets[eta].collisionTestRadius(rocketCollisionPointTerrain)) {

                    this.soundManager.stopSound("SOUND_enemy_active");

                    //console.log("START ENEMY EXPLLOOSSSIIIIIOOOOOOONNNNNN!!!");

                    var enemyPosition = this.enemyTargets[eta].getPositionConverted(this.gameContainer);
                    this.startSkullExplosion(enemyPosition);

                    this.destroyArrayObject(this.enemyTargets, eta);

                    rocketDestroyed = this.destroyArrayObject(this.rockets, r);
                    r--;

                    this.gameModel.incrementEnemiesKilled();

                    continue RocketsLoop;
                }
            }
        } //-----------end Rockets loop-----------------------


        /*this.counterr++;                  // DEBUG
        if (this.counterr >= 100) {
            console.log("LOOP ENDED");
            this.counterr = 0;
        }*/
    }


    blowUpRock(rock) {
        this.soundManager.play("SOUND_expl1");

        var rockEPoints = rock.getExplosionPoints();
        var rockBounds = rock.getRockBounds();
        this.createParticles(rockEPoints, rockBounds);
    }

    destroyArrayObject(array, index) {
        if (array[index].destroy) {
            array[index].destroy();
        }
        array.splice(index, 1);

        return true;
    }

    startRPUImplosion(point) {
        var localPoint = this.explosionsContainer.toLocal(new PIXI.Point(point.x, point.y), this.gameContainer);
        var textures = this.loadingModule.getPRTextures();
        var rpuPowerRing = new Explosion(this.explosionsContainer, textures, localPoint.x, localPoint.y, 1, null, true);
        this.rocketExplosions.push(rpuPowerRing);

    }

    startRocketExplosion(point) {
        this.soundManager.play("SOUND_expl2");

        var localPoint = this.explosionsContainer.toLocal(new PIXI.Point(point.x, point.y), this.gameContainer);
        var textures = this.loadingModule.getExplosionTextures();
        var scaleFactor = Math.random() * 0.5 + 0.5;
        var rocketExplosion = new Explosion(this.explosionsContainer, textures, localPoint.x, localPoint.y, scaleFactor);
        this.rocketExplosions.push(rocketExplosion);
    }

    startSkullExplosion(point) {
        this.soundManager.play("SOUND_expl3");

        var localPoint = this.explosionsContainer.toLocal(new PIXI.Point(point.x, point.y), this.gameContainer);
        var textures = this.loadingModule.getExplosionSkullTextures();
        var scaleFactor = Math.random() * 0.6 + 0.6;
        var enemyExplosion = new Explosion(this.explosionsContainer, textures, localPoint.x, localPoint.y, scaleFactor);
        this.rocketExplosions.push(enemyExplosion);

        //console.log("EXPLOSIONS COUNTTTT: " + this.rocketExplosions.length);
    }

    createParticles(particlesCoords, rockBounds) {
        for (var i = 0; i < particlesCoords.length; i++) {
            var particle = new Particle(particlesCoords[i].x, particlesCoords[i].y, this.gameContainer, rockBounds, this.deviceCoef);
            this.explosionParticles.push(particle);
        }
    }

    samoletCollide() {
        if (!this.samolet) {
            return;
        }

        this.soundManager.play("SOUND_expl4");

        this.soundManager.stopSound("SOUND_engine");
        this.soundManager.stopSound("SOUND_falling1");

        var position = this.samolet.getCenterPoint();
        var localPoint = this.explosionsContainer.toLocal(new PIXI.Point(position.x, position.y), this.gameContainer);
        this.samolet.destroy();
        this.samolet = null;

        var textures = this.loadingModule.getExplosionTextures();
        var explosionSamolet = new Explosion(this.explosionsContainer, textures, localPoint.x, localPoint.y, 0.7);
        this.rocketExplosions.push(explosionSamolet);

        this.gameModel.setGameState(GAME_STATES.GAME_BEFORE_OVER);
        this.finishGameTimeoutID = setTimeout(this.finishGame, GAME_FINISH_TIME_SEC * 1000);
    }

    finishGame() {
        clearTimeout(this.finishGameTimeoutID);
        this.timer.reset();
        this.gameModel.finishGame();
        for (var r = 0; r < this.rockets.length; r++) {
            this.rockets[r].stopAnim();
        }

        for (var e = 0; e < this.enemyTargets.length; e++) {
            this.enemyTargets[e].stopAnim();
        }

        for (var re = 0; re < this.rocketExplosions.length; re++) {
            this.rocketExplosions[re].stopAnim();
            //this.rocketExplosions[re].destroy();
        }

        this.soundManager.stopAllSounds();

        var textures = this.loadingModule.getExplosionTextures();
        this.endMessage = new EndMessage(this.gameContainer, textures, this.soundManager, this.appModel);

        this.app.ticker.remove(this.gameLoop);
    }

    quitGame() {
        this.gameContainer.removeChild(this.terrainContainer);
        this.terrainContainer.destroy();
        this.terrainContainer = null;
        this.gameContainer.removeChild(this.islandsContainer);
        this.islandsContainer.destroy();
        this.islandsContainer = null;
        this.app.stage.removeChild(this.gameContainer);
        this.gameContainer.destroy();
        this.gameContainer = null;

        this.upperTerrain.destroy();
        this.lowerTerrain.destroy();

        this.resetAll();

        this.switchBeginScreen();
    }

    calculateVector(e) {
        var localCoords = this.gameContainer.toLocal(new PIXI.Point(e.data.global.x, e.data.global.y), this.stage);
        //console.log(`x: ${localCoords.x}`);
        //console.log(`y: ${localCoords.y}`);

        var deltaX = localCoords.x - this.samolet.getX();
        var deltaY = this.samolet.getY() - localCoords.y;
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

        //console.log("ANGLE: " + angle);

        return angle;
    }

    repositionAndResizeObjects() {
        this.scaleFactor = this.globalContainer.clientHeight / INIT_SCREEN_DIMENSIONS.height;
        this.gameContainer.scale = new PIXI.ObservablePoint(null, null, this.scaleFactor, this.scaleFactor);

        var status = this.getEnvironmentStatus();
        this.setRocketBtnPositionAndSize(status);

        if (this.samolet) {
            if (status.isLandscape) {
                this.samolet.setXPosition(INIT_SCREEN_DIMENSIONS.width * SAMOLET_X_POS_LANDSCAPE);
            } else {
                this.samolet.setXPosition(INIT_SCREEN_DIMENSIONS.width * SAMOLET_X_POS_PORTRAIT);
            }
        }
    }

    resize() {
        if (!this.gameContainer) {
            return;
        }

        //console.log("width: " + width + ", this.container.clientHeight: " + width);

        this.repositionAndResizeObjects();

        if (this.infoLabel) {
            this.infoLabel.resize();
        }

        if (this.infoDisplay) {
            this.infoDisplay.resize();
        }
    }

    getEnvironmentStatus() {
        var landscape = (window.innerWidth > window.innerHeight);

        return {
            isMobile: this.IS_MOBILE,
            isLandscape: landscape,
        }
    }

    /*initPeriodicFunction(fn, runEvery) {
       let counter = 0
       return function (deltaTime) {
           counter += deltaTime
           while (counter >= runEvery) {
               fn()
               counter -= runEvery
           }
       }
   }*/

    initPeriodicFunction(fn, runEvery) {
        let counter = 0
        return function () {
            var now = new Date();
            var lastMoment = arguments.callee.lastDate;
            if (lastMoment) {
                var deltaTime = now - lastMoment;
                counter += deltaTime;
                //console.log("deltaTime: " + deltaTime);
                //console.log("counter: " + counter);
                while (counter >= runEvery) {
                    //console.log("running...");
                    fn();
                    counter = 0;
                    //counter -= runEvery;
                }
            } else {
                fn();
            }

            arguments.callee.lastDate = now;
        }
    }

    //--------------------System-----------------------------
    updateDeviceCoef() {
        //console.log("DELTA TIME: " + this.app.ticker.deltaTime);
        this.deviceCoef.coef = this.app.ticker.deltaTime / GAME_LOOP_BASE_MS;
    }

    onTimer() {
        //console.log("TIMER TICK!");
    }

    createBackground() {
        this.terrainBkg = PIXI.Sprite.from(this.loadingModule.getNonAnimatedTexture("terrain1Blur"));
        this.terrainBkg.width = 7000;
        this.terrainBkg.height = 700;
        this.terrainBkg.x = 0;
        this.terrainBkg.y = INIT_SCREEN_DIMENSIONS.height - this.terrainBkg.height;
        //this.gameContainer.addChild(this.terrainBkg);
    }

}