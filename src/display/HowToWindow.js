import { system, cache, playSFX } from "../App";

export class HowToWindow extends createjs.Container
{
	constructor()
	{
		super();
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.tutorial1Cont = new cjs.Container();
		this.tutorial2Cont = new cjs.Container();
		this.tutorial3Cont = new cjs.Container();
		this.tutorial4Cont = new cjs.Container();
		this.pointContainer = new cjs.Container();
		this.tutNum = 0;
		this.pointArray = [];

		this.tutorial1();
		this.tutorial2();
		this.tutorial3();
		this.tutorial4();
		this.setupPoints();
		this.setupArrows();
		this.backBtn = new cjs.Sprite(cache.get('gameSS'), 'back').set({ x: 0, y: this.halfHeight+300, name: 'backBtn' }).center();
		this.backBtn.on('mouseover', this.buttonHandler, this);
		this.backBtn.on('mouseout', this.buttonHandler, this);
		this.backBtn.on('click', this.backButtonHandle, this);
		this.addChild(this.tutorial1Cont, this.tutorial2Cont, this.tutorial3Cont, this.tutorial4Cont, this.pointContainer, this.backBtn);
	}

	setupArrows()
	{
		this.rightArrow = new cjs.Sprite(cache.get('gameSS'), 'arrow').set({ x: 700, y: 200, name: 'rightarrow' }).center();
		this.leftArrow = new cjs.Sprite(cache.get('gameSS'), 'arrow').set({ x: -700, y: 200, name: 'leftarrow', scaleX: -1 }).center();
		this.rightArrow.on('click', this.buttonHandler, this);
		this.rightArrow.on('mousedown', this.buttonHandler, this);
		this.rightArrow.on('mouseout', this.buttonHandler, this);
		this.leftArrow.on('click', this.buttonHandler, this);
		this.leftArrow.on('mousedown', this.buttonHandler, this);
		this.leftArrow.on('mouseout', this.buttonHandler, this);
		this.addChild(this.rightArrow, this.leftArrow);
	}

	backButtonHandle(e)
	{
		playSFX('buttonClick');
		e.target.mouseEnabled = false;
		cjs.Tween.get(e.target).to({scaleX:1, scaleY:1}, 200, cjs.Ease.quadOut).call(this.goBack, null, this).call(this.parent.start, null, this.parent);
	}

