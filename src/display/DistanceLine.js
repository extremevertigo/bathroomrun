import { cache, system } from "../App";
export class DistanceLine extends createjs.Container
{
    constructor()
    {
		super();

		this.name = 'distanceLine';
		this.dLine = new cjs.Sprite(cache.get('gameSS'), 'distance-line').set({x:10, y:system.height *-0.5+260}).center();
		this.pointer = new cjs.Sprite(cache.get('gameSS'), 'distance-pointer').set({x:-287, y:system.height * -0.5 + 320}).center();
		this.bonusGameText = new cjs.Text('BONUS GAME!', '50px pixel_maz', '#000000').set({x:226, y:system.height * -0.5 + 190});

		this.addChild(
			this.dLine,
			this.pointer,
			this.bonusGameText
		);
	}

	setupText(){
		if(this.parent.feetTraveled < 500){
			this.encourageText = new cjs.Text('DONT GIVE UP!', '60px pixel_maz', '#000000').set({textAlign:'center', lineWidth:200, x:0, y:this.parent.continueAdBtn.y-200});
		}
		if(this.parent.feetTraveled > 500 && this.parent.feetTraveled < 800){
			this.encourageText = new cjs.Text('GETTING CLOSE!', '60px pixel_maz', '#000000').set({textAlign:'center', lineWidth:200, x:0, y:this.parent.continueAdBtn.y-200});
		}
		if(this.parent.feetTraveled > 800){
			this.encourageText = new cjs.Text('ALMOST THERE!', '60px pixel_maz', '#000000').set({textAlign:'center', lineWidth:200, x:0, y:this.parent.continueAdBtn.y-200});
		}
		this.arrow = new cjs.Sprite(cache.get('gameSS'), 'arrow').set({scaleY:0.5, x:280, y:this.parent.continueAdBtn.y, scaleX:-0.5}).center();
		this.addChild(this.arrow, this.encourageText);
		cjs.Tween.get(this.arrow, {loop:true}).to({x:240}, 300).to({x:280}, 300, cjs.Ease.quadOut);
		cjs.Tween.get(this.encourageText, {loop:true}).to({scaleX:1.1, scaleY:1.1}, 300).to({scaleX:1, scaleY:1}, 300, cjs.Ease.quadOut);


	}

	adjustPointer()
	{
		let perc = this.parent.feetTraveled / 1000;
		let amount = 595 * perc;
		if(amount > 595){
			amount = 595;
		}
		cjs.Tween.get(this.pointer).to({x:-287+amount}, 1000, cjs.Ease.quadOut).call(this.setupText, null, this);
	}

	sendAway(){
		cjs.Tween.get(this).to({y:-system.height*0.5-300}, 500, cjs.Ease.backOut).call(this.setPoint, null, this);
		this.removeChild(this.arrow);
		this.removeChild(this.encourageText);
	}

	setPoint(){
		this.pointer.x = -287;
	}
//-287,308
	_tick(e)
	{
		super._tick(e);

	}
}
