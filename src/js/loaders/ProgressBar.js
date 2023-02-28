module.exports = class ProgressBar {
    constructor(parentContainer) {
        this.parentContainer = parentContainer;
        this.container = document.createElement("div");
        this.parentContainer.appendChild(this.container);

        this.outerDiv = document.createElement("div");
        this.outerDiv.className = "preloaderOuter";

        this.innerDiv = document.createElement("div");
        this.innerDiv.className = "preloaderInner";

        this.outerDiv.appendChild(this.innerDiv);

        this.container.appendChild(this.outerDiv);
    }

    updateProgressBar(progress) {
        this.innerDiv.style.width = progress + "%";
    }
}