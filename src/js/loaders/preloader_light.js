function PreloaderLight(parentContainer, animationPath)
{
    this.parentContainer = parentContainer;
    this.animationPath = animationPath;

    this.container = document.createElement("div");
    this.container.className = "preloaderLightBkg";

    this.animContainer = document.createElement("div");
    this.animContainer.className = "preloaderLightAnim";
    this.container.appendChild(this.animContainer);
    this.initLottieAnimation();

}

PreloaderLight.prototype.initLottieAnimation = function ()
{
    if (this.animationPath)
    {
        this.preloaderAnimation = lottie.loadAnimation({
            container: this.animContainer,
            renderer: "svg",
            loop: true,
            //autoplay: true,
            path: this.animationPath
        });
    }
}

PreloaderLight.prototype.addToContainer = function ()
{
    if (!this.container.parentNode)
    {
        this.parentContainer.appendChild(this.container);
        this.preloaderAnimation.play();
    }
}

PreloaderLight.prototype.removeFromContainer = function ()
{
    if (this.container.parentElement)
    {
        this.parentContainer.removeChild(this.container);
    }
}

PreloaderLight.prototype.removePreloader = function ()
{
    this.removeFromContainer();
    this.preloaderAnimation.stop();
}
