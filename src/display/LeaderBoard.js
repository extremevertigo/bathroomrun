import { system, cache } from "../App";

export class LeaderBoard extends createjs.Container
{
	constructor(leaderInfo, playerBoard)
	{
		super();
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.leadBoardInfo = leaderInfo;
		this.playerBoard = playerBoard;
		this.testArray = [];
		// this.setTestArray();
		this.setupBoard();
		this.backBtn = new cjs.Sprite(cache.get('gameSS'), 'back').set({ x: 0, y: 500, name: 'backBtn', scaleX:0.7, scaleY:0.7 }).center();
		this.backBtn.on('mouseover', this.buttonHandler, this);
		this.backBtn.on('mouseout', this.buttonHandler, this);
		this.backBtn.on('click', this.buttonHandler, this);
		this.addChild(this.backBtn);
	}

	buttonHandler(e)
	{
		if (e.type === 'mouseover') {
			cjs.Tween.get(e.target).to({scaleX:0.8, scaleY:0.8}, 200, cjs.Ease.quadOut);
		}
		if (e.type === 'click') {
			cjs.Tween.get(this).to({y:1500}, 500, cjs.Ease.quadIn);
			cjs.Tween.get(e.target).to({scaleX:0.7, scaleY:0.7}, 200, cjs.Ease.quadOut);
		}
		if (e.type === 'mouseout') {
			cjs.Tween.get(e.target).to({scaleX:0.7, scaleY:0.7}, 200, cjs.Ease.quadOut);
		}
	}

	setTestArray()
	{

		for (let i = 0, l = 10; i < l; i++) {
			this.testArray.push(this.leadBoardInfo[0]);
		}
	}
	setupBoard()
	{
		let bgRed = this.getShape(600,880, 0,0, '#fffd07');
		bgRed.on('mouseover', ()=>{});
		let bgWhite = this.getShape(580,860, 0,0, '#ffffff');
		let name = new cjs.Text('NAME', '80px pixel_maz', '#000000').set({x:-130, y:-400, textBaseline: 'middle', textAlign:'center'});//-336
		let score = new cjs.Text('SCORE', '80px pixel_maz', '#000000').set({x:100, y:-400, textBaseline: 'middle', textAlign:'center'});
		let rank = new cjs.Text('RANK', '80px pixel_maz', '#000000').set({x:230, y:-400, textBaseline: 'middle', textAlign:'center'});
		this.addChild(bgRed,bgWhite, name, score, rank);
		this.setupInfoRow();
	}

	setupInfoRow()
	{


		let yPos = -255;
		for (var i = 0, l = this.leadBoardInfo.length; i < l; i++) {
			let infoBg = this.getShape(580,100, 0,yPos, '#ff0000');
			let infoFill = this.getShape(560,80, 0,yPos, '#ffffff');
			let rankName = this.checkName(this.leadBoardInfo[i].name);
			let name = new cjs.Text(rankName, '80px pixel_maz', '#000000').set({x:-180, y:yPos, textBaseline: 'middle', textAlign:'left'});
			let score = new cjs.Text(this.leadBoardInfo[i].score, '80px pixel_maz', '#000000').set({x:80, y:yPos, textBaseline: 'middle', textAlign:'left'});
			let rank = new cjs.Text(this.leadBoardInfo[i].rank, '80px pixel_maz', '#000000').set({x: 220, y:yPos, textBaseline: 'middle', textAlign:'left'});
			let photo = new cjs.Bitmap(this.leadBoardInfo[i].photo).set({x:-220, y: yPos, scaleX:0.2, scaleY:0.2}).center();
			this.addChild(infoBg, infoFill, name, score, rank, photo);
			yPos += 105;
			if(yPos > 375){
				break;
			}
		}
		if(this.playerBoard.score){
			let youText = new cjs.Text('You', '80px pixel_maz', '#ff0000').set({x:-180, y:-345, textBaseline: 'middle', textAlign:'left'});
			let youScore = new cjs.Text(this.playerBoard.score, '80px pixel_maz', '#ff0000').set({x:80, y:-345, textBaseline: 'middle', textAlign:'left'});
			let youRank = new cjs.Text(this.playerBoard.rank, '80px pixel_maz', '#ff0000').set({x: 220, y:-345, textBaseline: 'middle', textAlign:'left'});
			let youPhoto = new cjs.Bitmap(this.playerBoard.photo).set({x:-220, y: -340, scaleX:0.2, scaleY:0.2}).center();
			this.addChild(youText, youScore, youRank, youPhoto);
		}
	}

	checkName(name){
		let l = name.length;
		let newName = name;
		if(l > 8){
			newName = name.slice(0,10);
			newName = newName +'..';
		}
		return newName;

	}

	getShape(w,h,xPos, yPos, color)
	{
		let sg = new cjs.Graphics();
		sg.f(color).r(0, 0, w, h);
		let ss = new cjs.Shape(sg);
		ss.x = xPos;
		ss.y = yPos;
		ss.regX = w * 0.5;
		ss.regY = h * 0.5;
		return ss;
	}

	_tick(e)
	{
		super._tick(e);
	}
}
