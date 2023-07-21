import { cache, system, physics, playSFX, setMusicVolume, stopMusic } from "../App";
import '../tools/box2d/box2d';
import { Farts } from "./Farts";
import { OutHouseObstacles } from "../display/OutHouseObstacles";

export class OutHouse extends createjs.Container
{
	constructor()
	{
		super();

		this.name = 'outhouse';
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.sprite = new cjs.Sprite(cache.get('gameSS'), 'outhouse-open').set({ name: 'outhouse-open', framerate: 12, scaleX: 1, scaleY: 1, x: this.halfWidth + 500, y: this.halfHeight - 193 }).center();
		this.farts = new Farts();
		this.fartSoundNum = 0;
		this.died = false;
		this.tweenGroup = new cjs.TweenGroup();
		// this.poop = new Poop();
		this.playerDied = false;
		this.spawnedDeadPlayer = false;
		this.pressDown = false;
		this.obstacleTimer = 0;
		this.obstacleThreshold = 100;
		this.outHouseObstacles = new OutHouseObstacles();
		// this.deathPlayer = new PlayerDeath();
		// this.deathPlayer.b2JointBox(this.sprite.x, this.sprite.y);
		this.addChild(this.outHouseObstacles, this.sprite, this.farts);
		this.physicsData = {
			"hero": {
				"spriteRegX": 80,
				"spriteRegY": 80,
				"fixtures": [
					{
						"density": 1.3,
						"friction": 0,
						"restitution": 0,
						"categoryBits": 1,
						"maskBits": 65535,
						"groupIndex": 0,
						"isSensor": false,
						"userData": "hero",
						"fixtureType": "POLYGON",
						"polygons": [
							[[55, -73], [60, 60], [-45, 60], [-45, -71]]
						]
					}
				]
			}
		};

	}
	triggerHardMode()
	{
		this.outHouseObstacles.triggerHardMode();
		this.obstacleThreshold = 50;
	}

	outHouseDie()
	{
		if(this.died){return;}
		playSFX('outhouse-die');
		stopMusic();
		physics.destroyWall();
		this.tweenGroup.get(this).wait(4000).call(this.parent.callEndGame, null, this.parent);
		this.died = true;
		let player = new cjs.Sprite(cache.get('animationsSS'), 'heroDie').set({ framerate: 12, scaleX: 1, scaleY: 1, x: this.sprite.x, y: this.sprite.y}).center();
		this.addChild(player);
		this.sprite.gotoAndPlay('outhouse-open');
		this.tweenGroup.get(player).to({y:this.halfHeight+200, rotation:360}, 1000, cjs.Ease.backIn);
		this.tweenGroup.get(this.sprite).to({y:this.halfHeight+200, rotation:-360}, 900, cjs.Ease.quadIn);
	}

	createBox(world, x, y)
	{

		var physicsData = this.physicsData.hero;
		this.sprite.x = x;
		this.sprite.y = y;
		this.displayObject = this.sprite;
		this.body = this.buildBodyFromData(physicsData, world, b2.b2Body.b2_dynamicBody, true);
		this.body.name = 'hero';
		this.body.SetPosition(new b2.b2Vec2(x / b2.b2Scale, y / b2.b2Scale));
		this.allowUserControl = true;
		this.addContactListeners();
		this.callObstacle();
	}

	startGame()
	{
		// this.farts.stopBlast(this.sprite);
		this.tweenGroup.get(this.farts).wait(2000).call(this.farts.stopBlast, [this.sprite], this.farts).wait(500).call(this.outHouseTutorial, null, this);
		this.tweenGroup.get(this.sprite).wait(2000)
			.to({ rotation: 450 }, 1000, cjs.Ease.quadOut)
			.wait(2000)
			.to({ rotation: 405 }, 1000)
			.wait(500)
			.to({ rotation: 495 }, 1000, cjs.Ease.quadOut)
			.wait(2000)
			.to({ rotation: 450 }, 1000, cjs.Ease.quadOut)
			.set({ rotation: 90 })
			.call(this.createBox, [physics.world, this.sprite.x, this.sprite.y], this);
	}



