const PIXI = require("pixi.js");
const PreloaderBlock = require("./loaders/preloader_block");
const PixiLoadingModule = require("./loaders/PixiLoadingModule");
const BeginScreen = require("./screens/BeginScreen");
const GameScreen = require("./screens/GameScreen");
const { UAParser } = require("ua-parser-js");
const Model = require("./model/Model");
const SoundManager = require("./sound/SoundManager");

const CE = require("./globals").CE;
const { LANDSCAPE } = require("./globals");
const { PORTRAIT } = require("./globals");
const SOUNDS_CONFIGURATION = require("./globals").SOUNDS_CONFIGURATION;
const BEGIN_SCREEN = require("./globals").BEGIN_SCREEN;
const GAME_SCREEN = require("./globals").GAME_SCREEN;
const INIT_SCREEN_DIMENSIONS = require("./globals").INIT_SCREEN_DIMENSIONS;

//------------------preloader-----------------
var preloader;
//--------------------------------------------

//----------------device------------------

//------------------containers----------------
var globalContainer;

//-------------loadingModule---------------
var loadingModule;

//-----------------------model-------------------
var appModel;

//------------------app----------------------------
var pixiApp;

//-------------------------sounds---------------------
var soundManager;

//-----------------screens---------------------
var beginScreen;
var gameScreen;

//--------------------------------------------

window.onload = () => initialStart();

function initialStart() {
    window.onload = null;

    var initialSize = { width: window.innerWidth, height: window.innerHeight };
    preloader = new PreloaderBlock(document.body, initialSize);
    preloader.setZIndex(101);
    preloader.addToContainer();

    globalContainer = CE("div", "globalContainer", document.body, "GLOBAL_CONTAINER");

    setupPixiScene();
}

function setupPixiScene() {
    pixiApp = new PIXI.Application({
        width: INIT_SCREEN_DIMENSIONS.width,
        height: INIT_SCREEN_DIMENSIONS.height,
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1       // default: 1
    });

    pixiApp.renderer.background.color = 0x000000;
    globalContainer.appendChild(pixiApp.view);
    pixiApp.stage.interactive = true;
    pixiApp.view.style.display = "block";

    loadingModule = new PixiLoadingModule(startApp, onResourcesLoadingProgress);
    loadingModule.startLoading();
}

function onResourcesLoadingProgress(progress) {
    preloader.updatePreloader(progress);
}

function startApp() {
    soundManager = new SoundManager(SOUNDS_CONFIGURATION);
    appModel = new Model();
    appModel.setIsMobile(checkIfMobile());

    addEventListeners();

    createScreens();

    onResize();

    switchBeginScreen();

    setTimeout(preloader.removePreloader, 500);
}

function addEventListeners() {
    window.addEventListener("resize", onResize);
}

function createScreens() {
    beginScreen = new BeginScreen(pixiApp, loadingModule, soundManager, appModel, switchGameScreen, globalContainer);
    gameScreen = new GameScreen(pixiApp, loadingModule, soundManager, appModel, switchBeginScreen, globalContainer);
}

function switchBeginScreen() {
    gameScreen.removeFromContainer();
    beginScreen.addToContainer();

    appModel.setCurrentScreen(BEGIN_SCREEN);

    onResize();
}

function switchGameScreen() {
    beginScreen.removeFromContainer();
    gameScreen.prepareNewGame();
    gameScreen.addToContainer();
   
    appModel.setCurrentScreen(GAME_SCREEN);

    onResize();
}

function onResize(e) {
    //console.log("resizing...");
    if (window.innerWidth >= window.innerHeight) {
        appModel.setScreenMode(LANDSCAPE);
    } else {
        appModel.setScreenMode(PORTRAIT);
    }

    var scaleFactor = globalContainer.clientHeight / INIT_SCREEN_DIMENSIONS.height;
    var gameScreenWidth = INIT_SCREEN_DIMENSIONS.width * scaleFactor;

    //console.log("window.innerWidth: " + window.innerWidth + " game width: " + gameScreenWidth);

    var screenMode = appModel.getScreenMode();
    var currentScreen = appModel.getCurrentScreen();

    //--------------------------position of globalContainer
    if(currentScreen === BEGIN_SCREEN) {

        globalContainer.style.justifyContent = "flex-start";
        pixiApp.renderer.resize(globalContainer.clientWidth, globalContainer.clientHeight);

    } else if (currentScreen === GAME_SCREEN) {

        pixiApp.renderer.resize(gameScreenWidth, globalContainer.clientHeight);

        if (screenMode === PORTRAIT) {
            globalContainer.style.justifyContent = "flex-start";
        } else if (screenMode === LANDSCAPE) {
            if(gameScreenWidth > globalContainer.clientWidth) {
                globalContainer.style.justifyContent = "flex-start";
            } else {
                globalContainer.style.justifyContent = "center";
            }
        }
    }

    beginScreen.resize();

    gameScreen.resize();
}

function checkIfMobile() {
    var isMobile = false;

    this.uaParser = new UAParser(navigator.userAgent);
    var osResult = this.uaParser.getOS();
    var os = osResult.name.toLowerCase();
    if (os.includes("android") || os.includes("blackberry") || os.includes("ios") || os.includes("windows [phone/mobile]") ||
        os.includes("bada") || os.includes("symbian") || os.includes("palm") || os.includes("webos")) {
        isMobile = true;
    }

    return isMobile;
}



//----------------------------------------------

//------------------------------------------------------------