	goBack()
	{
		this.tutNum = 0;
		cjs.Tween.get(this.leftArrow).to({x:-700}, 250, cjs.Ease.quadIn);
		cjs.Tween.get(this.rightArrow).to({x:700}, 250, cjs.Ease.quadIn);
		cjs.Tween.get(this.pointContainer).to({y:this.halfHeight+300}, 250, cjs.Ease.quadIn).call(this.resetPoints, null, this);
		cjs.Tween.get(this.backBtn).to({y:this.halfHeight+300}, 250, cjs.Ease.quadIn);

		if(this.tutorial1Cont.x < 0){
			this.tutorial1Cont.x = 700;
		} else {
			cjs.Tween.get(this.tutorial1Cont).to({ x: 700 }, 500, cjs.Ease.quadOut);
		}
		if(this.tutorial2Cont.x < 0){
			this.tutorial2Cont.x = 700;
		} else {
			cjs.Tween.get(this.tutorial2Cont).to({ x: 700 }, 500, cjs.Ease.quadOut);
		}
		if(this.tutorial3Cont.x < 0){
			this.tutorial3Cont.x = 700;
		} else {
			cjs.Tween.get(this.tutorial3Cont).to({ x: 700 }, 500, cjs.Ease.quadOut);
		}

		cjs.Tween.get(this.text1).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.text2).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.text2a).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.text3).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.text4).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.tutorial4Cont).to({ x: 700 }, 500, cjs.Ease.quadOut);
	}

	resetPoints(){
		for (let i = 0, l = this.pointArray.length; i < l; i++) {
			let point = this.pointArray[i];
			if (i === this.tutNum) {
				point.gotoAndPlay('point-current');
			} else {
				point.gotoAndPlay('point');
			}
		}
	}

	buttonHandler(e)
	{
		if (e.type === 'mousedown') {
			e.target.gotoAndPlay('arrow-pressed');
		}
		if (e.type === 'mouseover') {
			cjs.Tween.get(e.target).to({scaleX:1.1, scaleY:1.1}, 200, cjs.Ease.quadOut);
		}
		if (e.type === 'click') {
			playSFX('buttonClick');
			e.target.gotoAndPlay('arrow');
			this.nextHandler(e.target);
		}
		if (e.type === 'mouseout') {
			if(e.target.name !== 'backBtn'){
				e.target.gotoAndPlay('arrow');
			}else{
				cjs.Tween.get(e.target).to({scaleX:1, scaleY:1}, 200, cjs.Ease.quadOut);
			}
		}
	}

	nextHandler(btn)
	{
		console.log(btn.name);
		if (btn.name === 'leftarrow') {
			this.tutNum--;
			if (this.tutNum < 0) {
				this.tutNum = 0;
			}
		}

		if (btn.name === 'rightarrow') {
			this.tutNum++;
			if (this.tutNum > 3) {
				this.tutNum = 3;
			}
		}

		for (let i = 0, l = this.pointArray.length; i < l; i++) {
			let point = this.pointArray[i];
			if (i === this.tutNum) {
				point.gotoAndPlay('point-current');
			} else {
				point.gotoAndPlay('point');
			}
		}
		this.setTutorialWindow(this.tutNum);
	}

	setTutorialWindow(num)
	{
		console.log(num);
		switch (num) {
			case 0:
				cjs.Tween.get(this.tutorial1Cont).to({ x: 0 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.tutorial2Cont).to({ x: 700 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.text1).wait(250).to({ y: -300 }, 250, cjs.Ease.backOut);
				cjs.Tween.get(this.text2).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
				cjs.Tween.get(this.text2a).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);

				break;
			case 1:
				cjs.Tween.get(this.tutorial1Cont).to({ x: -700 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.tutorial2Cont).to({ x: 0 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.tutorial3Cont).to({ x: 700 }, 500, cjs.Ease.quadOut);

				cjs.Tween.get(this.text2).wait(250).to({ y: -500 }, 250, cjs.Ease.quadOut);
				cjs.Tween.get(this.text2a).wait(250).to({ y: -450 }, 250, cjs.Ease.quadOut);

				cjs.Tween.get(this.text1).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
				cjs.Tween.get(this.text3).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
				break;
			case 2:
				cjs.Tween.get(this.tutorial2Cont).to({ x: -700 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.tutorial4Cont).to({ x: 700 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.tutorial3Cont).to({ x: 0 }, 500, cjs.Ease.quadOut);

				cjs.Tween.get(this.text2).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
				cjs.Tween.get(this.text2a).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
				cjs.Tween.get(this.text4).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
				cjs.Tween.get(this.text3).wait(250).to({ y: -300 }, 250, cjs.Ease.quadOut);
				break;
			case 3:
				cjs.Tween.get(this.tutorial3Cont).to({ x: -700 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.tutorial4Cont).to({ x: 0 }, 500, cjs.Ease.quadOut);
				cjs.Tween.get(this.text3).to({ y: -this.halfHeight - 300 }, 250, cjs.Ease.quadOut);
				cjs.Tween.get(this.text4).wait(250).to({ y: -300 }, 250, cjs.Ease.quadOut);
			break;
		}
	}

	setupPoints()
	{
		let xPos = [-150,-50, 50, 150];
		for (let i = 0, l = 4; i < l; i++) {
			let point;
			if (i === 0) {
				point = new cjs.Sprite(cache.get('gameSS'), 'point-current').set({ x: xPos[i], y: 14, regX: 25, regY: 25, name: 'point' });
			} else {
				point = new cjs.Sprite(cache.get('gameSS'), 'point').set({ x: xPos[i], y: 14, regX: 25, regY: 25, name: 'point' });
			}
			this.pointArray.push(point);
			this.pointContainer.addChild(point);
		}
		this.pointContainer.y = this.halfHeight + 300;
	}

	step1Text()
	{
		this.text1 = new cjs.Text('Watch out for obstacles!', '80px pixel_maz', '#fff').set({ x: 0, y: -this.halfHeight - 300, textAlign: 'center' });
		this.addChild(this.text1);

	}

	tutorial1()
	{
		this.enemyMailBox = new cjs.Sprite(cache.get('gameSS'), 'mail-box-enemy').set({ x: 72, y: 14, name: 'mailBoxEnemy' }).center();
		this.runner = new cjs.Sprite(cache.get('animationsSS'), 'heroRun').set({ framerate: 12, scaleX: 2, scaleY: 2, x: -168, y: -40 }).center();
		this.runner.stop();
		this.tutorial1Cont.addChild(this.enemyMailBox, this.runner);
		this.tutorial1Cont.x = 700;
		cjs.Tween.get(this).wait(1000).call(this.step1Text, null, this);
	}

	tutorial2()
	{
		this.enemyMailBox = new cjs.Sprite(cache.get('gameSS'), 'mail-box-enemy').set({ x: 0, y: 28, name: 'mailBoxEnemy' }).center();
		this.jumper = new cjs.Sprite(cache.get('animationsSS'), 'heroJump').set({ framerate: 12, scaleX: 2, scaleY: 2, x: -110, y: -231 }).center();
		this.jumper.stop();
		let fartCloud = new cjs.Sprite(cache.get('gameSS'), 'fart-cloud-4').set({ x: -90, y: -120, name: 'fart' }).center();
		this.tutorialHand = new cjs.Sprite(cache.get('gameSS'), 'hand').set({ x: 190, y: 120, name: 'hand', alpha: 1 }).center();
		this.tutorial2Cont.addChild(this.enemyMailBox, this.jumper, fartCloud, this.tutorialHand);

		cjs.Tween.get(this).wait(1000).call(this.step2Text, null, this);
		cjs.Tween.get(this.tutorialHand, { loop: true }).to({ scaleX: 0.9, scaleY: 0.9 }, 250).to({ scaleX: 1, scaleY: 1 }, 250);
		this.tutorial2Cont.x = 700;
	}

	tutorial3()
	{
		this.toiletPaper = new cjs.Sprite(cache.get('gameSS'), 'toilet-paper').set({ x: 0, y: -100, name: 'toiletPaper' }).center();
		this.tutorial3Cont.addChild(this.toiletPaper);
		this.tutorial3Cont.x = 700;
		cjs.Tween.get(this).wait(1000).call(this.step3Text, null, this);
	}
	tutorial4()
	{

		this.outhouse = new cjs.Sprite(cache.get('gameSS'), 'outhouse').set({ x: -100, y: -50, name: 'outhouse', rotation:45 }).center();
		this.catLady = new cjs.Sprite(cache.get('gameSS'), 'crazy-cat-lady-1').set({ x: 100, y: 50, name: 'catlady' }).center();
		this.leftArm = new cjs.Sprite(cache.get('gameSS'), 'left-arm').set({ x: 185, y: 35, name: 'left-arm', rotation:-25 }).center();

		let frontWheel = new cjs.Sprite(cache.get('gameSS'), 'front-wheel').set({ x: 40, y: 180, name: 'front-wheel', rotation:-25 }).center();
		let backWheel = new cjs.Sprite(cache.get('gameSS'), 'back-wheel').set({ x: 175, y: 170, name: 'back-wheel', rotation:-25 }).center();
		this.tutorial4Cont.addChild(this.outhouse, this.catLady, this.leftArm, frontWheel, backWheel);
		this.tutorial4Cont.x = 700;
		cjs.Tween.get(this).wait(1000).call(this.step4Text, null, this);
	}

	step4Text()
	{
		this.text4 = new cjs.Text('Get Past 1000 feet to play a bonus game!', '80px pixel_maz', '#fff').set({ x: 0, y: -this.halfHeight - 300, textAlign: 'center', lineWidth:500 });
		this.addChild(this.text4);
	}

	step3Text()
	{
		this.text3 = new cjs.Text('Collect TP to add to your score', '80px pixel_maz', '#fff').set({ x: 0, y: -this.halfHeight - 300, textAlign: 'center' });
		this.addChild(this.text3);
	}

	step2Text()
	{
		this.text2 = new cjs.Text('Tap to boost over obstacles', '80px pixel_maz', '#fff').set({ x: 0, y: -this.halfHeight - 300, textAlign: 'center' });
		this.text2a = new cjs.Text('Tap while in the air for an extra boost!', '80px pixel_maz', '#fff').set({ x: 0, y: -this.halfHeight - 300, lineWidth: 500, textAlign: 'center' });
		this.addChild(this.text2, this.text2a);

	}

	callHowTo()
	{
		this.setTutorialWindow(0);
		cjs.Tween.get(this.leftArrow).to({x:-300}, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.rightArrow).to({x:300}, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.pointContainer).to({y:200}, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.backBtn).to({y:400}, 250, cjs.Ease.quadOut);
		this.backBtn.mouseEnabled = true;
	}

	_tick(e)
	{
		super._tick(e);
	}
}
