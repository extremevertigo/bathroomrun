import {cache, stageController, system, playSFX, setMusicVolume, setSFXVolume } from "../App";
import Scene from "../core/Scene";
import { HowToWindow } from "../display/HowToWindow";
import { LeaderBoard } from "../display/LeaderBoard";

class Title extends Scene {
	constructor()
	{
		super();
    }

    // Build the Game Scene
	build()
	{
        this.halfWidth = system.width/2;
		this.halfHeight = system.height/2;
		this.name = 'Title';
		this.bottomContainer = new cjs.Container();
		this.topContainer = new cjs.Container();
		this.bottomContainer.y = 1000;
		this.topContainer.y = -600;
		let backGround = this.getShape(system.width, system.height,-this.halfWidth, -this.halfHeight, "#83a5db");
		this.textBorder = this.getShape(700, 100, -355, -this.halfHeight+155, "#ff0000");
		this.textBg = this.getShape(680, 85, -345, -this.halfHeight+163, "#ffffff");
		this.text = new cjs.Text('BATHROOM RUN', '180px pixel_maz', '#fffd07').set({x:0, y:-this.halfHeight+200, textBaseline: 'middle', textAlign:'center'});
		this.textSS = new cjs.Text('BATHROOM RUN', '180px pixel_maz', '#000').set({x:2, scaleX:1, y:-this.halfHeight+205, textBaseline: 'middle', textAlign:'center'});
		let cloudBG = new cjs.Sprite(cache.get('gameSS'),'cloud-background').set({x:-368, y:this.halfHeight-600, scaleX:-2, scaleY:2}).center();
		let cityBG = new cjs.Sprite(cache.get('citySS'),'city-background_02').set({x:-120, y:this.halfHeight-600, scaleX:-1}).center();
		let grassBG = new cjs.Sprite(cache.get('citySS'),'grass-bg_01').set({x:0, y:this.halfHeight-348, scaleX:1.5, scaleY:1.5}).center();
		let floor = new cjs.Sprite(cache.get('gameSS'),'floor-1').set({x:0, y:this.halfHeight-80}).center();
		let runner = new cjs.Sprite(cache.get('animationsSS'), 'heroRun').set({framerate:12, scaleX:2, scaleY:2, x:-260, y:this.halfHeight-345}).center();
		let mailBox = new cjs.Sprite(cache.get('gameSS'),'mail-box-enemy').set({x:0, y:this.halfHeight-282, scaleX:1.5, scaleY:1.5}).center();

		this.bottomContainer.addChild(cloudBG, cityBG, grassBG, floor, runner, mailBox);
		this.cloud1 = new cjs.Sprite(cache.get('gameSS'),'cloud-1').set({x:800, y:floor.y-1070, scaleX:-1.5, scaleY:1.5}).center();
		this.cloud2 = new cjs.Sprite(cache.get('gameSS'),'cloud-3').set({x:-800, y:floor.y-970, scaleX:-1.5, scaleY:1.5}).center();
		this.startButton = new cjs.Sprite(cache.get('gameSS'),'start').set({x:0, y:-1500, name: 'startButton'}).center();
		this.startButton.on('mouseover', this.buttonHandler, this);
		this.startButton.on('mouseout', this.buttonHandler, this);
		this.startButton.on('click', this.buttonHandler, this);
		this.soundBtn = new cjs.Sprite(cache.get('gameSS'),'sound').set({x:250, name:'soundBtn', soundOn: true, y:-this.halfHeight+50, }).center();
		this.soundBtn.on('mouseover', this.buttonHandler, this);
		this.soundBtn.on('mouseout', this.buttonHandler, this);
		this.soundBtn.on('click', this.buttonHandler, this);
		this.topContainer.addChild(this.textBorder, this.textBg, this.textSS, this.text, this.soundBtn);
		this.howToPlay = new cjs.Sprite(cache.get('gameSS'),'how-to-play').set({x:0, y:1500, name: 'howToPlay'}).center();
		this.howToPlay.on('mouseover', this.buttonHandler, this);
		this.howToPlay.on('mouseout', this.buttonHandler, this);
		this.howToPlay.on('click', this.buttonHandler, this);
		this.howTo = new HowToWindow();
		this.leaderBoardBtn = new cjs.Sprite(cache.get('gameSS'),'rank').set({x:0, y:1500, name: 'leaderBoardBtn'}).center();
		this.leaderBoardBtn.on('mouseover', this.buttonHandler, this);
		this.leaderBoardBtn.on('mouseout', this.buttonHandler, this);
		this.leaderBoardBtn.on('click', this.buttonHandler, this);
		///FACEBOOK TESTING
		// var playerImage = new Image();
		// playerImage.crossOrigin = 'anonymous';
		// This function should be called after FBInstant.initializeAsync()
		// resolves.
		// playerImage.src = FBInstant.player.getPhoto();
		// var bitmap = new cjs.Bitmap(playerImage.src);
		// bitmap.set({regX:200, regY:200});
		// cjs.Tween.get(bitmap, {loop:true}).to({rotation:360}, 1000);

		///GET LEADERBOARD SCORES

		this.leaderBoardArray = [];
		this.playersCurrentBoard = null;
		// FBInstant.getLeaderboardAsync('how_long_you_held_it')
		// 	.then(leaderboard => leaderboard.getEntriesAsync(10, 0))
		// 	.then(entries =>
		// 	{
		// 		for (var i = 0; i < entries.length; i++) {
		// 			let rank = entries[i].getRank();
		// 			let name = entries[i].getPlayer().getName();
		// 			let score = entries[i].getScore();
		// 			let playerImage = new Image();
		// 			playerImage.crossOrigin = 'anonymous';
		// 			playerImage.src = entries[i].getPlayer().getPhoto();
		// 			let infoObect = { rank: rank, name: name, score: score, photo:playerImage};
		// 			this.leaderBoardArray.push(infoObect);
		// 		}
		// 	})
		//   .catch(error => console.error(error));

		//   FBInstant.getLeaderboardAsync('how_long_you_held_it')
		// 	.then(leaderboard => leaderboard.getPlayerEntryAsync())
		// 	.then(entry => {
		// 		let rank = entry.getRank();
		// 		let name = entry.getPlayer().getName();
		// 		let score = entry.getScore();
		// 		let playerImage = new Image();
		// 		playerImage.crossOrigin = 'anonymous';
		// 		playerImage.src = entry.getPlayer().getPhoto();
		// 		this.playersCurrentBoard = {rank: rank, name: name, score:score, photo:playerImage};
		// 		if(this.playersCurrentBoard.score === null || this.playersCurrentBoard.score === undefined){
		// 			cjs.Tween.get(this.howToPlay, {loop:true}).to({scaleX:1.1, scaleY:1.1}, 300).to({scaleX:1, scaleY:1}, 300, cjs.Ease.quadOut);
		// 		}
		// 	})
		// 	.catch(error => console.error(error));



			// this.soundBtn.visible =  this.startButton.visible = this.howToPlay.visible = this.leaderBoardBtn.visible = false;
		this.addChild(backGround, this.cloud1, this.cloud2, this.bottomContainer,  this.startButton, this.howToPlay, this.topContainer, this.howTo, this.leaderBoardBtn);
		cjs.Tween.get(this).wait(2000).call(this.addLeaderBoard, null, this);

		// this.howToPlay.visible = false;
		this.leaderBoardBtn.visible = false;
		// this.soundBtn.visible = false;

	}

