const INITIAL_ROCKETS_STOCK = require("../globals").INITIAL_ROCKETS_STOCK;
const LEVEL_CONFIGURATION = require("../globals").LEVEL_CONFIGURATION;
const SCORE_TABLE = require("../globals").SCORE_TABLE;
const DISTANCE_UNIT_SIZE = require("../globals").DISTANCE_UNIT_SIZE; 
const NEW_OBJECTS_DISTANCE_UNIT = require("../globals").NEW_OBJECTS_DISTANCE_UNIT;
const GAME_STATES = require("../globals").GAME_STATES;


module.exports = class GameModel {
    constructor(deviceCoef = {coef: 1}) {
        this.deviceCoef = deviceCoef;

        this.gameState = GAME_STATES.GAME_BEFORE_START;

        this.numRocks = 0;
        this.allRocketsFired = 0;
        this.rocketsLeft = 0;
        this.rocketsStock = 0;
        this.RPUCollected = 0;
        this.rocketsState = false;
        this.enemiesKilled = 0;
        this.distanceCovered = 0;
        this.currentDistanceUnitCounter = 0;
        this.newObjectsDistanceCounter = 0;

        this.score = 0;

        this.currentLevel = 0;

        this.infoDisplay;
    }

    reset() {
        this.currentLevel = 0;
        //this.currentLevel = 19;
        this.numRocks = 0;
        this.allRocketsFired = 0;
        this.rocketsLeft = INITIAL_ROCKETS_STOCK;
        this.RPUCollected = 0;
        this.enemiesKilled = 0;
        this.distanceCovered = 0;
        this.currentDistanceUnitCounter = 0;
        this.newObjectsDistanceCounter = 0;
        this.score = 0;

        if (this.infoDisplay) {
            this.infoDisplay.updateRocketsLeftNumber(this.getRocketsLeft());
            this.infoDisplay.updateEnemiesKilled(this.getEnemiesKilled());
            this.infoDisplay.updateDistanceCovered(this.getDistance());
            this.infoDisplay.updateLevel(this.getLevelForDisplay());
            this.infoDisplay.updateScore(this.getScore());
        }
    }

    finishGame() {
        this.gameState = GAME_STATES.GAME_OVER;
    }

    getGameState() {
        return this.gameState;
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    setInfoDisplay(infoDisplay) {
        this.infoDisplay = infoDisplay;
    }

    updateScore(type) {
        this.score += type;

        if (this.infoDisplay) {
            this.infoDisplay.updateScore(this.getScore());
        }
    }

    setLevel(level) {
        if (level >= LEVEL_CONFIGURATION.length) {
            //console.log("MAX LEVEL ALREADY REACHED! NOT SETTING NEW VALUE");
            return;
        }

        this.currentLevel = level;

        if (this.infoDisplay) {
            this.infoDisplay.updateLevel(this.getLevelForDisplay());
        }
    }

    incrementLevel() {
        if (this.currentLevel >= LEVEL_CONFIGURATION.length - 1) {
            //console.log("MAX LEVEL ALREADY REACHED! NOT INCREMENTING!");
            return;
        }

        this.currentLevel++;

        if (this.infoDisplay) {
            this.infoDisplay.updateLevel(this.getLevelForDisplay());
        }
    }

    incrementRocketsFired() {
        if (this.rocketsLeft <= 0) {
            this.rocketsLeft = 0;
            return;
        }

        this.allRocketsFired++;
        this.rocketsLeft--;

        if (this.infoDisplay) {
            this.infoDisplay.updateRocketsLeftNumber(this.getRocketsLeft());
        }
    }

    incrementEnemiesKilled() {
        this.enemiesKilled++;

        if (this.infoDisplay) {
            this.infoDisplay.updateEnemiesKilled(this.getEnemiesKilled());
        }

        this.updateScore(SCORE_TABLE.ENEMY);
    }

    incrementDistance() {
        this.distanceCovered++;

        if (this.infoDisplay) {
            this.infoDisplay.updateDistanceCovered(this.getDistance());
        }
    }

    addRockets(numRockets) {
        this.rocketsLeft += numRockets;

        if (this.infoDisplay) {
            this.infoDisplay.updateRocketsLeftNumber(this.getRocketsLeft());
        }
    }

    getScore() {
        return this.score;
    }

    getLevel() {
        return this.currentLevel;
    }

    getLevelForDisplay() {
        var displayLevel = this.currentLevel + 1;
        return displayLevel;
    }

    getSpeed() {
        return LEVEL_CONFIGURATION[this.currentLevel].speed*this.deviceCoef.coef;
    }

    getRockChance() {
        return LEVEL_CONFIGURATION[this.currentLevel].rockChance;
    }

    getRPUChance() {
        return LEVEL_CONFIGURATION[this.currentLevel].rpuChance;
    }

    getETChance() {
        return LEVEL_CONFIGURATION[this.currentLevel].newEnemyChance;
    }

    getEnemyActivationChance() {
        return LEVEL_CONFIGURATION[this.currentLevel].enemyActivationChance;
    }

    getChannelHeightPercent() {
        return LEVEL_CONFIGURATION[this.currentLevel].channelHeightPercent;
    }

    incrementRocks() {
        this.numRocks++;
        return this.numRocks;
    }

    incrementRPU() {
        this.RPUCollected++;
    }

    getDistance() {
        return this.distanceCovered;
    }

    updateDistanceCounters(amount) {
        var distCounterReset = false;
        var newObjCounterReset = false;

        this.currentDistanceUnitCounter += amount;       
        this.newObjectsDistanceCounter += amount;

        //console.log("this.newObjectsDistanceCounter: " + this.newObjectsDistanceCounter);

        if(this.currentDistanceUnitCounter > DISTANCE_UNIT_SIZE) {
            this.currentDistanceUnitCounter = 0;

            distCounterReset = true;
        }

        if(this.newObjectsDistanceCounter > NEW_OBJECTS_DISTANCE_UNIT) {
            this.newObjectsDistanceCounter = 0;

            newObjCounterReset = true;
        }

        return {
            distReset: distCounterReset,
            newObjReset: newObjCounterReset
        }
    }

    getDistanceCounter() {
        return this.currentDistanceUnitCounter;
    }

    resetDistanceCounter() {
        this.currentDistanceUnitCounter = 0;
    }

    getEnemiesKilled() {
        return this.enemiesKilled;
    }

    getRocketsFired() {
        return this.allRocketsFired;
    }

    getRocketsLeft() {
        return this.rocketsLeft;
    }

    setRocketsState(state) {
        this.rocketsState = state;
    }

    getRocketsState() {
        return this.rocketsState;
    }
}