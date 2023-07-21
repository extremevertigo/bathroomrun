import { cache, playSFX } from "../App";
export class Farts extends createjs.Container
{
	constructor()
	{
		super();
		this.fart1Played = false;
		this.fartsArray1 = [];
		this.fartsArray2 = [];
		this.fartEngineArray = [];
		this.finishFartArray = [];
		this.fartNum = 1;
		this.setupFarts();
		this.engineStop = false;
	}

	setupFarts()
	{
		for (let i = 0, l = 8; i < l; i++) {
			let num = i + 1;
			if (num > 4) {
				num -= 4;
			}
			let cloud = new cjs.Sprite(cache.get('gameSS'), 'fart-cloud-' + num).center();
			cloud.alpha = 0;
			cloud.scaleX = cloud.scaleY = 0;
			this.fartsArray1.push(cloud);
			this.addChild(cloud);
		}
		for (let i = 0, l = 8; i < l; i++) {
			let num = i + 1;
			if (num > 4) {
				num -= 4;
			}
			let cloud = new cjs.Sprite(cache.get('gameSS'), 'fart-cloud-' + num).center();
			cloud.alpha = 0;
			cloud.scaleX = cloud.scaleY = 0;
			this.fartsArray2.push(cloud);
			this.addChild(cloud);
		}
	}

	dieFart(xPos, yPos)
	{
		let fartNum = Math.floor(Math.range(1, 4));
		let cloud = new cjs.Sprite(cache.get('gameSS'), 'fart-cloud-' + fartNum).center();
		cloud.x = xPos;
		cloud.y = yPos;
		cloud.alpha = 1;
		cloud.scaleX = cloud.scaleY = 0;
		this.addChild(cloud);
		cjs.Tween.get(cloud).to({ scaleX: 1, scaleY: 1, alpha: 0 }, 250).call(this.removeChild, [cloud], this);
	}

	jumpFart(sprite)
	{
		let waitTime1 = 0;
		let waitTime2 = 0;
		if (!this.fart1Played) {
			this.fart1Played = true;
			for (let i = 0, l = this.fartsArray1.length; i < l; i++) {
				let fart = this.fartsArray1[i];
				fart.alpha = 1;
				cjs.Tween.get(fart).wait(waitTime1).call(this.callFart, [fart, sprite], this);
				waitTime1 += 50;
			}
			cjs.Tween.get(this).wait(waitTime1 + 500).set({ fart1Played: false });
		} else {
			for (let i = 0, l = this.fartsArray2.length; i < l; i++) {
				let fart = this.fartsArray2[i];
				fart.alpha = 1;
				cjs.Tween.get(fart).wait(waitTime2).call(this.callFart, [fart, sprite], this);
				waitTime2 += 50;
			}
		}

	}

	callFart(fart, sprite)
	{
		fart.x = sprite.x + 20;
		fart.y = sprite.y + 20;
		let xRan = Math.range(-100, -50);
		let yRan = Math.range(50, 100);
		let rotate = Math.range(180, 360);
		cjs.Tween.get(fart).to({ scaleX: 0.5, scaleY: 0.5, x: sprite.x + xRan, y: sprite.y + yRan, rotation: rotate, alpha: 0 }, 500).set({ x: 0, y: 0, scaleX: 0, scaleY: 0 });
	}

