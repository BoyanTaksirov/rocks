const ProgressBarBlock = require("./ProgressBarBlock");

module.exports = class ProgressBarBlock {
    constructor(_left, _top, _width, _height, _parentContainer){
        this.parentContainer = _parentContainer;

        this.block = document.createElement("div");
        this.block.className = "progressBarBT_Block_Inactive_CCSS";

        this.setPosXY(_left, _top);
        this.resize(_width, _height);

        this.addToContainer();
    }

    setActive () {
        this.block.className = "progressBarBT_Block_Active_CCSS";
    }
    
    setInactive() {
        this.block.className = "progressBarBT_Block_Inactive_CCSS";
    }
    
    addToContainer() {
        this.parentContainer.appendChild(this.block);
    }
    
    setPosXY(_left, _top) {
        this.block.style.left = _left + "px";
        this.block.style.top = _top + "px";
    }
    
    resize(_width, _height) {
        this.block.style.width = _width + "px";
        this.block.style.height = _height + "px";
    }
}


