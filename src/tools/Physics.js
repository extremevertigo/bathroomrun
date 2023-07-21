/**Uses box2d physics
 * call create world to setup
 */
import '../tools/box2d/box2d';
import { system } from "../App";

class Physics
{
	constructor()
	{
		this.world = null;
		this.container = null;
		this.debugContainer = null;
		this.ground = null;
		this.wall = null;
		this.wall2 = null;

		this.entities = [];
		this.bodies = [];
		this.namedEntities = {};
		this._deferredKill = [];
		this.staticEntities = [];

		this.selectedBody = null;

		this.autoSort = false;
		this.sortBy = null;
		this.cellSize = 64;
		this._doSortEntities = false;
		this.offsetX = 0;
		this.offsetY = 0;
	}

	createWorld(gx, gy)
	{
		this.world = new b2.b2World(new b2.b2Vec2(gx, gy), true);
		this.world.SetContinuousPhysics(true);
		this.world.controller = this;
		return this.world;
	}

	drawDebug(container, stage)
	{
		var canvas = document.createElement('canvas');
		canvas.width = stage.canvas.width;
		canvas.height = stage.canvas.height;

		var context = canvas.getContext("2d");
		context.translate(system.width / 2, system.height / 2);

		this.debugBitmap = new cjs.Bitmap(canvas).set({ regX: system.width / 2, regY: system.height / 2 });

		var debugDrawer = new b2.b2DebugDraw();
		debugDrawer.SetSprite(context);
		debugDrawer.SetDrawScale(b2.b2Scale);
		debugDrawer.SetFillAlpha(0.5);
		debugDrawer.SetLineThickness(1);
		debugDrawer.SetFlags(b2.b2DebugDraw.e_shapeBit | b2.b2DebugDraw.e_jointBit | b2.b2DebugDraw.e_centerOfMassBit);
		this.world.SetDebugDraw(debugDrawer);

		this._debugDraw = debugDrawer;
		this._debugCtx = context;
		this._debugCanvas = canvas;
		container.addChild(this.debugBitmap);

		return context;
	}

	spawnEntity(type, x, y, container, settings)
	{
		var EntityClass = typeof (type) === 'string';
		if (!EntityClass) {
			throw ("Can't spawn entity of type " + type);
		}

		var ent = new (EntityClass)(this.world, x, y, container, settings);
		this.entities.push(ent);
		if (ent.name) {
			this.namedEntities[ent.name] = ent;
		}

		return ent;
	}

	removeAllEntities()
	{
		for (var i = 0, l = this.staticEntities.length; i < l; i++) {
			var ent = this.staticEntities[i];
			this.world.DestroyBody(ent);
		}

		for (var i = 0, l = this.entities.length; i < l; i++) {
			var ent = this.entities[i];
			this.removeEntity(ent);
		}
	}

	removeEntity(ent)
	{
		// Remove this entity from the named entities
		if (ent.name) {
			delete this.namedEntities[ent.name];
		}
		// ent.removeDisplayObjects();

		// We can not remove the entity from the entities[] array in the midst
		// of an update cycle, so remember all killed entities and remove
		// them later.
		// Also make sure this entity doesn't collide anymore and won't get
		// updated or checked
		ent._killed = true;
		this._deferredKill.push(ent);
	}

	createWall(x, y, width, height)
	{

		var b2Scale = b2.b2Scale;

		var fixture = new b2.b2FixtureDef();
		fixture.shape = new b2.b2PolygonShape();
		fixture.shape.SetAsBox((width * 0.5) / b2Scale, (height * 0.5) / b2Scale);
		fixture.density = 1;
		fixture.friction = 0;
		fixture.restitution = 0.1;

		var bodyDef = new b2.b2BodyDef();
		bodyDef.position.Set(x / b2Scale, y / b2Scale);

		var body = this.world.CreateBody(bodyDef);
		body.CreateFixture(fixture);
		body.SetType(b2.b2Body.b2_staticBody);
		body.SetUserData({ isGround: true });
		// this.staticEntities.push(body);
		this.wall = body;
	}

	createWall2(x, y, width, height)
	{

		var b2Scale = b2.b2Scale;

		var fixture = new b2.b2FixtureDef();
		fixture.shape = new b2.b2PolygonShape();
		fixture.shape.SetAsBox((width * 0.5) / b2Scale, (height * 0.5) / b2Scale);
		fixture.density = 1;
		fixture.friction = 0;
		fixture.restitution = 0.1;

		var bodyDef = new b2.b2BodyDef();
		bodyDef.position.Set(x / b2Scale, y / b2Scale);

		var body = this.world.CreateBody(bodyDef);
		body.CreateFixture(fixture);
		body.SetType(b2.b2Body.b2_staticBody);
		body.SetUserData({ isGround: true });
		// this.staticEntities.push(body);
		this.wall2 = body;
	}


	destroyWall(){

		if(this.wall){
			this.world.DestroyBody(this.wall);
		}

		if(this.wall2){
			this.world.DestroyBody(this.wall2);
		}
	}

