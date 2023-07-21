
class Scene extends createjs.Container {
	constructor() {
		super();
	}

	preload() {
		return new Promise((resolve) => {
			resolve();
		});
	}

	build() { }

	animateIn() {
		return new Promise((resolve) => {
			resolve();
		});
	}

	setActive(active) { }

	start() { }

	end() { }

	animateOut() {
		return new Promise((resolve) => {
			resolve();
		});
	}

	unload() { }

	resize(width, height) { }
}

export default Scene;