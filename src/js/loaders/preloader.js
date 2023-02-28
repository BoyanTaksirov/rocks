function ProgressBar(parentContainer)
{
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

ProgressBar.prototype.updateProgressBar = function (progress)
{
    this.innerDiv.style.width = progress + "%";
}

function Preloader(parentContainer, animationPath, onClickedCallback)
{
    this.parentContainer = parentContainer;
    this.animationPath = animationPath;
    this.onClickedCallback = onClickedCallback;

    this.updatePreloader = this.updatePreloader.bind(this);

    this.container = document.createElement("div");
    this.container.className = "preloaderBkg";

    this.animContainer = document.createElement("div");
    this.animContainer.className = "preloaderAnim";
    this.container.appendChild(this.animContainer);

    this.container.addEventListener("click", this.onClicked.bind(this));

    this.label = document.createElement("div");
    this.label.className = "preloaderLabel";

    this.container.appendChild(this.label);

    this.progressBar = new ProgressBar(this.container);

    this.startAnimation();

    this.updatePreloader(0);
}

Preloader.prototype.setZIndex = function(zIndex)
{
    this.container.style.zIndex = zIndex;
}

Preloader.prototype.updatePreloader = function (progress)
{
    var progresRounded = Math.round(progress);
    this.label.innerText = progresRounded + "%";
    this.progressBar.updateProgressBar(progress);
}

Preloader.prototype.onClicked = function (e)
{
    if (this.onClickedCallback)
    {
        this.onClickedCallback();
    }
}

Preloader.prototype.startAnimation = function ()
{
    if (this.animationPath)
    {
        this.preloaderAnimation = lottie.loadAnimation({
            container: this.animContainer,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: this.animationPath
        });
    }
}

Preloader.prototype.addToContainer = function ()
{
    if(!this.container.parentNode)
    {
        this.parentContainer.appendChild(this.container);
    }
}

Preloader.prototype.removeFromContainer = function()
{
    this.parentContainer.removeChild(this.container);
}

Preloader.prototype.resetPreloader = function()
{
    this.label.innerText = 0 + "%";
    this.progressBar.updateProgressBar(0);

}

Preloader.prototype.removePreloader = function ()
{
    this.removeFromContainer();
    this.preloaderAnimation.stop();
    this.container.removeEventListener("click", this.onClicked);
}
