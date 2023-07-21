import { cache, system, physics } from "../App";
import '../tools/box2d/box2d';
export class Poop extends createjs.Container
{
	constructor()
	{
		super();
		this.num = 1;
		this.randomMax = Math.range(1,4);
		this.pooSprite = [];
		this.boxPoo = [];
		this.poopDeath = false;
		this.physicsData = {
			"poop": {
				"spriteRegX": 13,
				"spriteRegY": 14.993,
				"fixtures": [
					{
						"density": 2,
						"friction": 0,
						"restitution": 0,
						"categoryBits": 1,
						"maskBits": 65535,
						"groupIndex": 0,
						"isSensor": false,
						"userData": "",
						"fixtureType": "POLYGON",
						"polygons": [
							[[9, -10.993], [9, 6.007], [-7, 6.007], [-7, -10.993]]
						]
					}
				]
			}
		};
	}

	callPoop(xPos, yPos)
	{
		this.num = 1;
		this.buildPoop(xPos, yPos);
	}

	buildPoop(xPos, yPos)
	{
		if (this.num > this.randomMax) {
			this.randomMax = Math.range(1,4);
			return;
		}
		this.num++;
		let pooNum = Math.floor(Math.range(1, 9));
		let poo = new cjs.Sprite(cache.get('gameSS'), 'poop-' + pooNum).center();
		poo.set({
			x: xPos,
			y: yPos,
			regX: 8.5,
			regY: 19.5,
			scaleX: 1,
			scaleY: 1
		});
		let vel = new b2.b2Vec2(-5, 2);
		let pB = this.pooBox(xPos, yPos, poo, vel);
		this.addChild(poo);
		this.pooSprite.push(poo);
		this.boxPoo.push(pB);
		this.poopTween(xPos, yPos);
		cjs.Tween.get(this).wait(3000).call(this.removePoop, [pB, poo], this);
	}

	diePoop(xPos, yPos, vel) {
		this.poopDeath = true;
		let pooNum = Math.floor(Math.range(1, 9));
		let p = new cjs.Sprite(cache.get('gameSS'), 'poop-' + pooNum).set({
			x: xPos,
			y: yPos,
			regX: 8.5,
			regY: 19.5,
			scaleX: 0.7,
			scaleY: 0.7,
			visible: true
		});
		// let vel = new b2.b2Vec2(-5, 2);
		let pB = this.pooBox(xPos, yPos, p, vel);
		this.addChild(p);
		this.pooSprite.push(p);
		this.boxPoo.push(pB);
		// cjs.Tween.get(this).wait(3000).call(this.removePoop, [pB, p], this);
	}

	pooBox (xPos, yPos, sprite, vel)
	{

		let physicsData = this.physicsData.poop;
		let fixtures = physicsData.fixtures;
		let body;
		let bodyDef = new b2.b2BodyDef();
		let ranAng = Math.range(0, 360);
		bodyDef.type = b2.b2Body.b2_dynamicBody;
		bodyDef.userData = this;
		bodyDef.bullet = true;

		// create the body
		body = physics.world.CreateBody(bodyDef);
		body.displayObject = sprite;

		// prepare fixtures
		for (let i = 0; i < fixtures.length; i++) {
			let fixture = fixtures[i];
			let fixtureDef = new b2.b2FixtureDef();
			fixtureDef.density = fixture.density;
			if(this.poopDeath){
				fixtureDef.friction = 50;
			} else {
				fixtureDef.friction = fixture.friction;
			}

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

		body.name = 'poop';
		body.SetPosition(new b2.b2Vec2(xPos / b2.b2Scale, yPos / b2.b2Scale));
		body.SetAngle(ranAng);
        body.ApplyImpulse(vel, body.GetPosition());

		return body;
	}

	poopTween (xPos, yPos)
	{
		cjs.Tween.get(this).wait(50).call(this.buildPoop, [xPos, yPos], this);
	}

	removePoop(pB, pS)
	{
		this.removeChild(pS);
		physics.world.DestroyBody(pB);
	}

	update()
	{

		for (let i = 0, l = this.boxPoo.length; i < l; i++) {
			let pB = this.boxPoo[i];
			let position = pB.GetPosition();
			let angle = pB.GetAngle();
			pB.displayObject.x = position.x * b2.b2Scale;
			pB.displayObject.y = position.y * b2.b2Scale;
			pB.displayObject.rotation = Math.toDeg(angle);
		}

	}

	kill()
	{
		for (let i = 0, l = this.pooSprite.length; i < l; i++) {
		   let p = this.pooSprite[i];
		   this.removeChild(p);
		}
		for (let i = 0, l = this.boxPoo.length; i < l; i++) {
			let pb = this.boxPoo[i];
			physics.world.DestroyBody(pb);
		 }
	}


}
