const ProgressBar = require("./ProgressBar");
const ProgressBarBlockType = require("./progress_bar_block_type");

module.exports = class PreloaderBlock {
    constructor(parentContainer, initialSize, onClickedCallback) {
        this.parentContainer = parentContainer;
        if (onClickedCallback) {
            this.onClickedCallback = onClickedCallback;
        }

        this.removePreloader = this.removePreloader.bind(this);

        this.removePreloaderAndClearAll = this.removePreloaderAndClearAll.bind(this);

        this.updatePreloader = this.updatePreloader.bind(this);

        this.container = document.createElement("div");
        this.container.className = "preloaderBlockBkg";

        this.progressBarBlock = new ProgressBarBlockType(this.container, initialSize);
        this.progressBarBlock.addToContainer();

        this.container.addEventListener("click", this.onClicked.bind(this));

        this.label = document.createElement("div");
        this.label.className = "preloaderBlockLabel";

        this.container.appendChild(this.label);

        this.progressBar = new ProgressBar(this.container);

        this.updatePreloader(0);
    }

    setZIndex(zIndex) {
        this.container.style.zIndex = zIndex;
    }

    updatePreloader(progress) {
        var progresRounded = Math.round(progress);
        this.label.innerText = progresRounded + "%";
        this.progressBar.updateProgressBar(progress);
        this.progressBarBlock.updateProgressBar(progress);
    }

    onClicked(e) {
        if (this.onClickedCallback) {
            this.onClickedCallback();
        }
    }

    addToContainer() {
        if (!this.container.parentNode) {
            this.parentContainer.appendChild(this.container);
        }
    }

    removeFromContainer() {
        this.parentContainer.removeChild(this.container);
    }

    resetPreloader() {
        this.label.innerText = 0 + "%";
        this.progressBar.updateProgressBar(0);

    }

    removePreloader() {
        this.container.removeEventListener("click", this.onClicked);
        this.container.addEventListener("animationend", this.removePreloaderAndClearAll);
        this.container.style.animation = "preloaderFadeOut 0.5s forwards";
    }

    removePreloaderAndClearAll() {
        this.container.removeEventListener("animationend", this.removePreloaderAndClearAll);
        this.removeFromContainer();
    }
}