	addLeaderBoard()
	{
		this.leaderBoard = new LeaderBoard(this.leaderBoardArray, this.playersCurrentBoard);
		this.addChild(this.leaderBoard);
		this.leaderBoard.y = 1500;
	}

	getShape(w,h,xPos, yPos, color)
	{
		let sg = new cjs.Graphics();
		sg.f(color).r(0, 0, w, h);
		let ss = new cjs.Shape(sg);
		ss.x = xPos;
		ss.y = yPos;
		return ss;
	}

	buttonHandler(e)
	{
		if(this.leaderBoard && this.leaderBoard.y === -100){return;}
		if(e.type === 'mouseover'){
			cjs.Tween.get(e.target).to({scaleX:1.1, scaleY:1.1}, 250, cjs.Ease.quadOut);
		}
		if(e.type === 'click'){
			playSFX('buttonClick');
			if(e.target.name === 'soundBtn'){
				cjs.Tween.get(e.target).to({scaleX:1, scaleY:1}, 250, cjs.Ease.backOut).call(this.handleSound, [e.target], this);
			}
			if(e.target.name === 'howToPlay'){
				cjs.Tween.get(e.target).to({scaleX:1, scaleY:1}, 250, cjs.Ease.backOut).call(this.howToPlayCall, null, this);
			}
			if(e.target.name === 'startButton'){
				e.target.removeAllEventListeners();
				this.removeAllEventListeners();
				cjs.Tween.get(e.target).to({scaleX:1, scaleY:1}, 250, cjs.Ease.backOut).call(this.animateOut, null, this).wait(3000).call(this.startGame, null, this);
			}

			if(e.target.name === 'leaderBoardBtn'){
				cjs.Tween.get(e.target).to({scaleX:1, scaleY:1}, 250, cjs.Ease.backOut).call(this.callLeaderBoard, null, this);
			}


		}
		if(e.type === 'mouseout'){
			cjs.Tween.get(e.target).to({scaleX:1, scaleY:1}, 250, cjs.Ease.backOut);
		}
	}

