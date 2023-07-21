import { cache, system, physics, playSFX } from "../App";
import { Farts } from "./Farts";
import '../tools/box2d/box2d';
import { Poop } from "./Poop";
import { PlayerDeath } from "./PlayerDeath";
export class Player extends createjs.Container
{
    constructor()
    {
		super();

		this.name = 'hero';
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.onGround = true;
		this.sprite = new cjs.Sprite(cache.get('animationsSS'), 'heroRun').set({framerate:12, scaleX:1, scaleY:1, x:-260, y:this.halfHeight-345}).center();
		this.farts = new Farts();
		this.jumpNum = 0;
		this.fartSoundNum = 0;
		this.poop = new Poop();
		this.playerDied = false;
		this.spawnedDeadPlayer = false;
		this.deathPlayer = new PlayerDeath();
		this.deathPlayer.b2JointBox(this.sprite.x, this.sprite.y);
		this.addChild(this.poop, this.farts, this.sprite);
		this.outHouseOn = false;
		this.physicsData = {
			"hero": {
				"spriteRegX": 80,
				"spriteRegY": 80,
				"fixtures": [
					{
						"density": 1.7,
						"friction": 0,
						"restitution": 0,
						"categoryBits": 1,
						"maskBits": 65535,
						"groupIndex": 0,
						"isSensor": false,
						"userData": "hero",
						"fixtureType": "POLYGON",
						"polygons": [
							[ [38, 68], [-38, 69], [-38, -68], [38, -68] ]
						]
					}
				]
			}
		};

	}

	jump ()
	{
		if(this.jumpNum >1 || this.outHouseOn){return;}
		let fartArray = [
			'fart5',
			'shortfart',
			'shortfart1',
			'shortsqueezer'
		]
		playSFX(fartArray[this.fartSoundNum]);
		this.fartSoundNum++;
		if(this.fartSoundNum>3){
			this.fartSoundNum = 0;
		}
		this.jumpNum++;
		let force = new b2.b2Vec2(0, -500);
		this.body.ApplyImpulse(force, this.body.GetPosition());
		this.sprite.gotoAndPlay('heroJump');
		this.farts.jumpFart(this.sprite);
		this.poop.callPoop(this.sprite.x, this.sprite.y+20);
		this.onGround = false;
	}
	createBox (world, x, y)
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
	}

	buildBodyFromData (data, world, bodyType, bool)
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

	update()
	{
		var body, pos, vel, angle;
		if (this.allowUserControl) {
			body = this.body;
			pos = body.GetPosition();
			vel = body.GetLinearVelocity();
			this.body.SetAngle(0);
			angle = body.GetAngle();
			this.sprite.x = pos.x * b2.b2Scale-20;
			this.sprite.y = pos.y * b2.b2Scale-26;
			this.sprite.rotation = Math.toDeg(angle);
			// this.farts.x = this.sprite.x;
			// this.farts.y = this.sprite.y;
			if(this.sprite.y > this.halfHeight+50){
				this.playerDied = true;
			}
			if(this.playerDied){
				this.diePlayer();
			}
			if(this.sprite.x < -this.halfWidth+50){
				this.body.ApplyImpulse(new b2.b2Vec2(10, 0), this.body.GetPosition());
			}
			this.poop.update();
			if(this.playerDied){
				this.deathPlayer.update();
			}
		}
	}

	landed(yPos)
	{

		if(this.onGround){return;}
		if(yPos >= this.sprite.y){
			this.sprite.gotoAndPlay('heroRun');
			this.onGround = true;
			this.jumpNum = 0;
		}
	}

	kill()
	{
		this.removeChild(this.sprite);
		physics.world.DestroyBody(this.body);
		this.deathPlayer.killPoop();
	}
	diePlayer()
	{
		// if(!this.parent.moveGround){
			if(this.spawnedDeadPlayer){return;}

			this.spawnedDeadPlayer = true;
			this.deathPlayer.b2PushBox(1, this.sprite.x, this.sprite.y);
			this.parent.playerDie();
			this.addChild(this.deathPlayer);
			cjs.Tween.get(this).wait(6000).call(this.deathPlayer.kill, null, this.deathPlayer);
			// this.kill();
		// }
	}

	addContactListeners() {
		var b2Listener = new b2.b2ContactListener();
		physics.world.SetContactListener(b2Listener);
		b2Listener.BeginContact = function(contact) {
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
						if(userDataA.displayObject){
								this.landed(userDataA.displayObject.y);
						}else {
							this.landed(2000);
						}

						break;
					case "enemy":

						this.playerDied = true;
						break;
				}
			}
		}.bind(this);

		b2Listener.EndContact = function(contact) {
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
