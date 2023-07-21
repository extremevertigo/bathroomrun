import { cache, system, physics } from "../App";
import '../tools/box2d/box2d';
export class EnemyPool extends createjs.Container
{
	constructor()
	{
		super();
		this.halfWidth = system.width / 2;
		this.halfHeight = system.height / 2;
		this.enemyGround = [];
		this.enemyAir = [];
		this.setupPhysicsData();
		this.createEnemy();
		this.speed = -6.65;
		this.leftOverNum = 0;
	}

	setupPhysicsData()
	{
		this.treeData = {
			"spriteRegX": 109,
			"spriteRegY": 329.157,
			"fixtures": [
				{
					"density": 2,
					"friction": 0,
					"restitution": 0,
					"categoryBits": 1,
					"maskBits": 65535,
					"groupIndex": 0,
					"isSensor": false,
					"userData": "enemy",
					"fixtureType": "POLYGON",
					"polygons": [
						[[-18, -242.15699999999998], [-24, -215.15699999999998], [-23, -247.15699999999998], [-18, -248.15699999999998]],
						[[-109, 211.84300000000002], [-104, 211.84300000000002], [50, 251.84300000000002], [-50, 257.843], [-109, 257.843]],
						[[-50, 327.843], [-50, 257.843], [50, 251.84300000000002], [50, 327.843]],
						[[66, -17.156999999999982], [66, 14.843000000000018], [61, -12.156999999999982], [62, -18.156999999999982]],
						[[50, 251.84300000000002], [104, 217.84300000000002], [109, 217.84300000000002], [109, 251.84300000000002]],
						[[6, -329.157], [12, -275.157], [-6, -302.157], [-6, -329.157]],
						[[93, 157.84300000000002], [88, 135.84300000000002], [93, 129.84300000000002]],
						[[55, -45.15699999999998], [61, -12.156999999999982], [-61, -18.156999999999982], [-61, -45.15699999999998]],
						[[72, 42.84300000000002], [-73, 41.84300000000002], [66, 14.843000000000018], [72, 14.843000000000018]],
						[[-66, 9.843000000000018], [-73, 41.84300000000002], [-72, 9.843000000000018]],
						[[-6, -302.157], [12, -275.157], [17, -248.15699999999998], [-13, -270.157], [-12, -302.157]],
						[[17, -248.15699999999998], [12, -275.157], [17, -280.157]],
						[[55, -45.15699999999998], [50, -72.15699999999998], [55, -73.15699999999998]],
						[[99, 189.84300000000002], [50, 251.84300000000002], [94, 162.84300000000002], [99, 157.84300000000002]],
						[[83, 102.84300000000002], [77, 74.84300000000002], [82, 69.84300000000002]],
						[[61, -12.156999999999982], [55, -45.15699999999998], [61, -45.15699999999998]],
						[[-88, 124.84300000000002], [88, 135.84300000000002], [-95, 151.84300000000002], [-93, 124.84300000000002]],
						[[-61, -18.156999999999982], [61, -12.156999999999982], [-66, 9.843000000000018], [-66, -18.156999999999982]],
						[[50, -72.15699999999998], [45, -100.15699999999998], [50, -105.15699999999998]],
						[[104, 217.84300000000002], [50, 251.84300000000002], [99, 189.84300000000002], [104, 189.84300000000002]],
						[[23, -220.15699999999998], [17, -248.15699999999998], [22, -248.15699999999998]],
						[[23, -220.15699999999998], [28, -187.15699999999998], [-18, -242.15699999999998], [-13, -270.157], [17, -248.15699999999998]],
						[[77, 74.84300000000002], [72, 42.84300000000002], [77, 42.84300000000002]],
						[[28, -187.15699999999998], [23, -220.15699999999998], [28, -220.15699999999998]],
						[[88, 135.84300000000002], [-88, 124.84300000000002], [83, 102.84300000000002], [88, 102.84300000000002]],
						[[-51, -72.15699999999998], [-55, -45.15699999999998], [-55, -78.15699999999998]],
						[[-46, -100.15699999999998], [-51, -72.15699999999998], [-50, -105.15699999999998]],
						[[-13, -270.157], [-18, -242.15699999999998], [-17, -275.157]],
						[[28, -187.15699999999998], [50, -72.15699999999998], [-24, -215.15699999999998], [-18, -242.15699999999998]],
						[[-73, 41.84300000000002], [-77, 69.84300000000002], [-77, 36.84300000000002]],
						[[77, 74.84300000000002], [83, 102.84300000000002], [-88, 124.84300000000002], [-83, 69.84300000000002]],
						[[-95, 151.84300000000002], [-104, 211.84300000000002], [-99, 151.84300000000002]],
						[[45, -100.15699999999998], [28, -187.15699999999998], [33, -193.15699999999998]],
						[[55, -45.15699999999998], [-55, -45.15699999999998], [-24, -215.15699999999998], [50, -72.15699999999998]],
						[[-24, -215.15699999999998], [-46, -100.15699999999998], [-28, -220.15699999999998]],
						[[61, -12.156999999999982], [66, 14.843000000000018], [-73, 41.84300000000002], [-66, 9.843000000000018]],
						[[77, 74.84300000000002], [-77, 69.84300000000002], [-73, 41.84300000000002], [72, 42.84300000000002]],
						[[88, 135.84300000000002], [94, 162.84300000000002], [50, 251.84300000000002], [-104, 211.84300000000002], [-95, 151.84300000000002]]
					]
				}
			]
		};

		this.mailData = {
			"spriteRegX": 54,
			"spriteRegY": 82,
			"fixtures": [
				{
					"density": 2,
					"friction": 0,
					"restitution": 0,
					"categoryBits": 1,
					"maskBits": 65535,
					"groupIndex": 0,
					"isSensor": false,
					"userData": "enemy",
					"fixtureType": "POLYGON",
					"polygons": [
						[[42, 56], [54, -49], [54, 82], [42, 82]],
						[[-54, 82], [-54, -49], [-50, -57], [-42, 56], [-42, 82]],
						[[54, -49], [42, 56], [-42, 56], [-50, -57], [-29, -82], [28, -82]]
					]
				}
			]
		};
		this.parkingData = {
			"spriteRegX": 37,
			"spriteRegY": 86.013,
			"fixtures": [
				{
					"density": 2,
					"friction": 0,
					"restitution": 0,
					"categoryBits": 1,
					"maskBits": 65535,
					"groupIndex": 0,
					"isSensor": false,
					"userData": "enemy",
					"fixtureType": "POLYGON",
					"polygons": [
						[[16, -49.013000000000005], [-18, -49.013000000000005], [-15, -83.013], [10, -86.013]],
						[[7, 71.987], [37, 84.987], [-37, 84.987], [-35, 71.987]],
						[[37, 84.987], [7, 71.987], [34, 71.987]],
						[[-8, 71.987], [-8, -49.013000000000005], [7, -49.013000000000005], [7, 71.987]]
					]
				}
			]
		};

		this.birdData = {
			"spriteRegX": 56.952,
			"spriteRegY": 56.952,
			"fixtures": [
				{
					"density": 2,
					"friction": 0,
					"restitution": 0,
					"categoryBits": 1,
					"maskBits": 65535,
					"groupIndex": 0,
					"isSensor": false,
					"userData": "enemy",
					"fixtureType": "POLYGON",
					"polygons": [
						[[42.048, -49.952], [42.048, 20.048000000000002], [-48.952, 20.048000000000002], [-50.952, -49.952]]
					]
				}
			]
		};
	}

