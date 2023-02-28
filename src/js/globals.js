//-----------------------PATHS--------------------------------
var GLOBAL_PATH = "./assets/";

//-----------------------------sounds paths----------------------------

var EXPL1_PATH = GLOBAL_PATH + "sounds/explosion1.wav";
var EXPL2_PATH = GLOBAL_PATH + "sounds/explosion2.wav";
var EXPL3_PATH = GLOBAL_PATH + "sounds/explosion3.wav";
var EXPL4_PATH = GLOBAL_PATH + "sounds/explosion4.wav";
var EXPL5_PATH = GLOBAL_PATH + "sounds/explosion5.wav";
var EXPL6_PATH = GLOBAL_PATH + "sounds/explosion6.wav";

var ROCKET1_PATH = GLOBAL_PATH + "sounds/rocket_fire1.wav";
var ROCKET2_PATH = GLOBAL_PATH + "sounds/rocket_fire2.wav";
var ROCKET3_PATH = GLOBAL_PATH + "sounds/rocket_fire3.wav";

var POWER_UP_PATH = GLOBAL_PATH + "sounds/power_up_grab.wav";

var ENEMY_PATH = GLOBAL_PATH + "sounds/enemy.wav";

var ENGINE_PATH = GLOBAL_PATH + "sounds/engine_out.wav";
var ENGINE_TURBO_PATH = GLOBAL_PATH + "sounds/engine_turbo.wav";

var FALLING_PATH = GLOBAL_PATH + "sounds/falling1.wav";

//-----------------------------Paths and names configuration array-------------------

module.exports.SOUNDS_CONFIGURATION = [
    { path: EXPL1_PATH, name: "SOUND_expl1" },
    { path: EXPL2_PATH, name: "SOUND_expl2" },
    { path: EXPL3_PATH, name: "SOUND_expl3" },
    { path: EXPL4_PATH, name: "SOUND_expl4" },
    { path: EXPL5_PATH, name: "SOUND_expl5" },
    { path: EXPL6_PATH, name: "SOUND_expl6" },
    { path: ROCKET1_PATH, name: "SOUND_rocket1" },
    { path: ROCKET2_PATH, name: "SOUND_rocket2" },
    { path: ROCKET3_PATH, name: "SOUND_rocket3" },
    { path: POWER_UP_PATH, name: "SOUND_powerUp" },
    { path: ENEMY_PATH, name: "SOUND_enemy_active" },
    { path: ENGINE_PATH, name: "SOUND_engine" },
    { path: ENGINE_TURBO_PATH, name: "SOUND_engine_turbo" },
    { path: FALLING_PATH, name: "SOUND_falling1" },
]

//------------------------END PATHS--------------------------------------

//-------GLOBAL CONSTANTS -----------------------------
module.exports.LANDSCAPE = "LANDSCAPE";
module.exports.PORTRAIT = "PORTRAIT";
module.exports.BEGIN_SCREEN = "BEGIN_SCREEN";
module.exports.GAME_SCREEN = "GAME_SCREEN";

//--------------------SYSTEM--------------------------------
module.exports.GAME_LOOP_BASE_MS = 0.4;

module.exports.GAME_STATES = {
    GAME_BEFORE_START: "GAME_BEFORE_START",
    GAME_STARTED: "GAME_STARTED",
    GAME_BEFORE_OVER: "GAME_BEFORE_OVER",
    GAME_OVER: "GAME_OVER",
}

//---------------------------GAME CONSTANTS------------------------
module.exports.INIT_SCREEN_DIMENSIONS = { width: 1920, height: 1080 };
module.exports.CONTOURS_START_POSITION = 500;
module.exports.CONTOURS_CP_PER_SCREEN = 7;
module.exports.SEGMENT_DIVISIONS = 30;
module.exports.CHANNEL_HEIGHT_PERCENT = 0.7;

module.exports.SAMOLET_Y_ACCELERATION = 0.4;
module.exports.SAMOLET_MAX_Y_SPEED = -12;
module.exports.SAMOLET_Y_GRAVITY = 0.15;
module.exports.SAMOLET_MAX_Y_FALL = 17;
module.exports.SAMOLET_MAX_ANGLE = 30;
module.exports.SAMOLET_X_POS_LANDSCAPE = 0.15;
module.exports.SAMOLET_X_POS_PORTRAIT = 0.05;

