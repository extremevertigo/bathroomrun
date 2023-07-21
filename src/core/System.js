class System
{
    constructor(container, canvas, options = {})
    {
        this.paused = false;
        this.container = document.getElementById(container);
        this.canvas = document.getElementById(canvas);
        this.width = options.maxWidth || 768;
        this.height = options.maxHeight || 1664;
        this.safeWidth = options.safeWidth || 768;
        this.safeHeight = options.safeHeight || 1024;
        this.maxWidth = options.maxWidth || 768;
        this.maxHeight = options.maxHeight || 1664;
        this.stage = new createjs.Stage(canvas);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.maxDelta = 40;
        createjs.Ticker.on('tick', this.update.bind(this));

        window.addEventListener('resize', this.resize.bind(this));
    }

    resize()
    {
        let wWidth = window.innerWidth;
        let wHeight = window.innerHeight;

        let wrapper = this.container;
        wrapper.style.maxWidth = "";
        wrapper.style.maxHeight = "";
        wrapper.style.margin = "0 auto";
        wrapper.style.marginTop = "";
        let widthScale = wWidth / this.safeWidth;
        let heightScale = wHeight / this.safeHeight;

        let scale = 1;
        let canvasWidth = this.safeWidth;
        let canvasHeight = this.safeHeight;

        if (widthScale > heightScale) {
            scale = heightScale;
            if (wWidth > this.maxWidth * heightScale) {
                canvasWidth = this.maxWidth;
            } else if (wWidth < this.safeWidth * heightScale) {
                canvasWidth = this.safeWidth;
            }
        } else {
            scale = widthScale;
            if (wHeight > this.maxHeight * widthScale) {
                canvasHeight = this.maxHeight;
            } else if (wHeight < this.safeHeight * widthScale) {
                canvasHeight = this.safeHeight;
            } else {
                canvasHeight = wHeight / widthScale;
            }
        }
        scale = widthScale > heightScale ? wHeight / canvasHeight : wWidth / canvasWidth;
        this.container.style.width = Math.floor(canvasWidth * scale) + "px";
        this.container.style.height = Math.floor(canvasHeight * scale) + "px";
        this.width = this.canvas.width = Math.floor(canvasWidth);
        this.height = this.canvas.height = Math.floor(canvasHeight);
        this.resizeChildren(this.stage, this.width, this.height);
    }
    resizeChildren(parent, width, height)
    {
        if (parent.children) {
            for (let i = parent.children.length - 1; i >= 0; i--) {
                this.resizeChildren(parent.children[i], width, height);
            }
        }
        if (parent.resize) {
            parent.resize(width, height);
        }
    }

    setPaused(bool)
    {
        this.paused = bool;
        createjs.Ticker.paused = bool;
    }
    update(event)
    {
        if (!this.paused) {
            this.tick = event.delta * 0.001;
            this.stage.update(event);
        }
    }
}

export default System;