import { cache, system, physics, playMusic, playSFX } from "../App";
export class CrazyCatLady extends createjs.Container
{
	constructor()
	{
		super();
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.tweenGroup = new cjs.TweenGroup();
		this.catLadyCont = new cjs.Container();
		this.leftArmCont = new cjs.Container();
		this.y = this.halfHeight - 248;
		this.x = 280;
		this.setupSprites();
		this.ladyAttack = false;
		this.catSoundNum = 0;
		this.name = 'catlady';
		this.animationChangeTimer = 0;
		this.animationChangeNum = 1;
		this.catGrabNum = 0;
		this.catAttackArray = [];
	}
	setupSprites()
	{
		this.catLady = new cjs.Sprite(cache.get('gameSS'), 'crazy-cat-lady-1').center();
		this.catLady.scaleX = this.catLady.scaleY = 0.9;

		this.catLadyCont.addChild(this.catLady);
		this.addChild(this.catLadyCont);
		this.addSpriteCats();
		this.rightArm = new cjs.Sprite(cache.get('gameSS'), 'right-arm').set({ x: -24, y: -18, scaleX: 0.9, scaleY: 0.9 }).center();
		this.catLadyCont.addChildAt(this.rightArm, 0);
		this.leftArm = new cjs.Sprite(cache.get('gameSS'), 'left-arm').set({ scaleX: 0.9, scaleY: 0.9 });
		this.frontWheel = new cjs.Sprite(cache.get('gameSS'), 'front-wheel').set({ x: -49, y: 119, scaleX: 0.9, scaleY: 0.9 }).center();
		this.backWheel = new cjs.Sprite(cache.get('gameSS'), 'back-wheel').set({ x: 62, y: 102, scaleX: 0.9, scaleY: 0.9 }).center();
		this.leftArmCont.addChild(this.leftArm);
		this.leftArmCont.set({ x: 44, y: -41, regX: 5, regY: 5 });
		this.catLadyCont.addChild(this.leftArmCont, this.frontWheel, this.backWheel);
		this.catLadyCont.x = 500;
		this.tweenGroup.get(this.frontWheel, { loop: true }).to({ rotation: 360 }, 1000);
		this.tweenGroup.get(this.backWheel, { loop: true }).to({ rotation: 360 }, 1000);
		this.tweenGroup.get(this.catLadyCont).to({x:-50}, 2000).call(this.tweenCatLady, null, this);
		this.startCatGrab();
	}

	tweenCatLady()
	{
		this.tweenGroup.get(this.catLadyCont, { loop: true })
			.to({ x: -50 }, 3000, cjs.Ease.quadInOut)
			.to({ x: 30 }, 3000, cjs.Ease.quadInOut)
			.to({ x: -30 }, 3000, cjs.Ease.quadInOut)
			.to({ x: 50 }, 4000, cjs.Ease.quadInOut)
			.to({ x: -10 }, 3000, cjs.Ease.quadInOut)
			.to({ x: -50 }, 3000, cjs.Ease.quadInOut)
			.to({ x: 20 }, 3000, cjs.Ease.quadInOut)
			.to({ x: 0 }, 3000, cjs.Ease.quadInOut);
	}

	catLadyAnimationChange()
	{
		if (this.animationChangeNum === 0) {
			this.catLady.gotoAndPlay('crazy-cat-lady-2');
			this.animationChangeNum = 1;
		} else {
			this.catLady.gotoAndPlay('crazy-cat-lady-1');
			this.animationChangeNum = 0;
		}
	}

	catladyBlink()
	{
		if (this.ladyAttack) { return; }
		this.catLady.gotoAndPlay('crazy-cat-lady-3');
		this.tweenGroup.get(this).wait(250).call(this.catLadyAnimationChange, null, this);
	}

	addSpriteCats()
	{
		let catSprites = ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6'];
		let position = [{ x: -104, y: 20 }, { x: -129, y: -5 }, { x: 99, y: 53 }, { x: 116, y: 21 }, { x: -102, y: -2 }, { x: -116, y: 21 }, { x: 98, y: 38 }, { x: 102, y: 44 }, { x: -107, y: 12 }, { x: -116, y: -15 }, { x: 131, y: 15 }, { x: 106, y: 18 }, { x: -27, y: -22 }, { x: -5, y: -37 }, { x: -23, y: -38 }, { x: -38, y: -43 }, { x: -42, y: -68 }];
		for (let i = 0, l = 17; i < l; i++) {
			let num = i;
			let scaleX = 1;
			if (i > 5 && i < 11) {
				num -= 6;
				scaleX = -1;
			}
			if (i > 10) {
				num -= 11;
				scaleX = 1;
			}
			let cat = new cjs.Sprite(cache.get('gameSS'), catSprites[num]).set({ name: 'cat' + (num + 1), x: position[i].x, y: position[i].y, scaleX: scaleX }).center();

			this.catLadyCont.addChildAt(cat, 0);
		}
	}

