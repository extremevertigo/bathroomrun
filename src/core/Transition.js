class Transition extends createjs.Shape
{
    constructor(maxWidth = 100, maxHeight = 100)
    {
        super();

        this.graphics.f('#83a5db').dr(-maxWidth / 2, -maxHeight / 2, maxWidth, maxHeight);
        this.name = 'transition';
        this.visible = false;
        this.alpha = 0;
    }
    animateIn()
    {
        this.visible = true;

        return new Promise((resolve) =>
        {
            createjs.Tween.get(this)
                .to({ alpha: 1 }, 500, createjs.Ease.cubicInOut)
                .call(resolve);
        });
    }
    animateOut()
    {
        return new Promise((resolve) =>
        {
            if (this.alpha > 0) {
                createjs.Tween.get(this)
                    .to({ alpha: 0 }, 500, createjs.Ease.cubicInOut)
                    .set({ visible: false })
                    .call(resolve);
            } else {
                resolve();
            }
        });
    }
}

export default Transition;