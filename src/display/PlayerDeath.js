import { cache, system, physics } from "../App";
import { Farts } from "./Farts";
import '../tools/box2d/box2d';
import { Poop } from "./Poop";
export class PlayerDeath extends createjs.Container
{
	constructor()
	{
		super();

		this.name = 'hero';
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.sprite = new cjs.Sprite(cache.get('animationsSS'), 'heroDie').set({ framerate: 12, scaleX: 1, scaleY: 1, x: -260, y: this.halfHeight - 345, visible: false }).center();
		this.farts = new Farts();
		this.poop = new Poop();
		this.deathVel = null;
		this.deathIsDone = null;
		this.spawnPooNum = 0;
		this.addChild(this.poop, this.farts, this.sprite);
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
							[[60, -73], [60, 60], [-42, 60], [-45, -71]]
						]
					}
				]
			}
		};

	}

	b2JointBox(xPos, yPos)
	{
		this.bbox = this.b2JointCreateBox(xPos, yPos, 70, 70, 0, 2, 0, 0, 0.0, "", "", this);
	}

	b2JointCreateBox(x, y, w, h, angle, bodyType, density, friction, restitution, userDataName, userDataType, userDataGameRef)
	{
		let fixture = new b2.b2FixtureDef();
		fixture.shape = new b2.b2PolygonShape();
		fixture.shape.SetAsBox((w * 0.5) / b2.b2Scale, (h * 0.5) / b2.b2Scale);
		fixture.density = isNaN(density) ? 1 : density;
		fixture.friction = isNaN(friction) ? 0.5 : friction;
		fixture.restitution = isNaN(restitution) ? 0 : restitution;
		fixture.filter.maskBits = 4;
		let bodyDef = new b2.b2BodyDef();
		bodyDef.position.Set(x / b2.b2Scale, y / b2.b2Scale);
		let body = physics.world.CreateBody(bodyDef);

		body.CreateFixture(fixture);
		body.SetAngle(Math.toRad(angle || 0));
		body.SetType(bodyType);
		body.SetUserData({ name: userDataName, type: userDataType, gameRef: userDataGameRef, bodyRef: body });
		body.m_jointList = null;
		return body;
	}

	b2PushBox(num, heroX, heroY)
	{
		this.sprite.visible = true;
		var hX = heroX / b2.b2Scale;
		var hY = heroY / b2.b2Scale;
		var ranX = Math.range(-30, 30);
		var ranY = Math.range(-30, 30);
		var ranA = Math.range(0, 360) * Math.PI / 180;
		var point = this.bbox.GetWorldPoint(new b2.b2Vec2(0, 10));
		switch (num) {
			case 1:
				// console.log("die 1");
				this.bbox.SetLinearVelocity(new b2.b2Vec2(0, 0));
				this.bbox.SetAngularVelocity(ranA);
				this.bbox.SetTransform(new b2.b2Transform(new b2.b2Vec2(hX, hY), new b2.b2Mat22(0)));
				// var v = new b2Vec2(ranX * -1,ranY * -1);
				var v = new b2.b2Vec2(10, 10);
				this.deathVel = new b2.b2Vec2(-5, -5);
				this.bbox.ApplyImpulse(v, point);
				cjs.Tween.get(this).wait(100).call(this.b2PushBox, [2, hX, hY], this);
				break;
			case 2:
				this.bbox.SetLinearVelocity(new b2.b2Vec2(0, 0));
				this.bbox.SetAngularVelocity(ranA);
				// this.bbox.SetTransform(new b2.b2Transform(new b2.b2Vec2(hX, hY), new b2.b2Mat22(0)));
				// var v = new b2Vec2(ranX,ranY);
				var v = new b2.b2Vec2(30, -20);
				this.deathVel = new b2.b2Vec2(-15, 10);
				this.bbox.ApplyImpulse(v, point);
				cjs.Tween.get(this).wait(400).call(this.b2PushBox, [3], this);
				break;
			case 3:
				this.bbox.SetLinearVelocity(new b2.b2Vec2(0, 0));
				this.bbox.SetAngularVelocity(ranA);
				// var v = new b2Vec2(ranX * -1,ranY * -1);
				var v = new b2.b2Vec2(-30, -20);
				this.deathVel = new b2.b2Vec2(15, 10);
				this.bbox.ApplyImpulse(v, point);
				cjs.Tween.get(this).wait(400).call(this.b2PushBox, [4], this);
				break;
			case 4:
				this.bbox.SetLinearVelocity(new b2.b2Vec2(0, 0));
				this.bbox.SetAngularVelocity(ranA);
				var v = new b2.b2Vec2(ranX, ranY);
				this.deathVel = new b2.b2Vec2(-ranX*0.5, -ranY*0.5)
				this.bbox.ApplyImpulse(v, point);
				cjs.Tween.get(this).wait(600).call(this.b2PushBox, [5], this);
				break;
			case 5:
				this.bbox.SetLinearVelocity(new b2.b2Vec2(0, 0));
				this.bbox.SetAngularVelocity(ranA);
				var v = new b2.b2Vec2(100, -100);
				this.deathVel = new b2.b2Vec2(-100, 50);
				this.bbox.ApplyImpulse(v, point);
				cjs.Tween.get(this).wait(5000).call(this.triggerDeath, null, this);
				break;

		}
	}

	triggerDeath()
	{
		physics.world.DestroyBody(this.bbox);
		this.removeChild(this.sprite);
	}

	buildBodyFromData(data, bodyType, bool)
	{
		var fixtures = data.fixtures;
		var body;
		var bodyDef = new b2.b2BodyDef();
		bodyDef.type = bodyType;
		bodyDef.userData = this;
		if (bool)
			bodyDef.bullet = true;

		// create the body
		body = physics.world.CreateBody(bodyDef);

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
		if(this.deathIsDone) {return;}
		if(this.bbox){
		var body, pos, vel, angle;
			body = this.bbox;
			pos = body.GetPosition();
			vel = body.GetLinearVelocity();
			angle = body.GetAngle();
			this.sprite.x = pos.x * b2.b2Scale - 20;
			this.sprite.y = pos.y * b2.b2Scale - 35;
			this.sprite.rotation = Math.toDeg(-angle);
			this.farts.dieFart(this.sprite.x, this.sprite.y);
			this.spawnPooNum++;
			if(this.spawnPooNum % 3 === 0){
				this.poop.diePoop(this.sprite.x, this.sprite.y+20, this.deathVel);
			}
			this.poop.update();
		}
	}

	kill()
	{
		this.deathIsDone = true;
		this.removeChild(this.sprite);
		physics.world.DestroyBody(this.bbox);
		// this.bbox = null;
		// physics.world.DestroyJoint(this.body);
		// this.poop.kill();
		cjs.Tween.get(this).wait(1000).call(this.setBBBox, null, this);
	}
	setBBBox()
	{
		this.bbox = null;
	}
	killPoop()
	{
		this.poop.kill();
	}

}