	createGround(x, y, width, height)
	{
		var b2Scale = b2.b2Scale;

		var fixture = new b2.b2FixtureDef();
		fixture.shape = new b2.b2PolygonShape();
		fixture.shape.SetAsBox((width * 0.5) / b2Scale, (height * 0.5) / b2Scale);
		fixture.density = 1;

		fixture.friction = 10;
		fixture.restitution = 0;

		var bodyDef = new b2.b2BodyDef();
		bodyDef.position.Set(x / b2Scale, y / b2Scale);

		var body = this.world.CreateBody(bodyDef);
		body.CreateFixture(fixture);
		body.SetType(b2.b2Body.b2_staticBody);
		body.SetUserData({ isGround: true, name:'ground' });
		this.ground = body;
		this.staticEntities.push(body);
	}

	destroyGround()
	{
		if (this.ground)
			this.world.DestroyBody(this.ground);
		if (this.ceiling)
			this.world.DestroyBody(this.ceiling);
	}

	getEntityByName(name)
	{
		return this.namedEntities[name];
	}

	getEntitiesByType(type)
	{
		var entityClass = typeof (type) === 'string';
		var a = [];
		for (var i = 0; i < this.entities.length; i++) {
			var ent = this.entities[i];
			if (ent instanceof entityClass && !ent._killed) {
				a.push(ent);
			}
		}
		return a;
	}

	sortEntities()
	{
		this.entities.sort(this.sortBy);
	}

	sortEntitiesDeferred()
	{
		this._doSortEntities = true;
	}

	update(delta, event)
	{
		let tick = delta;
		let velocityIterations = 100;
		let positionIterations = 100;

		this.world.Step(tick, velocityIterations, positionIterations);
		this.world.ClearForces();
		this.world.DrawDebugData();
	}

	jointBodies(bodA, bodB)
	{
		var def = new b2.b2RevoluteJointDef();
		def.bodyA = bodA.body;
		def.bodyB = bodB.body;
		def.collideConnected = true;
		def.dampingRatio = 100;
		def.localAnchorA.Set(0, -0.4);
		def.localAnchorB.Set(0, 0);
		def.upperAngle = Math.toRad(100);
		def.lowerAngle = Math.toRad(70);
		def.referenceAngle = Math.toRad(90);
		def.enableLimit = false;
		bodB.body.m_joint = bodA.body.m_joint = this.world.CreateJoint(def);
	}

	addContactListeners()
	{
		var b2Listener = new b2.b2ContactListener();
		this.world.SetContactListener(b2Listener);

		b2Listener.PreSolve = function (contact){
			var fixtureA = contact.GetFixtureA();
			var bodyA = fixtureA.GetBody();
			var userDataA = bodyA.GetUserData();

			var fixtureB = contact.GetFixtureB();
			var bodyB = fixtureB.GetBody();
			var userDataB = bodyB.GetUserData();

			if (userDataA && userDataA.preSolve)
				userDataA.preSolve(bodyB, fixtureB, userDataB, bodyA, fixtureA, contact);

			if (userDataB && userDataB.preSolve)
				userDataB.preSolve(bodyA, fixtureA, userDataA, bodyB, fixtureB, contact);
		};

		b2Listener.BeginContact = function(contact){
			var fixtureA = contact.GetFixtureA();
			var bodyA = fixtureA.GetBody();
			var userDataA = bodyA.GetUserData();

			var fixtureB = contact.GetFixtureB();
			var bodyB = fixtureB.GetBody();
			var userDataB = bodyB.GetUserData();

			if (userDataA && userDataA.beginContact)
				userDataA.beginContact(bodyB, fixtureB, userDataB, bodyA, fixtureA, contact);

			if (userDataB && userDataB.beginContact)
				userDataB.beginContact(bodyA, fixtureA, userDataA, bodyB, fixtureB, contact);
		};

		b2Listener.EndContact = function(contact){
			var fixtureA = contact.GetFixtureA();
			var bodyA = fixtureA.GetBody();
			var userDataA = bodyA.GetUserData();

			var fixtureB = contact.GetFixtureB();
			var bodyB = fixtureB.GetBody();
			var userDataB = bodyB.GetUserData();

			if (userDataA && userDataA.endContact)
				userDataA.endContact(bodyB, fixtureB, userDataB, bodyA, fixtureA, contact);

			if (userDataB && userDataB.endContact)
				userDataB.endContact(bodyA, fixtureA, userDataA, bodyB, fixtureB, contact);
		};

		b2Listener.PostSolve = function(contact){
			var fixtureA = contact.GetFixtureA();
			var bodyA = fixtureA.GetBody();
			var userDataA = bodyA.GetUserData();

			var fixtureB = contact.GetFixtureB();
			var bodyB = fixtureB.GetBody();
			var userDataB = bodyB.GetUserData();

			if (userDataA && userDataA.postSolve)
				userDataA.postSolve(bodyB, fixtureB, userDataB, bodyA, fixtureA, contact);

			if (userDataB && userDataB.postSolve)
				userDataB.postSolve(bodyA, fixtureA, userDataA, bodyB, fixtureB, contact);
		};
	}

	kill()
	{
		if (this.container) {
			this.container.removeAllEventListeners();
			this.container.removeAllChildren();
		}

		if (this._debugDraw && this.debugContainer) {
			this.debugContainer.removeAllChildren();
		}
	}
}

export default Physics;