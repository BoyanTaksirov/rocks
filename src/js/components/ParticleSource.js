const PIXI = require("pixi.js");
const ParticleTrace = require("./ParticleTrace");

module.exports = class ParticleSource {
    constructor(objectContainer, particleContainer, particleTextures, particleHolder) {
        this.objectContainer = objectContainer;
        this.particleContainer = particleContainer;
        this.particleTextures = particleTextures;
        this.particleHolder = particleHolder;

        //this.particleGenInterval = Math.floor(Math.random()*5) + 5;
        this.particleGenInterval = 0;
        this.currentGenInterval = 0;

        this.active = false;
    }

    update(position) {
        if(!this.active) {
            return;
        }

        if(this.currentGenInterval >=  this.particleGenInterval) {
            this.generateParticle(position);
            this.currentGenInterval = 0;
            this.particleGenInterval = Math.floor(Math.random()*5) + 5;
        } else {
            this.currentGenInterval++;
        }
    }

    generateParticle(position) {
        //console.log("PARTICLE GENERATED!!!");
        var index = Math.floor(Math.random()*this.particleTextures.length);
        var particleTexture = this.particleTextures[index];
        var positionConv = this.particleContainer.toLocal(new PIXI.Point(position.x, position.y), this.objectContainer);
        var particleTrace = new ParticleTrace(this.particleContainer, particleTexture, positionConv); //, rotationStep, size, scaleStep, alpha, alphaStep);
        this.particleHolder.push(particleTrace);

    }

    activate() {
        this.active = true;
    }
}