module.exports.CONTOUR_ROUGHNESS_PERCENT = 0.02;
module.exports.RANGE_POINTS_OF_ROCKS = 10;
module.exports.ROCKS_TIMER_INTERVAL_MSEC = 1000;  

module.exports.ROCK_MIN_X_PERCENT = 1.4;
module.exports.ROCK_MAX_X_PERCENT = 2;

module.exports.ROCK_MIN_Y_STEP = 0.7;
module.exports.ROCK_MAX_Y_STEP = 1.2;

module.exports.ROCK_MIN_ROT_STEP = 0.1;
module.exports.ROCK_MAX_ROT_STEP = 1;

module.exports.BEGIN_ROCKS_ZONE_COEF = 0.35;
module.exports.ROCKET_ACCELERATION = 0.4;
module.exports.MAX_ROCKET_STEP = 5;
module.exports.EXPLOSION_PARTICLES_COEF = 3;
module.exports.MIN_PARTICLE_POINTS = 3;
module.exports.MAX_PARTICLE_POINTS = 7;
module.exports.GAME_FINISH_TIME_SEC = 2;
module.exports.INITIAL_ROCKETS_STOCK = 100;

module.exports.MIN_RPU_SPEED = 0.2;
module.exports.MAX_RPU_SPEED = 1;
module.exports.RPU_MA_LENGTH = 30;
module.exports.RPU_TYPE_1 = "RPU_TYPE_1";
module.exports.RPU_TYPE_2 = "RPU_TYPE_2";
module.exports.RPU_TYPE_3 = "RPU_TYPE_3";
module.exports.RPU_TYPE_1_VALUE = 10;
module.exports.RPU_TYPE_2_VALUE = 20;
module.exports.RPU_TYPE_3_VALUE = 30;

module.exports.PARTICLE_SPEEED = 6;
module.exports.PARTICLE_SPEEED_MAX = 15;

module.exports.TERRAIN_CONTAINER_STEP = 1;
module.exports.TERRAIN_CONTAINER_STEP_MOBILE = 3;

module.exports.FLYING_ISLANDS_MIN_STEP = 0.1;
module.exports.FLYING_ISLANDS_MAX_STEP = 0.5;
module.exports.FLYING_ISLANDS_MIN_WIDTH_PERCENT = 0.05;
module.exports.FLYING_ISLANDS_MAX_WIDTH_PERCENT = 0.42;
module.exports.FLYING_ISLANDS_COUNT = 12;
module.exports.FLYING_ISLANDS_TINT_RANGE = 200;

module.exports.FLYING_ROCKS_COUNT = 12;
module.exports.CLOUDS_COUNT = 6;

module.exports.INFO_DISPLAY_HEIGHT = 35;
module.exports.INFO_DISPLAY_TEXT_SIZE = 30;
module.exports.INFO_DISPLAY_TEXT_SIZE_PORTRAIT = 25;

//-------------------------distance------------------------
module.exports.DISTANCE_UNIT_SIZE = 500;

module.exports.DISTANCE_PER_LEVEL = 10;

module.exports.NEW_OBJECTS_DISTANCE_UNIT = 100;

module.exports.END_MESSAGE = "Game Over!";
module.exports.END_MESSAGE_MOBILE = `Game 
Over!`;