	callLeaderBoard()
	{
		cjs.Tween.get(this.leaderBoard).to({y:-100}, 500, cjs.Ease.quadOut);
	}

	howToPlayCall()
	{
		this.animateOut();
		cjs.Tween.get(this).wait(1000).call(this.howTo.callHowTo, null, this.howTo);
		this.howToPlay.mouseEnabled = false;
		this.addChild(this.howTo);
	}

	handleSound(target)
	{
		if(target.soundOn){
			target.gotoAndPlay('sound-off');
			target.soundOn = false;
			setMusicVolume(0);
			setSFXVolume(0);
		} else {
			target.gotoAndPlay('sound');
			target.soundOn = true;
			setMusicVolume(1);
			setSFXVolume(1);
		}
	}

    start()
    {
		cjs.Tween.get(this.topContainer).to({y:0}, 1000, cjs.Ease.quadOut);
		cjs.Tween.get(this.bottomContainer).to({y:0}, 1000, cjs.Ease.quadOut);
		cjs.Tween.get(this.cloud1).to({x:350}, 1000, cjs.Ease.quadOut);
		cjs.Tween.get(this.cloud2).to({x:-350}, 1000, cjs.Ease.quadOut);
		cjs.Tween.get(this.startButton).wait(1000).to({y:-120}, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.howToPlay).wait(1000).to({y:120}, 250, cjs.Ease.quadOut);
		cjs.Tween.get(this.leaderBoardBtn).wait(1000).to({y:350}, 250, cjs.Ease.quadOut);
		this.howToPlay.mouseEnabled = true;
	}

	animateOut()
	{
		cjs.Tween.get(this.topContainer).to({y:-600}, 1000, cjs.Ease.quadIn);
		cjs.Tween.get(this.bottomContainer).to({y:1000}, 1000, cjs.Ease.quadIn);
		cjs.Tween.get(this.cloud1).to({x:800}, 1000, cjs.Ease.quadIn);
		cjs.Tween.get(this.cloud2).to({x:-800}, 1000, cjs.Ease.quadIn);
		cjs.Tween.get(this.startButton).wait(1000).to({y:-1500}, 250, cjs.Ease.quadIn);
		cjs.Tween.get(this.howToPlay, {override:true}).wait(1000).to({scaleX:1, scaleY:1, y:1500}, 250, cjs.Ease.quadIn);
		cjs.Tween.get(this.leaderBoardBtn).wait(1000).to({y:1500}, 250, cjs.Ease.quadIn);
	}

	startGame()
	{
		stageController.gotoScene('Game', false);
	}

	_tick(e)
    {
		super._tick(e);
	}


}

export default Title;
