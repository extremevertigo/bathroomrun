import { cache, system, physics, playMusic, playSFX } from "../App";
export class ToiletPaper extends createjs.Container
{
	constructor()
	{
		super();
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.tpArray = [];
		this.tweenGroup = new cjs.TweenGroup();
		this.setupSprites();
	}
	setupSprites()
	{
		for (var i = 0, l = 10; i < l; i++) {
			let toiletPaper = new cjs.Sprite(cache.get('gameSS'), 'toilet-paper').set({canMove:false, x:this.halfWidth + 200}).center();
			toiletPaper.regX = 60;
			this.addChild(toiletPaper);
			this.tpArray.push(toiletPaper);
		}
	}

	callToiletPaper()
	{

		this.tpArray.shuffle();
		let tp = this.tpArray[0];
		let yPos;
		if(this.parent.extraMode){
			yPos = [-400, -100, 200];
		} else {
			yPos = [this.halfHeight - 200, this.halfHeight - 450, this.halfHeight - 650];
		}


		yPos.shuffle();
		if (!tp.canMove) {
			tp.canMove = true;
			tp.y = yPos[0];
			tp.alpha = 1;
			tp.rotation = 0;
			tp.tween = this.tweenGroup.get(tp, {loop:true})
			.to({y:tp.y-30}, 500, cjs.Ease.quadInOut)
			.to({y:tp.y}, 500, cjs.Ease.quadInOut);
		} else {
			this.callToiletPaper();
		}

	}

	checkCollision(tp)
	{
		if (this.parent.enemy) {
			let enemyArray = this.parent.enemy.enemyGround;
			for (var i = 0, l = enemyArray.length; i < l; i++) {
				var enemy = enemyArray[i];
				let displayObject = enemy.displayObject;
				if (displayObject.name === 'tree' && enemy.canMove && tp.canMove && tp.x + tp.regX > displayObject.x - 150 && tp.x - tp.regX < displayObject.x) {

					tp.x += 300;

				}
			}
		}

		let player = this.parent.player.displayObject;
		if(tp.alpha === 1 && tp.x > player.x-50 && tp.x < player.x+50 && tp.y < player.y + 100 && tp.y > player.y -100){
			tp.canMove = false;
			this.tweenGroup.get(tp, {override:true})
			.to({scaleX:1.1, scaleY:1.1, rotation: 90}, 50)
			.to({scaleX:1, scaleY:1, rotation: 180}, 50)
			.to({y:tp.y-50, alpha:0, rotation: 450}, 150)
			.call(this.parent.addToTPScore, null, this.parent)
			.set({canMove:true});
			playSFX('coin');
		}

	}

	update(e, speed)
	{
		for (var i = 0, l = this.tpArray.length; i < l; i++) {
			var tp = this.tpArray[i];
			if (tp.canMove) {
				tp.x -= speed * e;
				this.checkCollision(tp);
			}
			if (tp.x < -this.halfWidth - tp.regX - 100) {
				tp.canMove = false;
				tp.x = this.halfWidth + 200;
			}
		}
	}

	moveUp()
	{
		for (let i = 0, l = this.tpArray.length; i < l; i++) {
			let p = this.tpArray[i];
			if(p.canMove){
				cjs.Tween.get(p).to({x:-500, y:this.halfHeight+600}, 1500);
			}
		}
	}


	kill()
	{

	}

}