module.exports.LEVEL_CONFIGURATION = [
    {
        level: 1,
        speed: 0.7,
        rpuChance: 0.06,
        rockChance: 0.3,
        newEnemyChance: 0.15,
        enemyActivationChance: 0,
        channelHeightPercent: 0.9,
        levelText: 
        `        Tap or press left mouse button to gain height. 
        Release it to fall. 

        Press rocket button on the bottom right of the screen 
        or "space" key to toggle rocket firing mode.

        Then when tapping or pressing 
        left mouse button rockets are fired too.

        Collect items to have rockets.

        Tap or click to start Level 1`,

        levelTextMobile: 
        `        Tap or press left mouse button 
        to gain height. 

        Release it to fall. 

        Press rocket button 
        on the bottom right of the screen 
        or "space" key to 
        toggle rocket firing mode.

        Then when tapping or pressing 
        left mouse button 
        rockets are fired too.

        Collect items to have rockets.

        Tap or click to start Level 1`,
    },
    {
        level: 2,
        speed: 0.8,
        rpuChance: 0.055,
        rockChance: 0.32,
        newEnemyChance: 0.17,
        enemyActivationChance: 0.065,
        channelHeightPercent: 0.75,
        levelText: `Level 2`
    },
    {
        level: 3,
        speed: 0.7,
        rpuChance: 0.055,
        rockChance: 0.25,
        newEnemyChance: 0.17,
        enemyActivationChance: 0,
        channelHeightPercent: 0.55,
        levelText: `Level 3 - The Narrow Tunnel`
    },
    {
        level: 4,
        speed: 0.8,
        rpuChance: 0.05,
        rockChance: 0.35,
        newEnemyChance: 0.18,
        enemyActivationChance: 0.075,
        channelHeightPercent: 0.5,
        levelText: `Level 4`
    },
    {
        level: 5,
        speed: 0.9,
        rpuChance: 0.05,
        rockChance: 0.38,
        newEnemyChance: 0.19,
        enemyActivationChance: 0.08,
        channelHeightPercent: 0.85,
        levelText: `Level 5`
    },
    {
        level: 6,
        speed: 1,
        rpuChance: 0.05,
        rockChance: 0.4,
        newEnemyChance: 0.2,
        enemyActivationChance: 0.08,
        channelHeightPercent: 0.65,
        levelText: `Level 6`
    },
    {
        level: 7,
        speed: 1.1,
        rpuChance: 0.05,
        rockChance: 0.41,
        newEnemyChance: 0.21,
        enemyActivationChance: 0.09,
        channelHeightPercent: 0.6,
        levelText: `Level 7`
    },
    {
        level: 8,
        speed: 1.1,
        rpuChance: 0.045,
        rockChance: 0.41,
        newEnemyChance: 0.22,
        enemyActivationChance: 0.1,
        channelHeightPercent: 0.7,
        levelText: `Level 8`
    },
    {
        level: 9,
        speed: 1.1,
        rpuChance: 0.045,
        rockChance: 0.41,
        newEnemyChance: 0.23,
        enemyActivationChance: 0.11,
        channelHeightPercent: 0.47,
        levelText: `Level 9`
    },
    {
        level: 10,
        speed: 1.2,
        rpuChance: 0.04,
        rockChance: 0.41,
        newEnemyChance: 0.24,
        enemyActivationChance: 0.12,
        channelHeightPercent: 0.7,
        levelText: `Level 10`
    },
    {
        level: 11,
        speed: 1.2,
        rpuChance: 0.04,
        rockChance: 0.42,
        newEnemyChance: 0.24,
        enemyActivationChance: 0.12,
        channelHeightPercent: 0.6,
        levelText: `Level 11`
    },
    {
        level: 12,
        speed: 1.2,
        rpuChance: 0.05,
        rockChance: 0.42,
        newEnemyChance: 0.24,
        enemyActivationChance: 0.12,
        channelHeightPercent: 0.47,
        levelText: `Level 12`
    },
    {
        level: 13,
        speed: 1.2,
        rpuChance: 0.05,
        rockChance: 0.42,
        newEnemyChance: 0.26,
        enemyActivationChance: 0.10,
        channelHeightPercent: 0.5,
        levelText: `Level 13`
    },
    {
        level: 14,
        speed: 1.2,
        rpuChance: 0.03,
        rockChance: 0.42,
        newEnemyChance: 0.28,
        enemyActivationChance: 0.12,
        channelHeightPercent: 0.6,
        levelText: `Level 14`
    },
    {
        level: 15,
        speed: 1.3,
        rpuChance: 0.03,
        rockChance: 0.42,
        newEnemyChance: 0.22,
        enemyActivationChance: 0.13,
        channelHeightPercent: 0.5,
        levelText: `Level 15`
    },
    {
        level: 16,
        speed: 1.3,
        rpuChance: 0.04,
        rockChance: 0.42,
        newEnemyChance: 0.22,
        enemyActivationChance: 0.14,
        channelHeightPercent: 0.6,
        levelText: `Level 16`
    },
    {
        level: 17,
        speed: 1.3,
        rpuChance: 0.03,
        rockChance: 0.43,
        newEnemyChance: 0.22,
        enemyActivationChance: 0.14,
        channelHeightPercent: 0.55,
        levelText: `Level 17`
    },
    {
        level: 18,
        speed: 1.4,
        rpuChance: 0.03,
        rockChance: 0.43,
        newEnemyChance: 0.24,
        enemyActivationChance: 0.14,
        channelHeightPercent: 0.4,
        levelText: `Level 18`
    },
    {
        level: 19,
        speed: 1.2,
        rpuChance: 0.05,
        rockChance: 0.44,
        newEnemyChance: 0.24,
        enemyActivationChance: 0.15,
        channelHeightPercent: 0.55,
        levelText: `Level 19`
    },
    {
        level: 20,
        speed: 1.4,
        rpuChance: 0.07,
        rockChance: 0.46,
        newEnemyChance: 0.26,
        enemyActivationChance: 0.15,
        channelHeightPercent: 0.57,
        levelText: `Level 20`
    },
]