	createEnemy()
	{
		for (let i = 0, l = 4; i < l; i++) {
			let mailBox = new cjs.Sprite(cache.get('gameSS'), 'mail-box-enemy').set({name:'mailbox'}).center();
			let parkingMeter = new cjs.Sprite(cache.get('gameSS'), 'parking-meter-enemy').set({name:'parkingmeter'}).center();
			let mailBoxB2 = this.buildBodyFromData(this.mailData, this.halfWidth+400, this.halfHeight-194,  physics.world, false, mailBox);
			let parkingMeterB2 = this.buildBodyFromData(this.parkingData, this.halfWidth+400, this.halfHeight-196, physics.world, false, parkingMeter);
			let tree = new cjs.Sprite(cache.get('gameSS'), 'enemy-tree').set({name:'tree'}).center();
			let treeB2 = this.buildBodyFromData(this.treeData, this.halfWidth + 400, this.halfHeight-440, physics.world, false, tree);
			this.enemyGround.push(mailBoxB2);
			this.enemyGround.push(parkingMeterB2);
			this.enemyGround.push(treeB2);
			this.addChild(mailBox, parkingMeter, tree);

		}

		let bird = new cjs.Sprite(cache.get('animationsSS'), 'bird').set({ framerate: 12, scaleX: 1, scaleY: 1, x: -10, y: -20 }).center();
		let birdB2 = this.buildBodyFromData(this.birdData, this.halfWidth + 400, this.halfHeight-500, physics.world, false, bird);
		this.enemyAir.push(birdB2);
		this.addChild(bird);
	}

