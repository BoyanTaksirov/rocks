module.exports = class AbstractScreen {
    constructor() {
        this.idName;
        this.container;
        this.parentContainer;
    }

    addToContainer(pContainer) {
        this.removeFromContainer();
        this.parentContainer = pContainer;
        pContainer.appendChild(this.container);
    }

    removeFromContainer(){
        if (this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }

        this.parentContainer = null;
    }

    show() {
        this.container.style.display = "block";
    }

    hide() {
        this.container.style.display = "none";
    }

    resize() {
        //console.log("resize " + this.idName);
    }

    clear() {
        this.container.replaceChildren();
        this.removeFromContainer();
    }
}