module.exports.FLYING_ISLANDS_PARAMS = [
    { widthPercent: 1, xStep: 0.5, zIndex: 72, textureIndex: 5, alpha: 0.4 },
    //{ widthPercent: 0.69, xStep: 0.45, zIndex: 110, textureIndex: 1, alpha: 0.4 },
    { widthPercent: 0.55, xStep: 0.4, zIndex: 70, textureIndex: 2, alpha: 0.5  },
    //{ widthPercent: 0.47, xStep: 0.35, zIndex: 90, textureIndex: 3 },
    { widthPercent: 0.42, xStep: 0.32, zIndex: 60, textureIndex: 3, alpha: 0.6  },
    //{ widthPercent: 0.39, xStep: 0.3, zIndex: 70, textureIndex: 5 },
    { widthPercent: 0.37, xStep: 0.27, zIndex: 40, textureIndex: 7, alpha: 0.7  },
    //{ widthPercent: 0.32, xStep: 0.23, zIndex: 50, textureIndex: 7 },
    //{ widthPercent: 0.28, xStep: 0.2, zIndex: 40, textureIndex: 8 },
    { widthPercent: 0.22, xStep: 0.15, zIndex: 30, textureIndex: 4, alpha: 0.75  },
    { widthPercent: 0.18, xStep: 0.1, zIndex: 20, textureIndex: 0, alpha: 0.8  },
    { widthPercent: 0.05, xStep: 0.07, zIndex: 10, textureIndex: 1, alpha: 0.9  },
]

/*module.exports.FLYING_ISLANDS_PARAMS = [
    { widthPercent: 1, xStep: 0.5, zIndex: 72, textureIndex: 0, alpha: 0.4 },
    //{ widthPercent: 0.69, xStep: 0.45, zIndex: 110, textureIndex: 1, alpha: 0.4 },
    { widthPercent: 0.55, xStep: 0.4, zIndex: 70, textureIndex: 2, alpha: 0.5  },
    //{ widthPercent: 0.47, xStep: 0.35, zIndex: 90, textureIndex: 3 },
    { widthPercent: 0.42, xStep: 0.32, zIndex: 60, textureIndex: 4, alpha: 0.6  },
    //{ widthPercent: 0.39, xStep: 0.3, zIndex: 70, textureIndex: 5 },
    { widthPercent: 0.37, xStep: 0.27, zIndex: 40, textureIndex: 6, alpha: 0.7  },
    //{ widthPercent: 0.32, xStep: 0.23, zIndex: 50, textureIndex: 7 },
    //{ widthPercent: 0.28, xStep: 0.2, zIndex: 40, textureIndex: 8 },
    { widthPercent: 0.22, xStep: 0.15, zIndex: 30, textureIndex: 9, alpha: 0.75  },
    { widthPercent: 0.18, xStep: 0.1, zIndex: 20, textureIndex: 10, alpha: 0.8  },
    { widthPercent: 0.05, xStep: 0.07, zIndex: 10, textureIndex: 11, alpha: 0.9  },
]*/

