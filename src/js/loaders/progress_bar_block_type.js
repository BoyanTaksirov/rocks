const ProgressBarBlock = require("./ProgressBarBlock");

module.exports = class ProgressBarBlockType
{
    constructor(_parentContainer, initialSize) {
        this.parentContainer = _parentContainer;

        this.resize = this.resize.bind(this)

        this.currentProgressPercent = 0;
        this.ACTIVE = false;

        this.SIZE_COEF = 0.015;
        this.GAP_COEF = 0;

        this.container = document.createElement("div");
        this.container.className = "progressBarBT_CCSS";

        this.updateProgressBar = this.updateProgressBar.bind(this);

        this.blockInitArray = new Array();
        this.blockInitArray[0] = new Array();

        this.blockInitArray[0][0] = "************";
        this.blockInitArray[0][1] = "*****--*****";
        this.blockInitArray[0][2] = "*****--*****";
        this.blockInitArray[0][3] = "*****--*****";
        this.blockInitArray[0][4] = "*****--*****";
        this.blockInitArray[0][5] = "*****--*****";
        this.blockInitArray[0][6] = "*****--*****";
        this.blockInitArray[0][7] = "*****--*****";
        this.blockInitArray[0][8] = "************";
        this.blockInitArray[0][9] = "*****--*****";
        this.blockInitArray[0][10] = "*****--*****";
        this.blockInitArray[0][11] = "************";

        this.coordinatesArray = new Array();
        this.blockArray = new Array();

        this.horizontalBlocksCount = 0;
        this.verticalBlocksCount = 0;

        this.toggleVisibility(false);

        this.setDimensions(initialSize);
        this.createBlocks();

        window.addEventListener("resize", this.resize.bind(this));
    }
    setZIndex(value) {
        this.container.style.zIndex = value;
    }
    
    resize(e) {
        this.setDimensions();
        this.resizeReal();
    }
    
    setDimensions(initialSize) {
        var size = this.parentContainer.clientWidth * this.SIZE_COEF;
        var gap = Math.round(this.parentContainer.clientWidth * this.GAP_COEF);
    
        if (initialSize) {
            size = initialSize.width * this.SIZE_COEF;
            gap = Math.round(initialSize.width * this.GAP_COEF);
        }
    
        if (size > window.innerHeight * 0.05) {
            size = window.innerHeight * 0.05;
            gap = window.innerHeight * 0.01;
        }
    
        this.blockWidth = size;
        this.blockHeight = this.blockWidth;
        this.gap = gap;
    
        this.container.style.width = this.blockInitArray[0][0].length * (this.blockWidth + this.gap) + "px"
        this.container.style.height = this.blockInitArray[0].length * (this.blockWidth + this.gap) + "px";
    
        this.getBlockCoordinates();
    }
    
    resizeReal() {
        for (var i = 0; i < this.blockArray.length; i++) {
            this.blockArray[i].resize(this.blockWidth, this.blockHeight);
            this.blockArray[i].setPosXY(this.coordinatesArray[i].left, this.coordinatesArray[i].top);
        }
    }
    
    getBlockCoordinates() {
        this.horizontalBlocksCount = this.blockInitArray[0][0].length;
        this.verticalBlocksCount = this.blockInitArray[0].length;
    
        this.coordinatesArray = new Array();
        for (var row = this.blockInitArray[0].length - 1; row >= 0; row--) {
            for (var column = 0; column < this.blockInitArray[0][0].length; column++) {
                if (this.blockInitArray[0][row].charAt(column) === "*") {
                    var coordX = column * (this.blockWidth + this.gap);
                    var coordY = row * (this.blockHeight + this.gap);
                    var coordsXY = { left: coordX, top: coordY };
                    this.coordinatesArray.push(coordsXY);
                }
            }
        }
    }
    
    createBlocks() {
        for (var i = 0; i < this.coordinatesArray.length; i++) {
            var tempBlock = new ProgressBarBlock(this.coordinatesArray[i].left, this.coordinatesArray[i].top, this.blockWidth, this.blockHeight, this.container);
            this.blockArray.push(tempBlock);
        }
    }
    
    addToContainer() {
        if (!this.container.parentNode) {
            this.parentContainer.appendChild(this.container);
        }
    }
    
    removeFromContainer() {
        window.removeEventListener("resize", this.resize);
        if (this.container.parentNode) {
            this.parentContainer.removeChild(this.container);
        }
    }
    
    updateProgressBar(_progress) {
        this.currentProgressPercent = _progress;
        var activeBlocksCount = Math.floor(this.blockArray.length * (this.currentProgressPercent / 100));
    
        this.updateActiveBlocksCount(activeBlocksCount);
    }
    
    updateActiveBlocksCount(_activeBlocksCount) {
        for (var i = 0; i < this.blockArray.length; i++) {
            if (i < _activeBlocksCount) {
                this.blockArray[i].setActive();
            }
            else {
                this.blockArray[i].setInactive();
            }
        }
    }
    
    setXYPos(_left, _top) {
        this.container.style.left = _left + "px";
        this.container.style.top = _top + "px";
    }
    
    toggleVisibility(_visible) {
        if (_visible) {
            this.addToContainer();
            this.ACTIVE = true;
        }
        else {
            this.removeFromContainer();
            this.ACTIVE = false;
        }
    }
    
    getWidth() {
        return this.horizontalBlocksCount * (this.blockWidth + this.gap);
    }
    
    getHeight() {
        return this.verticalBlocksCount * (this.blockHeight + this.gap);
    }
}