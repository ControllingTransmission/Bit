var Planet = function(){
	THREE.Object3D.apply(this, arguments);
	this.ground = null;
	this.trees = [];
	this.init = function(){
		var ground = createShape(2);

		this.growTree()
		this.ground = ground
		this.add(ground)

		scene.add(this)

		var direction = planets.length%2?1:-1
		this.position.z-=planets.length*1000
		this.position.y+=planets.length*200
		this.position.x+=planets.length*1000*direction
		this.rotation.speed = {x:0,y:0,z:0}

		planets.push(this)
		return this
	};
	this.growTree = function(){
		var tree = new THREETree();
		tree.init()
		var direction = this.trees.length%2?1:-1
		tree.branch(0, 0, 0, 250, tree.degreesToRadians(90+this.trees.length*30*direction));
		this.add(tree)
		this.trees.push(tree)
		return tree
	};
	this.closeTree = function(){
		this.remove(this.trees[this.trees.length-1])
		this.trees.pop()
	}
	this.close = function(){
		scene.remove(this)
		planets.pop()
	}
}
Planet.prototype = Object.create(THREE.Object3D.prototype);
Planet.prototype.constructor = THREETree;