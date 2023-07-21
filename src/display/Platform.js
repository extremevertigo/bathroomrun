import { cache, system, physics } from "../App";
import '../tools/box2d/box2d';
export class Platform extends createjs.Container
{
	constructor()
	{
		super();
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.platformsArray = [];
		this.yPlatPos = [ 300, 0, -300];
		this.yPlatNum = 0;
		this.platNum = 0;
		this.setupPhysicsData();
		this.createPlatforms();
		this.speed = -6.65;
	}

	setupPhysicsData()
	{
		this.platformData = {
			"spriteRegX": 192.5,
			"spriteRegY": 28,
			"fixtures": [
				{
					"density": 2,
					"friction": 0,
					"restitution": 0.3,
					"categoryBits": 1,
					"maskBits": 65535,
					"groupIndex": 0,
					"isSensor": false,
					"userData": "",
					"fixtureType": "POLYGON",
					"polygons": [
						[[-192.5, -28], [192.5, -28], [192.5, 28], [-192.5, 28]]
					]
				}
			]
		};

	}

	createPlatforms()
	{
		for (let i = 0, l = 10; i < l; i++) {
			let platform = new cjs.Sprite(cache.get('gameSS'), 'floor-small').center();
			let platformB2 = this.buildBodyFromData(this.platformData, this.halfWidth + 300, this.halfHeight-330, physics.world, false, platform);
			this.platformsArray.push(platformB2);
			this.addChild(platform);

		}
	}

	createPlatform()
	{

			let platform = new cjs.Sprite(cache.get('gameSS'), 'floor-small').center();
			let platformB2 = this.buildBodyFromData(this.platformData, this.halfWidth + 300, this.halfHeight-330, physics.world, false, platform);
			this.platformsArray.push(platformB2);
			this.addChild(platform);
	}



	buildBodyFromData(data, xPos, yPos, world, bool, sprite)
	{
		let displayObject = sprite;
		let fixtures = data.fixtures;
		let body;
		let bodyDef = new b2.b2BodyDef();
		bodyDef.type = b2.b2Body.b2_staticBody;

		bodyDef.userData = this;

		if (bool)
			bodyDef.bullet = true;

		// create the body
		body = world.CreateBody(bodyDef);
		body.displayObject = displayObject;
		body.canMove = false;
		body.SetUserData({ isGround: true, name:'ground', displayObject:body.displayObject });
		body.SetAwake(false);
		// prepare fixtures
		for (let i = 0; i < fixtures.length; i++) {
			let fixture = fixtures[i];
			let fixtureDef = new b2.b2FixtureDef();
			fixtureDef.density = fixture.density;
			fixtureDef.friction = fixture.friction;
			fixtureDef.restitution = fixture.restitution;
			fixtureDef.filter.categoryBits = fixture.categoryBits;
			fixtureDef.filter.maskBits = fixture.maskBits;
			fixtureDef.filter.groupIndex = fixture.groupIndex;
			fixtureDef.isSensor = fixture.isSensor;
			if (fixture.userData) fixtureDef.userData = fixture.userData;

			let polygons = fixture.polygons;
			for (let p = 0; p < polygons.length; p++) {
				let vertices = [];
				for (let m = 0; m < polygons[p].length; m++) {
					vertices.push(new b2.b2Vec2(polygons[p][m][0] / b2.b2Scale, polygons[p][m][1] / b2.b2Scale));
				}
				let polygonShape = new b2.b2PolygonShape();
				polygonShape.SetAsArray(vertices, vertices.length);
				fixtureDef.shape = polygonShape;

				body.CreateFixture(fixtureDef);
			}
		}
		body.SetPosition(new b2.b2Vec2(xPos / b2.b2Scale, yPos / b2.b2Scale));
		physics.entities.push(body);
		return body;
	}
	spawn()
	{
		// this.platformsArray.shuffle();
		let platform = this.platformsArray[this.platNum];
		this.platNum++;
		if(this.platNum > this.platformsArray.length-1){
			this.platNum = 0;
		}
		platform.SetAwake(true);
		if(!platform.canMove){
			platform.canMove = true;

			if(this.parent.extraMode){
				platform.SetPosition(new b2.b2Vec2((this.halfWidth + 200) / b2.b2Scale, this.yPlatPos[this.yPlatNum] / b2.b2Scale));
				this.yPlatNum++;
				if(this.yPlatNum>2){
					this.yPlatNum = 0;
					this.yPlatPos.shuffle();
				}
			}
		}
	}

	checkCollision(platform)
	{
		if(this.parent.enemy){
			let enemyArray = this.parent.enemy.enemyGround;
			for (var i = 0, l = enemyArray.length; i < l; i++) {
			var enemy = enemyArray[i];
			let displayObject = enemy.displayObject;
			if(displayObject.name === 'tree' && enemy.canMove && platform.canMove && platform.displayObject.x+platform.displayObject.regX > displayObject.x-100 && platform.displayObject.x-platform.displayObject.regX < displayObject.x ){

				cjs.Tween.get(this.parent.treeText, {override:true}).set({visible:false});
				this.parent.enemy.resetTree(enemy);
			}
			}
		}
	}

	update(e)
	{
		if(this.parent.inOutHouse){return;}
		for (let i = 0, l = this.platformsArray.length; i < l; i++) {
			let platform = this.platformsArray[i];
			let pos = platform.GetPosition();
			let angle = platform.GetAngle();
			platform.displayObject.x = pos.x * b2.b2Scale;
			platform.displayObject.y = pos.y * b2.b2Scale;
			platform.rotation = Math.toDeg(angle);

			if (platform.displayObject.x < -this.halfWidth - platform.displayObject.regX-100) {
				platform.canMove = false;
				platform.SetPosition(new b2.b2Vec2((this.halfWidth + 200) / b2.b2Scale, pos.y));
			}
			if (platform.canMove) {
				platform.SetPosition(new b2.b2Vec2(pos.x + this.speed * e, pos.y));
				this.checkCollision(platform);
			}

		}
	}

	moveUp()
	{
		for (let i = 0, l = this.platformsArray.length; i < l; i++) {
			let p = this.platformsArray[i];
			if(p.canMove){
				cjs.Tween.get(p.displayObject).to({x:-500, y:this.halfHeight+600}, 1500);
			}
			physics.world.DestroyBody(p);
		}
	}

	kill()
	{
		for (let i = 0, l = this.platformsArray.length; i < l; i++) {
			let p = this.platformsArray[i];
			this.removeChild(p.displayObject);
			physics.world.DestroyBody(p);
		}
	}

}