	callObstacle()
	{
		this.outHouseObstacles.callObstacleRow();
	}

	outHouseTutorial()
	{
		this.parent.outHouseTutorial();
	}

	buildBodyFromData(data, world, bodyType, bool)
	{
		var fixtures = data.fixtures;
		var body;
		var bodyDef = new b2.b2BodyDef();
		bodyDef.type = bodyType;
		bodyDef.userData = this;
		if (bool)
			bodyDef.bullet = true;

		// create the body
		body = world.CreateBody(bodyDef);

		// prepare fixtures
		for (var i = 0; i < fixtures.length; i++) {
			var fixture = fixtures[i];
			var fixtureDef = new b2.b2FixtureDef();
			fixtureDef.density = fixture.density;
			fixtureDef.friction = fixture.friction;
			fixtureDef.restitution = fixture.restitution;
			fixtureDef.filter.categoryBits = fixture.categoryBits;
			fixtureDef.filter.maskBits = fixture.maskBits;
			fixtureDef.filter.groupIndex = fixture.groupIndex;
			fixtureDef.isSensor = fixture.isSensor;
			if (fixture.userData) fixtureDef.userData = fixture.userData;

			var polygons = fixture.polygons;
			for (var p = 0; p < polygons.length; p++) {
				var vertices = [];
				for (var m = 0; m < polygons[p].length; m++) {
					vertices.push(new b2.b2Vec2(polygons[p][m][0] / b2.b2Scale, polygons[p][m][1] / b2.b2Scale));
				}
				var polygonShape = new b2.b2PolygonShape();
				polygonShape.SetAsArray(vertices, vertices.length);
				fixtureDef.shape = polygonShape;

				body.CreateFixture(fixtureDef);
			}
		}
		return body;
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
		if (tp.alpha === 1 && tp.x > player.x - 50 && tp.x < player.x + 50 && tp.y < player.y + 100 && tp.y > player.y - 100) {
			this.triggerPlayerCatch();
		}

	}

	triggerPlayerCatch()
	{
		this.parent.changeOutHouseIndex();
		this.sprite.gotoAndPlay('outhouse');
		this.sprite.name = 'outhouse';
		this.sprite.regX = 113;
		this.sprite.regY = 169;
		this.sprite.x += 118 * 0.5;
		this.sprite.y += 169 * 0.5;
		this.tweenGroup.get(this.sprite)
			.to({ rotation: 30 }, 150, cjs.Ease.quadOut)
			.to({ rotation: 0 }, 100, cjs.Ease.quadIn)
			.wait(250).set({ regX: 56.5, x: this.sprite.x - 56.5 })
			.to({ x: this.sprite.x - 56.5 })
			.to({ scaleY: 0.4, scaleX: 1.3 }, 250, cjs.Ease.quadOut)
			.call(this.farts.blastFart, [this.sprite], this.farts)
			.to({ scaleY: 1, scaleX: 1 }, 150, cjs.Ease.quadIn)
			.set({ regY: 84.5, y: this.sprite.y - 84.5 })
			.to({ y: this.sprite.y - 84.5 })
			.to({ y: 150 }, 200)
			.to({ y: -150, rotation: 405 }, 200, cjs.Ease.quadOut)
			.to({ y: 0, }, 200, cjs.Ease.quadInOut)
			.call(this.addChildAt, [this.farts, 0], this)
			.call(this.farts.rumbleFart, [this.sprite], this.farts)
			.to({ y: -20, x: this.sprite.x - 20, }, 50, cjs.Ease.quadInOut)
			.to({ y: 20, x: this.sprite.x + 20 }, 50, cjs.Ease.quadInOut)
			.to({ y: -20, x: this.sprite.x - 20, }, 50, cjs.Ease.quadInOut)
			.to({ y: 20, x: this.sprite.x + 20 }, 50, cjs.Ease.quadInOut)
			.to({ y: -20, x: this.sprite.x - 20, }, 50, cjs.Ease.quadInOut)
			.to({ y: 20, x: this.sprite.x + 20 }, 50, cjs.Ease.quadInOut)
			.to({ y: -20, x: this.sprite.x - 20, }, 50, cjs.Ease.quadInOut)
			.to({ y: 20, x: this.sprite.x + 20 }, 50, cjs.Ease.quadInOut)
			.to({ y: 0, x: this.sprite.x }, 50, cjs.Ease.quadInOut)
			.to({x:-200},100)
			.call(this.farts.blastOff, [this.sprite], this.farts)
			.call(this.parent.blastOffLevelCall, null, this.parent);


	}