	rumbleFart(sprite)
	{
		playSFX('fart3');
		let waitTime = 50;
		for (var i = 0, l = this.fartsArray1.length; i < l; i++) {
			let yPos1 = Math.range(sprite.y - 50, sprite.y);
			let yPos2 = Math.range(sprite.y - 50, sprite.y);
			let xPos1 = Math.range(sprite.x - 150, sprite.x - 80);
			let xPos2 = Math.range(sprite.x - 150, sprite.x - 80);
			let randomRot1 = Math.range(0, 360);
			let randomRot2 = Math.range(0, 360);
			// let randSpeed1 = Math.range(500,750);
			// let randSpeed2 = Math.range(500,750);
			let fart1 = this.fartsArray1[i];
			let fart2 = this.fartsArray2[i];
			fart1.x = fart2.x = sprite.x - 40;
			fart1.y = fart2.y = sprite.y + 80;

			// cjs.Tween.get(fart1, {loop:true}).wait(waitTime).set({scaleX:0.6, scaleY:0.6, alpha:1}).to({y:yPos1, x:sprite.x-200, scaleX:0.2, scaleY:0.2, alpha:0, rotation:randomRot1}, 500, cjs.Ease.quadIn);
			// cjs.Tween.get(fart2, {loop:true}).wait(waitTime+200).set({scaleX:0.6, scaleY:0.6, alpha:1}).to({y:yPos2, x:sprite.x-200, scaleX:0.2, scaleY:0.2, alpha:0, rotation:randomRot2}, 500, cjs.Ease.quadIn);

			cjs.Tween.get(fart1).wait(waitTime).to({ scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 150).to({ y: yPos1, x: xPos1, scaleX: 0.1, scaleY: 0.1, alpha: 0.5, rotation: randomRot1 }, 250).to({ alpha: 0 }, 150);
			cjs.Tween.get(fart2).wait(waitTime + 25).to({ scaleX: 0.4, scaleY: 0.4, alpha: 1 }, 150).to({ y: yPos2, x: xPos2, scaleX: 0.1, scaleY: 0.1, alpha: 0.5, rotation: randomRot2 }, 250).to({ alpha: 0 }, 150);
			waitTime += 50;

		}
	}

	blastOff(sprite)
	{
		let waitTime = 50;
		for (var i = 0, l = this.fartsArray1.length; i < l; i++) {
			let yPos1 = Math.range(sprite.y + 100, sprite.y + 200);
			let yPos2 = Math.range(sprite.y + 100, sprite.y + 200);
			let xPos1 = Math.range(sprite.x - 200, sprite.x - 100);
			let xPos2 = Math.range(sprite.x - 200, sprite.x - 100);
			let randomRot1 = Math.range(0, 360);
			let randomRot2 = Math.range(0, 360);
			// let randSpeed1 = Math.range(500,750);
			// let randSpeed2 = Math.range(500,750);
			let fart1 = this.fartsArray1[i];
			let fart2 = this.fartsArray2[i];
			fart1.x = fart2.x = sprite.x - 70;
			fart1.y = fart2.y = sprite.y + 70;

			// cjs.Tween.get(fart1, {loop:true}).wait(waitTime).set({scaleX:0.6, scaleY:0.6, alpha:1}).to({y:yPos1, x:sprite.x-200, scaleX:0.2, scaleY:0.2, alpha:0, rotation:randomRot1}, 500, cjs.Ease.quadIn);
			// cjs.Tween.get(fart2, {loop:true}).wait(waitTime+200).set({scaleX:0.6, scaleY:0.6, alpha:1}).to({y:yPos2, x:sprite.x-200, scaleX:0.2, scaleY:0.2, alpha:0, rotation:randomRot2}, 500, cjs.Ease.quadIn);

			cjs.Tween.get(fart1, { loop: true }).wait(waitTime).to({ scaleX: 0.3, scaleY: 0.3, alpha: 1 }, 150).to({ y: yPos1, x: xPos1, scaleX: 0.1, scaleY: 0.1, alpha: 0.5, rotation: randomRot1 }, 250).to({ alpha: 0 }, 150);
			cjs.Tween.get(fart2, { loop: true }).wait(waitTime + 25).to({ scaleX: 0.3, scaleY: 0.3, alpha: 1 }, 150).to({ y: yPos2, x: xPos2, scaleX: 0.1, scaleY: 0.1, alpha: 0.5, rotation: randomRot2 }, 250).to({ alpha: 0 }, 150);
			waitTime += 50;

		}
	}

	stopBlast(sprite)
	{
		for (var i = 0, l = this.fartsArray1.length; i < l; i++) {
			let fart1 = this.fartsArray1[i];
			let fart2 = this.fartsArray2[i];
			fart1.x = fart2.x = sprite.x - 80;
			fart1.y = fart2.y = sprite.y + 80;

			cjs.Tween.get(fart1, { override: true }).to({ scaleX: 0, scaleY: 0, alpha: 0 }, 150);
			cjs.Tween.get(fart2, { override: true }).to({ scaleX: 0, scaleY: 0, alpha: 0 }, 150);

		}
	}

	blastFart(sprite)
	{
		playSFX('fart1');
		for (var i = 0, l = this.fartsArray1.length; i < l; i++) {
			let yPos1 = Math.range(sprite.y - 100, sprite.y);
			let yPos2 = Math.range(sprite.y - 100, sprite.y);
			let xPos1 = Math.range(sprite.x - 100, sprite.x - 50);
			let xPos2 = Math.range(sprite.x + 100, sprite.x + 50);
			let randomRot1 = Math.range(0, 360);
			let randomRot2 = Math.range(0, 360);
			let randSpeed1 = Math.range(150, 250);
			let randSpeed2 = Math.range(150, 250);
			let fart1 = this.fartsArray1[i];
			let fart2 = this.fartsArray2[i];
			fart1.x = fart2.x = sprite.x;
			fart1.y = fart2.y = sprite.y;

			cjs.Tween.get(fart1).to({ y: yPos1, x: xPos1, scaleX: 1, scaleY: 1, alpha: 1, rotation: randomRot1 }, randSpeed1, cjs.Ease.qaudOut).to({ alpha: 0 }, 150);
			cjs.Tween.get(fart2).to({ y: yPos2, x: xPos2, scaleX: 1, scaleY: 1, alpha: 1, rotation: randomRot2 }, randSpeed2, cjs.Ease.qaudOut).to({ alpha: 0 }, 150);

		}
	}

	addFart(sprite)
	{
		let fart = new cjs.Sprite(cache.get('gameSS'), 'fart-cloud-' + this.fartNum).center();
		this.fartNum++;
		if (this.fartNum > 4) {
			this.fartNum = 1;
		}
		let perc = 40/sprite.rotation;
		let yPosStart = 80 * perc;
		fart.x = sprite.x-80;
		fart.y = sprite.y+yPosStart;
		if(sprite.rotation<90){
			let diffNum = 90-45;
			let yPerc = diffNum/sprite.rotation;

			fart.yPos = Math.range(5 * yPerc, 10 * yPerc);
			fart.xPos = Math.range(-5 * (1 - yPerc), -10 * (1 - yPerc));
		} else {
			let diffNum = 90-45;
			let yPerc = diffNum/sprite.rotation;

			fart.yPos = Math.range(-5 * yPerc, -10 * yPerc);
			fart.xPos = Math.range(-5 * (1 - yPerc), -10 * (1 - yPerc));
		}

		fart.scaleX = 0.4;
		fart.scaleY = 0.4;
		fart.rotateNum = Math.range(-1, 1);
		this.fartEngineArray.push(fart);
		this.addChild(fart);
	}

	pushOldFart(fart){
		this.finishFartArray.push(fart);
	}

	oldFartEngine()
	{
		for (let i = 0, l = this.finishFartArray.length; i < l; i++) {
			let fartold = this.finishFartArray[i];
			if(fartold){
				fartold.x = fartold.x + fartold.xPos;
				fartold.y = fartold.y + fartold.yPos;
				fartold.rotation += fartold.rotateNum;
				if (fartold.scaleX > 0) {
					fartold.scaleX -= 0.01;
				}
				if(fartold.scaleY > 0){
					fartold.scaleY -= 0.01;
				}
			}
		}
	}

	fartEngine(e)
	{

		for (let i = 0, l = this.fartEngineArray.length; i < l; i++) {
			let fart = this.fartEngineArray[i];
			if(fart){
				fart.x = fart.x + fart.xPos;
				fart.y = fart.y + fart.yPos;
				fart.rotation += fart.rotateNum;
				if (fart.scaleX > 0) {
					fart.scaleX -= 0.01;
				}
				if(fart.scaleY > 0){
					fart.scaleY -= 0.01;
				} else {
					this.removeChild(fart);
					this.fartEngineArray.splice(i,1);
				}
			}

		}


	}

	getTickUsage()
	{
		return this._numLightsOn / 60;
	}
}
