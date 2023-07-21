import { cache, system, playSFX } from "../App";
export class OutHouseObstacles extends createjs.Container
{
	constructor()
	{
		super();
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.rowPusher = [];
		this.hardMode = false;
		this.died = false;
		this.outHouseEnemies = [
			[0,'x',0,'x',0, 'x'],
			['x',0,'x',0,'x', 0],
			[0,'x','x','x',0, 'x'],
			[0,'x','t','x',0, 'x'],
			['x','x','t','x','x', 'x'],
			['x','x','x',0,0,0],
			[0,0,'x','x','x', 0],
			['t',0,'x','t','x', 0],
			['x',0,'x','t','x', 0],
			['x','t','x',0,'x', 'x']
		];
		this.rowNum = 0;
		this.speed = -6.65;
		this.leftOverNum = 0;
		this.tweenGroup = new cjs.TweenGroup();
	}

	callObstacleRow()
	{
		let yPos = [-450, -250, 0, 250, 450, 730];
		let row = this.outHouseEnemies[this.rowNum];
		this.rowNum++;
		if(this.rowNum > this.outHouseEnemies.length-1){
			this.rowNum = 0;
			if(!this.hardMode){
				this.outHouseEnemies.shuffle();
			}
		}
		for (let i = 0, l = row.length; i < l; i++) {
			let o = row[i];

			if(o === 'x'){
				let bird = new cjs.Sprite(cache.get('animationsSS'), 'bird').set({ name:'bird', framerate: 12, x: this.halfWidth+300, y: yPos[i] }).center();
				this.addChild(bird);
				bird.stop();
				cjs.Tween.get(bird).wait(Math.range(0,250)).call(bird.play, null, bird);
				bird.canMove = true;
				this.rowPusher.push(bird);
			}
			if(o === 't'){
				let toiletPaper = new cjs.Sprite(cache.get('gameSS'), 'toilet-paper').set({name: 'toiletpaper', x:this.halfWidth + 300, y: yPos[i]}).center();
				this.tweenGroup.get(toiletPaper, {loop:true})
				.to({y:toiletPaper.y-30}, 500, cjs.Ease.quadInOut)
				.to({y:toiletPaper.y}, 500, cjs.Ease.quadInOut);
				toiletPaper.canMove = true;
				this.addChild(toiletPaper);
				this.rowPusher.push(toiletPaper);
			}
		}
	}

	triggerHardMode()
	{
		this.outHouseEnemies = [
			['x','x',0,'x','x','x'],
			['x','x','x',0,'x','x'],
			['x','x','x','x',0,'x'],
			['x','x','x','t','x','x'],
			['x','x',0,'x','x','x'],
			['x',0,'x','x','x','x'],
			[0,'x','x','x','x','x'],
			['x','t','x','x','x','x'],
			['x','x','t','x','x','x'],
			['x','x','x',0,'x','x'],
			['x','x','x','x',0,'x'],
			['x','x','x',0,'x','x'],
			['x','x',0,'x','x','x'],
			['x','t','x','x','x','x'],
			['x','x',0,'x','x','x'],
			['x',0,'x','x','x','x'],
			['x','x',0,'x','x','x'],
			['x','x','x','t','x','x'],
			['x','x',0,'x','x','x'],
			['x','x','x',0,'x','x'],
			['x','x','x','x',0,'x'],
			['x','x','x',0,'x','x'],
			['x','x','x','x','t','x'],
			['x','x','x',0,'x','x'],
			['x','x',0,'x','x','x'],
			['x','t','x','x','x','x']
		];
		this.hardMode = true;
	}

	checkCollision(tp)
	{
		let player = this.parent.sprite;
		if(tp.name === 'toiletpaper'){
			if(tp.alpha === 1 && tp.x > player.x-50 && tp.x < player.x+50 && tp.y < player.y + 100 && tp.y > player.y -100){
				tp.canMove = false;
				this.tweenGroup.get(tp, {override:true})
				.to({scaleX:1.1, scaleY:1.1, rotation: 90}, 50)
				.to({scaleX:1, scaleY:1, rotation: 180}, 50)
				.to({y:tp.y-50, alpha:0, rotation: 450}, 150)
				.call(this.parent.parent.addToTPScore, null, this.parent.parent)
				.set({canMove:true});
				playSFX('coin');
			}
		}

		if(tp.name === 'bird'){
			if(tp.alpha === 1 && tp.x > player.x-50 && tp.x < player.x+50 && tp.y < player.y + 100 && tp.y > player.y -100){
				this.outHouseDie();
			}
		}
	}

	outHouseDie()
	{
		this.parent.outHouseDie();
		this.died = true;
	}

	update(e, speed)
	{
		if(this.died){
			return;
		}
		for (var i = 0, l = this.rowPusher.length; i < l; i++) {
			let o = this.rowPusher[i];
			if (o && o.canMove) {
				o.x -= speed * e;
				this.checkCollision(o);
			}
			if (o && o.x < -this.halfWidth - o.regX - 100) {
				o.x = this.halfWidth + 200;
				o.canMove = false;
				this.removeChild(o);
				this.rowPusher.splice(i,1);
			}
		}
	}



	kill()
	{

	}


}