module.exports.FLYING_ROCKS_PARAMS = [
    { widthPercent: 0.5, alpha: 0.1, xStep: 0.3, zIndex: 1120 },
    { widthPercent: 0.7, alpha: 0.2, xStep: 0.5, zIndex: 1110 },
    { widthPercent: 0.25, alpha: 0, xStep: 0.7, zIndex: 1100 },
    { widthPercent: 0.12, alpha: 0.15, xStep: 0.3, zIndex: 1090 },
    { widthPercent: 0.55, alpha: 0.3, xStep: 0.5, zIndex: 1080 },
    { widthPercent: 0.75, alpha: 0.25,  xStep: 0.7, zIndex: 1070 },
    { widthPercent: 0.12, alpha: 0,  xStep: 0.9, zIndex: 1060 },
    { widthPercent: 0.34, alpha: 0.2,  xStep: 0.7, zIndex: 1050 },
    { widthPercent: 0.18, alpha: 0.1,  xStep: 0.6, zIndex: 1040 },
    { widthPercent: 0.81, alpha: 0.15,  xStep: 0.9, zIndex: 1030 },
    { widthPercent: 0.69, alpha: 0.05,  xStep: 0.7, zIndex: 1020 },
    { widthPercent: 0.75, alpha: 0.4,  xStep: 0.5, zIndex: 1010 },
]

module.exports.CLOUDS_PARAMS = [
    { widthPercent: 2, xStep: 0.1, zIndex: 35 },
    { widthPercent: 0.95, xStep: 0.09, zIndex: 45 },
    { widthPercent: 0.92, xStep: 0.1, zIndex: 55 },
    { widthPercent: 1.6, xStep: 0.12, zIndex: 65 },
    { widthPercent: 1.2, xStep: 0.15, zIndex: 75 },
    { widthPercent: 1.65, xStep: 0.1, zIndex: 85 },
    { widthPercent: 1.7, xStep: 0.05, zIndex: 95 },
    { widthPercent: 1.4, xStep: 0.07, zIndex: 105 },
    { widthPercent: 0.7, xStep: 0.15, zIndex: 115 },
    { widthPercent: 0.5, xStep: 0.17, zIndex: 125 },
    { widthPercent: 0.9, xStep: 0.11, zIndex: 135 },
]

module.exports.SCORE_TABLE = {
    ENEMY: 10,
    POWER_UP_1: 1,
    POWER_UP_2: 2,
    POWER_UP_3: 3,
    ROCK: 5,
    NEW_LEVEL: 2,
    DISTANCE: 1,
}

module.exports.WORD_COLORS_B_S = [
    "rgb(255, 0, 0)",
    "rgb(0, 0, 0)",
    "rgb(112, 112, 112)",
    "rgb(150, 0, 0)",
    /*"rgb(48, 255, 0)",
    
    "rgb(255, 120, 0)",
    "rgb(91, 102, 0)",
    "rgb(196, 196, 196)",
    "rgb(126, 39, 0)",
    "rgb(222, 52, 0)",*/
]

//----------END GLOBAL VARS------------------



module.exports.CE = function (type, elementClass, parentContainer, id) {
    var element = document.createElement(type);
    element.className = elementClass;
    if (id) {
        element.id = id;
    }
    if (parentContainer) {
        parentContainer.appendChild(element);
    }

    return element;
}

module.exports.getShadeOfColor = function (range) {
    const R = range[0];
    const G = range[1];
    const B = range[2];

    var R_Shade = 0;
    var G_Shade = 0;
    var B_Shade = 0;

    if (R) {
        R_Shade = Math.random() * (R[1] - R[0]) + R[0];
    }

    if (G) {
        G_Shade = Math.random() * (G[1] - G[0]) + G[0];
    }

    if (B) {
        B_Shade = Math.random() * (B[1] - B[0]) + B[0];
    }

    return `rgb(${R_Shade}, ${G_Shade}, ${B_Shade})`;
}

module.exports.textureObjectToArray = function (textureObject) {
    var textureArray = [];
    for (let texRes in textureObject) {
        if (!textureObject.hasOwnProperty(texRes)) {
            continue;
        }

        textureArray.push(textureObject[texRes]);
    }

    return textureArray;
}

module.exports.degreesToRadians = function (degrees) {
    return degrees * (Math.PI / 180);
}

module.exports.radiansToDegrees = function (radians) {
    return radians * (180 / Math.PI);
}

module.exports.decToHexColor = function(R, G, B) {
    var rHex = R.toString(16);
    var gHex = G.toString(16);
    var bHex = B.toString(16);

    return "0x" + rHex + gHex + bHex;
}

module.exports.checkPointInBounds = function(point, bounds) {
    if(point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height) {
        return true;
    }

    return false;
}

