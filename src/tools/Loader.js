import { cache, stageController, system, assetLoader } from "../App";


class Loader extends cjs.Container {
	constructor()
	{
		super();
		this.visible = false;
	}

	build()
	{
		this.halfWidth = system.width/2;
		this.halfHeight = system.height/2;
		let background = this.getShape(system.width, system.height,-this.halfWidth, -this.halfHeight);
		this.pixelText = new createjs.Text("", '80px pixel_maz', "#FFFFFF");
		this.pixelText.textAlign = 'center';
		this.pixelText.text = "gettin ready to drop a load....";
		this.pixelText.x = 0;
		this.pixelText.y = -250;

		var r = new cjs.Graphics();
		r.setStrokeStyle(5);
		r.beginStroke(cjs.Graphics.getRGB(255, 0, 0));
		r.drawRect(0, 0, 300, 50);

		this.loadBox = new cjs.Shape(r);
		this.loadBox.x = 0;
		this.loadBox.y = 100;
		this.loadBox.regX = 150;
		this.loadBox.regY = 150;

		var l = new cjs.Graphics();
		l.beginFill(cjs.Graphics.getRGB(255, 255, 0));
		l.drawRect(0, 0, 300, 50);

		this.loadBar = new cjs.Shape(l);
		this.loadBar.x = -149;
		this.loadBar.y = 100;
		this.loadBar.regX = 0;
		this.loadBar.regY = 150;


		this.addChild(
			background,
			this.pixelText,
			this.loadBar,
			this.loadBox

		);

	}

	getShape(w,h,xPos, yPos)
	{
		let sg = new cjs.Graphics();
		sg.f("#83a5db").r(0, 0, w, h);
		let ss = new cjs.Shape(sg);
		ss.x = xPos;
		ss.y = yPos;
		return ss;
	}

	loadGame(manifest){
		this.visible = true;
		assetLoader.load(manifest);
		assetLoader.on("progress", this.progressBar.bind(this));
		assetLoader.on("complete", () => {
			this.animateOut();
		});
	}

	animateOut() {
		cjs.Tween.get(this.pixelText).to({
			x: 1000
		}, 500, cjs.Ease.backIn);

		cjs.Tween.get(this.loadBar).wait(500).to({
			y: 800
		}, 500, cjs.Ease.backIn);
		cjs.Tween.get(this.loadBox).wait(500).to({
			y: 800
		}, 500, cjs.Ease.backIn).call(this.sendToScene, null, this);

	}


	sendToScene()
	{
		this.removeAllChildren();
		stageController.gotoScene('Title', true);
	}

	updateFill(e)
	{
		this.loadBar.scaleX = e.progress;
	}

	progressBar(e)
	{
		this.updateFill(e);
	}
}

export default Loader;
