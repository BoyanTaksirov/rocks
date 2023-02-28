
const PIXI = require("pixi.js");

module.exports = class PixiLoadingModule {
    constructor(onLoadCallback, progressCallback) {
        this.onLoadCallback = onLoadCallback;
        this.progressCallback = progressCallback;

        this.gameResourcesLoaded = this.gameResourcesLoaded.bind(this);
        this.explLoadingProgress = this.explLoadingProgress.bind(this);
        this.explSkullLoadingProgress = this.explSkullLoadingProgress.bind(this); 
        this.RPU1Progress = this.RPU1Progress.bind(this);
        this.RPU2Progress = this.RPU2Progress.bind(this);
        this.RPU3Progress = this.RPU3Progress.bind(this);
        this.skullProgress = this.skullProgress.bind(this);
        this.burner1Progress = this.burner1Progress.bind(this);
        this.burner2Progress = this.burner2Progress.bind(this);
        this.staticImagesProgress = this.staticImagesProgress.bind(this);
        this.overallProgress = this.overallProgress.bind(this);

        this.explProgressInd = 0;
        this.explEnemyProgressInd = 0;
        this.RPU1ProgressInd = 0;
        this.RPU2ProgressInd = 0;
        this.RPU3ProgressInd = 0;
        this.enemyProgressInd = 0;
        this.burner1ProgressInd = 0;
        this.burner2ProgressInd = 0;
        this.staticImagesProgressInd = 0;

        this.overallProgressInd = 0;

        this.gameTextures;
    }

    startLoading() {
        this.loadResources();
    }

    async loadResources() {
        
        this.powerRingSpritesheet = await PIXI.Assets.load('./assets/images/powerring/powerring.json', this.explLoadingProgress);
        this.rpu1Spritesheet = await PIXI.Assets.load('./assets/images/rpu/rpu1/rpu1v.json', this.RPU1Progress);
        this.rpu2Spritesheet = await PIXI.Assets.load('./assets/images/rpu/rpu2/rpu2v.json', this.RPU2Progress);
        this.rpu3Spritesheet = await PIXI.Assets.load('./assets/images/rpu/rpu3/rpu3v.json', this.RPU3Progress);
        this.explosionSpritesheet = await PIXI.Assets.load('./assets/images/expl/explosionRocket.json', this.explLoadingProgress);
        this.explosionSkullSpritesheet = await PIXI.Assets.load('./assets/images/expl/explosionSkull3.json', this.explSkullLoadingProgress);
        this.skullSpritesheet = await PIXI.Assets.load('./assets/images/skull/skull3.json', this.skullProgress);
        this.burner1Spritesheet = await PIXI.Assets.load('./assets/images/burner/ShipBurner1b.json', this.burner1Progress);
        this.burner2Spritesheet = await PIXI.Assets.load('./assets/images/burner/ShipBurner2b.json', this.burner2Progress);

        PIXI.Assets.addBundle('staticImages', {
            splash: './assets/images/splash/splash1.jpg',
            splashPortrait: './assets/images/splash/splash1portrait.jpg',
            samolet: './assets/images/samoletMalak.png',
            raketa: './assets/images/raketa.png',
            raketa2: './assets/images/raketa2.png',
            rocketsOn: './assets/images/rocketsOn.png',
            rocketsOff: './assets/images/rocketsOff.png',
            sky: './assets/images/sky3.jpg',
            targetActive: './assets/images/TargetActive.png',
            targetInactive: './assets/images/TargetInactive.png',
            island1: './assets/images/islands/island1.png',
            island2: './assets/images/islands/island2.png',
            island3: './assets/images/islands/island3.png',
            island4: './assets/images/islands/island4.png',
            island5: './assets/images/islands/island5.png',
            island6: './assets/images/islands/island6.png',
            island7: './assets/images/islands/island7.png',
            island8: './assets/images/islands/island8.png',
            /*island9: './assets/images/islands/island9.png',
            island10: './assets/images/islands/island10.png',
            island11: './assets/images/islands/island11.png',
            island12: './assets/images/islands/island12.png',*/

            island1s: './assets/images/islands/island1s.png',
            island2s: './assets/images/islands/island2s.png',
            island3s: './assets/images/islands/island3s.png',
            island4s: './assets/images/islands/island4s.png',
            island5s: './assets/images/islands/island5s.png',
            island6s: './assets/images/islands/island6s.png',
            island7s: './assets/images/islands/island7s.png',
            island8s: './assets/images/islands/island8s.png',
            /*island9s: './assets/images/islands/island9s.png',
            island10s: './assets/images/islands/island10s.png',
            island11s: './assets/images/islands/island11s.png',
            island12s: './assets/images/islands/island12s.png',*/
            
            rock1: './assets/images/islands/rock1.png',
            rock2: './assets/images/islands/rock2.png',
            rock3: './assets/images/islands/rock3.png',
            rock4: './assets/images/islands/rock4.png',
            rock5: './assets/images/islands/rock5.png',
            rock6: './assets/images/islands/rock6.png',
            rock7: './assets/images/islands/rock7.png',
            rock8: './assets/images/islands/rock8.png',
            rock9: './assets/images/islands/rock9.png',
            rock10: './assets/images/islands/rock10.png',
            rock11: './assets/images/islands/rock11.png',
            rock12: './assets/images/islands/rock12.png',

            rock1s: './assets/images/islands/rock1s.png',
            rock2s: './assets/images/islands/rock2s.png',
            rock3s: './assets/images/islands/rock3s.png',
            rock4s: './assets/images/islands/rock4s.png',
            rock5s: './assets/images/islands/rock5s.png',
            rock6s: './assets/images/islands/rock6s.png',
            rock7s: './assets/images/islands/rock7s.png',
            rock8s: './assets/images/islands/rock8s.png',
            rock9s: './assets/images/islands/rock9s.png',
            rock10s: './assets/images/islands/rock10s.png',
            rock11s: './assets/images/islands/rock11s.png',
            rock12s: './assets/images/islands/rock12s.png',

            cloud1: './assets/images/clouds/cloud1.png',   
            cloud2: './assets/images/clouds/cloud2.png',  
            cloud3: './assets/images/clouds/cloud3.png',  
            cloud4: './assets/images/clouds/cloud4.png',   
            cloud5: './assets/images/clouds/cloud5.png',   
            
            particle1:  './assets/images/particles/particle1.png',      
            particle2:  './assets/images/particles/particle2.png',    
            particle3:  './assets/images/particles/particle3.png',     
            
            fontSFAftershock: './assets/fonts/SFAftershockDebris.fnt',
            fontRubikOne: './assets/fonts/RubikOne.fnt',
            fontRubikOneWhite: './assets/fonts/RubikOneWhite.fnt',
        });

        this.assets = PIXI.Assets.loadBundle('staticImages', this.staticImagesProgress).then(this.gameResourcesLoaded, this.onLoadingError);
    }

    explLoadingProgress(progress) {
        //console.log("expl loading: " + progress);
        this.explProgressInd = progress;
        this.overallProgress();
    }

    explSkullLoadingProgress(progress) {
        //console.log("expl skull loading: " + progress);
        this.explEnemyProgressInd = progress;
        this.overallProgress();
    }

    RPU1Progress(progress) {
        //console.log("RPU1 loading: " + progress);
        this.RPU1ProgressInd = progress;
        this.overallProgress();
    }

    RPU2Progress(progress) {
        //console.log("RPU2 loading: " + progress);
        this.RPU2ProgressInd = progress;
        this.overallProgress();
    }

    RPU3Progress(progress) {
        //console.log("RPU3 loading: " + progress);
        this.RPU3ProgressInd = progress;
        this.overallProgress();
    }

    skullProgress(progress) {
        //console.log("Skull loading: " + progress);
        this.enemyProgressInd = progress;
        this.overallProgress();
    }

    burner1Progress(progress) {
        //console.log("Burner1 loading: " + progress);
        this.burner1ProgressInd = progress;
        this.overallProgress();
    }

    burner2Progress(progress) {
        //console.log("Burner2 loading: " + progress);
        this.burner2ProgressInd = progress;
        this.overallProgress();
    }

    staticImagesProgress(progress) {
        //console.log("StaticImages loading: " + progress);
        this.staticImagesProgressInd = progress;
        this.overallProgress();
    }

    gameResourcesLoaded(textures) {
        this.gameTextures = textures;
        this.overallProgress();
    }

    overallProgress() {
        var progress = this.explEnemyProgressInd + this.RPU1ProgressInd + this.RPU2ProgressInd + this.RPU3ProgressInd + this.enemyProgressInd +
        this.burner1ProgressInd + this.burner2ProgressInd + this.staticImagesProgressInd;

        progress = progress/8;

        this.progressCallback(progress*100);

        if(progress >= 1 && this.gameTextures) {
            this.onLoadCallback();
        }
    }

    onLoadingError() {

    }


    //---------------------------------------------------------------------------------------------------

    getExplosionTextures() {
        return this.explosionSpritesheet.animations["explFirst"];
    }

    getExplosionSkullTextures() {
        return this.explosionSkullSpritesheet.animations["explSkull"];
    }

    getRPU1Textures() {
        return this.rpu1Spritesheet.animations["rpu1v"];
    }

    getRPU2Textures() {
        return this.rpu2Spritesheet.animations["rpu2v"];
    }

    getRPU3Textures() {
        return this.rpu3Spritesheet.animations["rpu3v"];
    }

    getPRTextures() {
        return this.powerRingSpritesheet.animations["PowerRing"];
    }

    getSkullTextures() {
       return this.skullSpritesheet.animations["Skull"];
    }

    getBurner1Textures() {
        return this.burner1Spritesheet.animations["burner"];
    }

    getBurner2Textures() {
        return this.burner2Spritesheet.animations["burnerTurbo"];
    }

    getNonAnimatedTexture(textureName) {
        return this.gameTextures[textureName];
    }

    getGameTexturesSpritesheet() {
        return this.gameTextures;
    }
}