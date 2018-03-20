var THREETree = function(){
	THREE.Object3D.apply(this, arguments);
	this.trunkTop = null
	this.trunkRadians = null
	this.color = new THREE.Color('#ffffff')
	this.wireframe = false
	// this.prototype = new THREE.Object3D();
	this.init = function(){
		scene.add(this)
		this.scale = {x:2,y:1.5,z:2}
		this.rotation.speed = {x:0,y:0,z:0}

		// this.position.y -= 800
		return this
	},
	this.step = function(){
		var children = this.children.slice(0)

		for(var c=0; c<children.length; c++){
			var child = children[c]
			scene.remove(child)
			this.remove(child)
		}
		this.trunkTop = null
		this.makeBranch();//x, z, y, height, angle
	},
	this.addObject = function(object){
		this.add(object)
	},
	this.degreesToRadians = function(angle){
		//Angle supplied in degrees, needs to be converted to degreesToRadians
		return angle * (Math.PI / 180);
	},
	this.random = function(r1, r2){
		//Pick a random number between r1 and r2
		//More useful than Math.random() which is between 0 and 1
		return ((Math.random()*(r2 - r1)) + r1);
	},
	this.weightedRandom = function(){
		//More likely to return true than false
		var val = Math.round(Math.random()*10);
		switch(val){
			case 1:
			case 5:
			case 2:
				return false;
			default:
				return true;
		}
	},
	this.debugaxis = function(){
		//Axis array[x,y,z]
		var info = [[-800,0,0,800,0,0,0xff0000],[0,-800,0,0,800,0,0x00ff00],[0,0,-800,0,0,800,0x0000ff]];
		
		//Draw some helpfull axis
		for(i=0;i<3;i++){
			material = new THREE.MeshBasicMaterial();
			material.color = this.color
			geometry = new THREE.Geometry();
			
			//Define the start point
			particle = new THREE.Particle(material);
			particle.position.x = info[i][0];
			particle.position.y = info[i][1];
			particle.position.z = info[i][2];
			
			//Add the new particle to the scene
			this.add(particle);
			
			//Add the particle position into the geometry object
			geometry.vertices.push( new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z));
			this.remove(particle)
			
			//Create the second point
			particle = new THREE.Particle(material);
			particle.position.x = info[i][3];
			particle.position.y = info[i][4];
			particle.position.z = info[i][5];
			
			//Add the new particle to the scene
			this.add(particle);
			
			//Add the particle position into the geometry object
			geometry.vertices.push( new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z));
			this.remove(particle)
			
			//Create the line between points
			var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: info[i][6], opacity: 0.8, linewidth: 1 }));
			this.add(line);
		}
	},
	this.setColor = function(THREEcolor){
		for(var c=0; c<this.children.length; c++){
			if(this.children[c].material){
				this.children[c].material.color = THREEcolor
				this.children[c].material.needsUpdate = true
			}
		}
		this.color = THREEcolor
	}
	this.setMaterialWireframe = function(wireframe){
		for(var c=0; c<this.children.length; c++){
			if(this.children[c].material){
				this.children[c].material.wireframe = wireframe
				this.children[c].material.needsUpdate = true
			}
		}
		this.wireframe = wireframe
	}
	this.makeBranch = function(){
		if(this.trunkTop == null)
			this.trunkTop = {x:0, y:0, z:0}
		if(this.trunkRadians == null)
			this.trunkRadians = this.degreesToRadians(90)
		this.branch(this.trunkTop.x, this.trunkTop.y, this.trunkTop.z, 200, this.degreesToRadians(90)+this.degreesToRadians(this.random(-17, 17)))
	}
	this.branch = function(x, y, z, length, angle){//Start position of the tree base (x,y,z), length and angles
		//Setup new material and geometry
		material = new THREE.MeshBasicMaterial();
		material.color = this.color
		geometry = new THREE.Geometry();
		
		//Define the start point
		particle = new THREE.Particle(material);
		particle.position.x = x;
		particle.position.y = y;
		particle.position.z = z;
					
		//Add the new particle to the scene
		this.add(particle);
		
		//Add the particle position into the geometry object
		geometry.vertices.push( new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z));
		this.remove(particle)
		
		//Create the second points where the branches end
		var newx = x + Math.cos(angle) * length;
		var newy = y + Math.sin(angle) * length;
		var newz = z - Math.sin(angle) * this.random(-50, 50);
		
		//Create the second point
		particle = new THREE.Particle(material);
		particle.position.x = newx;
		particle.position.y = newy;
		particle.position.z = newz;

		if(this.trunkTop == null)
			this.trunkTop = {x:particle.position.x, y:particle.position.y, z:particle.position.z}
		if(this.trunkRadians == null)
			this.trunkRadians = angle

		//Add the new particle to the scene
		this.add(particle);
		
		//Add the particle position into the geometry object
		geometry.vertices.push( new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z));
		this.remove(particle)
		
		var lineWidth = length * 0.03;
		
		//Create the line between points
		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial({opacity: 0.8, linewidth: lineWidth}));
		line.material.color = this.color
		this.add(line);
		
		//Create multiple branches, if still long branches add a new set
		if(length > 17){
			//First: branch calls itself, positioned at the end of older brance, random angle between these values
			this.branch(newx, newy, newz, length * (this.random(0.55, 0.80)), angle - this.degreesToRadians(this.random(17, 12)));
			
			
			for(var x=0; x<3; x++){
				if(!this.weightedRandom()){
					//Second: branch calls itself, positioned at the end of older brance, random angle between these values
					this.branch(newx, newy, newz, length * (this.random(0.55, 0.80)), angle + this.degreesToRadians(this.random(17, 12)));
				}
			}
		} else {
			/*var material = new THREE.ParticleCanvasMaterial({
				color: Math.random() * 0x808008 + 0x808080,
				program: function (context) {
					context.beginPath();
					context.arc(0, 0, 1, 0, tau, true);
					context.closePath();
					context.fill();
				}
			});
			
			//Add a "flower" to the end of the branch
			flower = new THREE.Particle(material);
			flower.position.x = newx;
			flower.position.y = newy;
			flower.position.z = newz;
			flower.scale.x = flower.scale.y = flower.scale.z = this.random(100, 200);
			this.add(flower);*/
		}
	}
}
THREETree.prototype = Object.create(THREE.Object3D.prototype);
THREETree.prototype.constructor = THREETree;
// THREETree.prototype = Object.create(THREE.Object3D.prototype)

TreeField = function(){
	this.trees = []
	this.init = function(){
		var tree = new THREETree();
		tree.init()
		tree.branch(0, 0, 0, 250, this.degreesToRadians(90));//x, z, y, height, angle
		trees.push(tree)
	}
	this.addRow = function(){

	}
}