	update(e, speed)
	{

		if (this.sprite.name === 'outhouse-open') {
			this.sprite.x -= speed * e;

			this.checkCollision(this.sprite);
			return;
		}
		if (this.body) {
			let body, pos, vel, angle;
			body = this.body;
			pos = body.GetPosition();
			vel = body.GetLinearVelocity();
			this.body.SetAngle(0);
			angle = body.GetAngle();
			if(!this.died){
				this.sprite.x = pos.x * b2.b2Scale - 20;
				this.sprite.y = pos.y * b2.b2Scale - 26;
			}
			if(this.sprite.y > this.halfHeight+50){
				this.outHouseDie();
			}

			this.farts.fartEngine(e);
			if (this.pressDown && !this.died) {
				this.sprite.rotation -= 1;
				if(this.sprite.rotation<45){
					this.sprite.rotation = 45;
				}
				let force = new b2.b2Vec2(0, -20);
					this.body.ApplyImpulse(force, this.body.GetPosition());
				this.farts.addFart(this.sprite);
			} else {
				this.sprite.rotation += 1;
				if(this.sprite.rotation > 135){
					this.sprite.rotation = 135;
				}
			}
			this.outHouseObstacles.update(e, speed);

			this.obstacleTimer++;
			if(this.obstacleTimer > this.obstacleThreshold){
				this.callObstacle();
				this.obstacleTimer = 0;
			}
			if(!this.died){
				this.parent.outHouseFeetCounter();
			}

		}
	}

	kill()
	{
		this.removeChild(this.sprite);
		physics.world.DestroyBody(this.body);
		// this.deathPlayer.killPoop();
	}

	addContactListeners()
	{
		var b2Listener = new b2.b2ContactListener();
		physics.world.SetContactListener(b2Listener);
		b2Listener.BeginContact = function (contact)
		{
			var userDataA = contact.GetFixtureA().GetBody().GetUserData();
			var userDataB = contact.GetFixtureB().GetBody().GetUserData();
			if (userDataA.name === "hero" || userDataB.name === "hero") {
				var otherName = userDataA.name === "hero" ? userDataB.name : userDataA.name;
				switch (otherName) {
					case "screenEdgeLeft":
					// ig.ViewControl.current.hitEdge = true;
					case "screenEdgeRight":
					case "screenEdgeBottom":
					case "poopBox":
						break;
					case "ground":
						if (userDataA.displayObject) {
							this.landed(userDataA.displayObject.y);
						} else {
							this.landed(2000);
						}

						break;
					case "enemy":

						this.playerDied = true;
						break;
				}
			}
		}.bind(this);

		b2Listener.EndContact = function (contact)
		{
			var userDataA = contact.GetFixtureA().GetBody().GetUserData();
			var userDataB = contact.GetFixtureB().GetBody().GetUserData();


			if (userDataA.name == "playerHero" || userDataB.name == "playerHero") {
				var otherName = userDataA.name === "playerHero" ? userDataB.name : userDataA.name;

				switch (otherName) {
					case "screenEdgeLeft":
					case "screenEdgeRight":
					case "screenEdgeBottom":
					case "poopBox":
					case "platBottom":
						break;
					case "groundBox":
						// ig.ViewControl.current.isJumping();
						break;
				}
			}
		};
	}
}
