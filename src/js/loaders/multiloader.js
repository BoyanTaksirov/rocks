module.exports = class Multiloader {
    constructor(onLoadedCallback, onProgressCallback) {
        if (onLoadedCallback) {
            this.onLoadedCallback = onLoadedCallback;
        }

        if (onProgressCallback) {
            this.onProgressCallback = onProgressCallback;
        }

        this.loaderProgress = this.loaderProgress.bind(this);
        this.proceedLoadedResource = this.proceedLoadedResource.bind(this);

        this.resourcesLoaded = 0;
        this.loaders = [];
        this.responseArray = [];
    }

    setCallbacks(onLoadedCallback, onProgressCallback) {
        if (onLoadedCallback) {
            this.onLoadedCallback = onLoadedCallback;
        }
    
        if (onProgressCallback) {
            this.onProgressCallback = onProgressCallback;
        }
    }
    
    setData(data) {
        this.data = data;
        this.resourcesLoaded = 0;
    }
    
    startLoading() {
        this.loaders = [];
        this.responseArray = [];
    
        for (var i = 0; i < this.data.length; i++) {
            var xmlHttp = this.getXmlHttpRequest();
    
            //console.log("TYPE: " + typeof this.data[i]);
            if (typeof this.data[i] === "string") {
                xmlHttp.path = this.data[i];
                xmlHttp.name = this.data[i];
            }
            else if (this.data[i].path) {
                xmlHttp.path = this.data[i].path;
                xmlHttp.name = this.data[i].name;
                if (this.data[i].customData) {
                    xmlHttp.customData = this.data[i].customData;
                }
            }
            else {
                continue;
            }
    
            xmlHttp.index = this.loaders.length;
            xmlHttp.currentProgress = 0;
    
            xmlHttp.open('GET', xmlHttp.path, true);
            var responseType = "arraybuffer";
            var extension = xmlHttp.path.substr(xmlHttp.path.length - 3, 3);
    
            switch (extension) {
                case "txt":
                    responseType = "text";
                    break;
    
                case "son":
                    responseType = "text";
                    break;
    
                case "csv":
                    responseType = "text";
                    break;
            }
    
            xmlHttp.responseType = responseType;
    
            xmlHttp.addEventListener("progress", this.loaderProgress);
            xmlHttp.addEventListener("load", this.proceedLoadedResource);
    
            this.loaders.push(xmlHttp);
        }
    
        for (var l = 0; l < this.loaders.length; l++) {
            this.loaders[l].send();
        }
    }
    
    loaderProgress(e) {
        if (!e.lengthComputable) {
            return;
        }
    
        e.currentTarget.currentProgress = e.loaded / e.total;
        var loadingProgress = 0;
        for (var i = 0; i < this.loaders.length; i++) {
            loadingProgress += this.loaders[i].currentProgress * 100;
        }
        loadingProgress /= this.loaders.length;
    
        if (this.onProgressCallback) {
            this.onProgressCallback(loadingProgress);
        }
    }
    
    proceedLoadedResource(e) {
        var blob = new Blob([e.currentTarget.response]);
        var blobLink = window.URL.createObjectURL(blob);
    
        var responseObj = {
            objectURL: blobLink,
            objectBlob: blob,
            data: e.currentTarget.response,
            name: e.currentTarget.name,
            path: e.currentTarget.path,
            customData: e.currentTarget.customData,
        };
    
        this.responseArray.push(responseObj);
    
        this.resourcesLoaded++;
        if (this.resourcesLoaded >= this.loaders.length) {
            for (let i = 0; i < this.loaders.length; i++) {
                this.loaders[i].removeEventListener("progress", this.loaderProgress);
                this.loaders[i].removeEventListener("load", this.proceedLoadedResource);
            }
            this.loaders = null;
    
            this.onLoadedCallback(this.responseArray);
        }
    }
    
    getXmlHttpRequest() {
        var xmlHttp;
    
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    
        return (xmlHttp);
    }
    
    getResource(resourceName) {
        for (var i = 0; i < this.responseArray.length; i++) {
            if (this.responseArray[i].name == resourceName) {
                return this.responseArray[i];
            }
        }
    }
}