	startCatGrab()
	{
		this.tweenGroup.get(this.leftArmCont, { loop: true })
			.to({ rotation: -45 }, 500, cjs.Ease.quadInOut)
			.call(this.grabCat, null, this)
			.to({ rotation: 0 }, 500, cjs.Ease.quadInOut)
			.call(this.ladyAttack, null, this)
			.to({ rotation: -45 }, 250, cjs.Ease.quadInOut)
			.wait(500)
			.to({ rotation: 45 }, 125)
			.call(this.rollCat, null, this)
			.to({ rotation: 135 }, 125, cjs.Ease.quadOut)
			.call(this.setLadyBack, null, this)
			.to({ rotation: 0 }, 500, cjs.Ease.quadInOut);
	}

	setLadyBack()
	{
		this.ladyAttack = false;
		this.catladyBlink();
	}

	ladyAttack()
	{
		this.ladyAttack = true;
		this.catLady.gotoAndPlay('crazy-cat-lady-attack');
	}

	grabCat()
	{

		let catSprites = ['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6'];
		let cat = new cjs.Sprite(cache.get('gameSS'), catSprites[this.catGrabNum]).set({ name: 'cat' + (this.catGrabNum), x: 20, y: 63 }).center();

		this.leftArmCont.addChildAt(cat, 0);

	}

	rollCat()
	{
		let catSprites = ['cat-1-roll', 'cat-2-roll', 'cat-3-roll', 'cat-4-roll', 'cat-5-roll', 'cat-6-roll'];
		let childCat = this.leftArmCont.getChildAt(0);
		let pointCat = childCat.localToLocal(this.x, this.y, childCat);

		let cat = new cjs.Sprite(cache.get('gameSS'), catSprites[this.catGrabNum]).set({ name: 'cat-roll' + (this.catGrabNum), attackName: 'cat-attack-' + (this.catGrabNum + 1) + '-1', x: pointCat.x - this.x, y: pointCat.y - this.y }).center();
		this.addChild(cat);
		this.tweenGroup.get(cat).to({ x: cat.x - 100, y: pointCat.y - this.y + 110 }, 150).to({ x: 50 - this.x, rotation: -360 }, 250).call(this.spawnAttackCat, [cat], this);
		this.catGrabNum++;
		if (this.catGrabNum > 5) {
			this.catGrabNum = 0;
		}
		this.leftArmCont.removeChildAt(0);

	}

	spawnAttackCat(cat)
	{
		let catAttack = new cjs.Sprite(cache.get('gameSS'), cat.attackName).set({ name: 'cat' + (this.catGrabNum), x: cat.x, y: cat.y }).center();
		let yPos = Math.range((this.halfHeight - 448) - this.y, (this.halfHeight - 148) - this.y);
		this.addChild(catAttack);
		this.removeChild(cat);
		this.tweenGroup.get(catAttack).to({ x:-100-this.x, y: yPos, rotation:-360 }, 300);
		let catSoundArray = ['cat-attack', 'cat-attack-1', 'cat-attack-2'];

		playSFX(catSoundArray[this.catSoundNum]);
		this.catSoundNum++;
		if(this.catSoundNum >2){
			this.catSoundNum = 0;
		}
		this.catAttackArray.push(catAttack);
	}

	checkCollision(tp)
	{
		let diffX = tp.x+this.x;
		let diffY = tp.y+this.y;

		let player = this.parent.player.displayObject;
		if (diffX > player.x - 50 && diffX < player.x + 50 && diffY < player.y + 60 && diffY > player.y - 60) {

			this.parent.player.playerDied = true;
		}

	}

	gameOver()
	{
		this.tweenGroup.paused = true;
		for (var i = 0, l = this.catAttackArray.length; i < l; i++) {
			var tp = this.catAttackArray[i];
			tp.visible = false;
		}

	}

	update(e, speed)
	{
		for (var i = 0, l = this.catAttackArray.length; i < l; i++) {
			var tp = this.catAttackArray[i];
			tp.x -= (speed+100) * e;
			this.checkCollision(tp);
		}
		this.animationChangeTimer++;
		if (this.animationChangeTimer > 150) {
			this.catladyBlink();
			this.animationChangeTimer = Math.range(-30, 0);
		}
	}

	kill()
	{

	}

}