	resetTree(enemy){

		this.parent.stopTreeWarning();
		enemy.SetPosition(new b2.b2Vec2(this.halfWidth + 250 / b2.b2Scale, this.halfHeight-440 / b2.b2Scale));
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
		physics.entities.push(body);
		body.SetUserData({ name:'enemy' });
		body.SetPosition(new b2.b2Vec2(xPos / b2.b2Scale, yPos / b2.b2Scale));
		return body;
	}
	spawn()
	{
		this.enemyGround.shuffle();
		let enemy = this.enemyGround[0];
		if (!enemy.canMove) {
			let vel = new b2.b2Vec2(-500, 2);
			enemy.SetAwake(true);
			// enemy.SetLinearVelocity(vel);
			enemy.canMove = true;
			if(enemy.displayObject.name === 'tree'){
				this.treeInGame = true;
				this.parent.flashTreeWarning();
			}
		}
		else {
			this.spawn();
		}
	}

	spawnBird()
	{
		this.enemyAir.shuffle();
		let enemy = this.enemyAir[0];
		if (!enemy.canMove) {
			enemy.SetAwake(true);
			enemy.canMove = true;
			if(this.parent.extraMode){
				let yPos = [-350, -150, 150];
				yPos.shuffle();
				enemy.SetPosition(new b2.b2Vec2((this.halfWidth + 200) / b2.b2Scale, yPos[0] / b2.b2Scale));
			}
		}

	}

	update(e)
	{

		for (let i = 0, l = this.enemyAir.length; i < l; i++) {
			let bird = this.enemyAir[i];
			let pos = bird.GetPosition();
			let angle = bird.GetAngle();
			bird.displayObject.x = pos.x * b2.b2Scale;
			bird.displayObject.y = pos.y * b2.b2Scale;
			bird.rotation = Math.toDeg(angle);
			if (bird.displayObject.x < -this.halfWidth - bird.displayObject.regX) {
				bird.canMove = false;
				bird.SetPosition(new b2.b2Vec2(this.halfWidth + 400 / b2.b2Scale, pos.y));
			}
			if (bird.canMove) {
				bird.SetPosition(new b2.b2Vec2(pos.x + (this.speed-5) * e, pos.y));
			}
		}

		if(this.parent.inOutHouse){return;}
		for (let i = 0, l = this.enemyGround.length; i < l; i++) {
			let enemy = this.enemyGround[i];
			let pos = enemy.GetPosition();
			let angle = enemy.GetAngle();
			enemy.displayObject.x = pos.x * b2.b2Scale;
			enemy.displayObject.y = pos.y * b2.b2Scale;
			enemy.rotation = Math.toDeg(angle);
			if (enemy.displayObject.x < -this.halfWidth - enemy.displayObject.regX && enemy.canMove) {
				enemy.canMove = false;
				enemy.SetPosition(new b2.b2Vec2((this.halfWidth + 250) / b2.b2Scale, pos.y));
				if(this.parent.continueMode){
					this.leftOverNum--;
					if(this.leftOverNum <= 0){
						this.parent.setupContinue();
					}

				}
			}
			if (enemy.canMove) {
				enemy.SetPosition(new b2.b2Vec2(pos.x + this.speed * e, pos.y));
			}
		}

	}

	checkDeadPool()
	{
		for (let i = 0, l = this.enemyAir.length; i < l; i++) {
			let ea = this.enemyAir[i];
			this.removeChild(ea.displayObject);
			physics.world.DestroyBody(ea);
		}

		for (let i = 0, l = this.enemyGround.length; i < l; i++) {
			let eg = this.enemyGround[i];
			if(!eg.canMove){
				this.removeChild(eg.displayObject);
				physics.world.DestroyBody(eg);
			}else{
				this.leftOverNum++;
			}
		}
		// if(this.leftOverNum === 0){
		// 	this.parent.setupContinue();
		// }
	}
	moveUp()
	{
		for (let i = 0, l = this.enemyGround.length; i < l; i++) {
			let eg = this.enemyGround[i];
			physics.world.DestroyBody(eg);
			if(eg.canMove){
				cjs.Tween.get(eg.displayObject).to({x:-500, y:this.halfHeight+600}, 1500);
			}
		}
		for (let i = 0, l = this.enemyAir.length; i < l; i++) {
			let ea = this.enemyAir[i];
			physics.world.DestroyBody(ea);
			if(ea.canMove){
				cjs.Tween.get(ea.displayObject).to({x:-500, y:this.halfHeight+600}, 1500);
			}
		}
	}

	kill()
	{
		for (let i = 0, l = this.enemyGround.length; i < l; i++) {
			let eg = this.enemyGround[i];
			this.removeChild(eg.displayObject);
			physics.world.DestroyBody(eg);

		}
		for (let i = 0, l = this.enemyAir.length; i < l; i++) {
			let ea = this.enemyAir[i];
			this.removeChild(ea.displayObject);
			physics.world.DestroyBody(ea);
		}
	}


}
