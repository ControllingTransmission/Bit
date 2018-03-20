
    				
    				
window.Skybox = {
    _segments: 32,
    _pulseColors: [],
    _isOn: false,
    
    init: function() {
        
        // scene
        
    	this._sceneCube = new THREE.Scene();

        // camera
        
		this._skyCamera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000);
		this._skyCamera.rotation.speed = { x:0, y:0.001, z:0.001 }        
		
		// mesh
        
        
    	var geometry = new THREE.SphereGeometry( 5, this._segments, this._segments);
    	var material = new THREE.MeshBasicMaterial( {
    			side: THREE.DoubleSide,
    			//side: THREE.BackSide,
    			vertexColors: THREE.FaceColors,
    		});
    	material.side = THREE.DoubleSide
    	//material.wireframe = true
    	this._mesh = new THREE.Mesh( geometry, material);
    	this._mesh.segments = this._segments;
    	this._mesh.on = true
    	
	    //this.setColors(['#00aaff'])
	    this.setColors(['#ffaa00'])

	    // add it to the scene
	    this._sceneCube.add( this._mesh);
	
	    this._isOn = true
    	return this
    },
    
	setColors: function(colorset) {
		this._mesh.colorset = colorset;
		var geometry = this._mesh.geometry;
		var length = geometry.faces.length;
		
		for(var i = 0; i < length; i++) {
			var color = new THREE.Color(colorset[0]);
			var hsl = color.getHSL();
			//console.log(hsl.h, hsl.s, hsl.l + Math.random()*0.05)
			geometry.faces[i].color.setHSL(hsl.h, hsl.s, hsl.l - Math.random()*0.07)
		}
		
		geometry.colorsNeedUpdate = true;
		return this
	},

	setSolidColor: function(color) {
		var geometry = this._mesh.geometry;
		var length = geometry.faces.length;
		for(var i = 0; i < length; i++) {
			geometry.faces[i].color.set(color)
		}
		geometry.colorsNeedUpdate = true;
		return this
	},

	twinkle: function() {
		this.setColors(this._mesh.colorset)
		return this
	},

	pulseColor: function(color) {
		this._pulseColors.push(
		    { 
    		    color: color, 
    		    start: null, 
    		    duration: 1000 
		    }
		)
		return this
	},

	toggle: function() {
		if(this._on) {
			this._on = false
			this.setSolidColor('#000000')
		} else {
			this._on = true
			this.twinkle()
		}
	},
	
	render: function() {
	    //VizApp._renderer.render( this._sceneCube, this._skyCamera);
	    //VizApp._renderer.render( VizApp._scene, this._skyCamera);
    },

	update: function(time) {
	    if (!this._isOn) {
	        return this
	    }
	    
	
		this._skyCamera.rotation.x += this._skyCamera.rotation.speed.x
		this._skyCamera.rotation.y += this._skyCamera.rotation.speed.y
		this._skyCamera.rotation.z += this._skyCamera.rotation.speed.z
    				
		if(this._pulseColors.length > 0) {
			for(var p = 0; p< this._pulseColors.length; p++) {
				var pc = this._pulseColors[p];
				if(pc.start == null) { 
				    pc.start = time; 
				    continue; 
				}

				var geometry = this._mesh.geometry;
				var faces = geometry.faces
				var length = faces.length;

				if (!pc.last) { 
				    pc.last = 0 
				}
				
				var elapsed = time - pc.start
				var needed = Math.ceil(elapsed/pc.duration/length)
				// console.log(pc.last);

				for(var x = pc.last; x < pc.last + needed; x++) {
                    faces[x].prevColor = faces[x].color
                    faces[x].color.set(pc.color)
                    geometry.colorsNeedUpdate = true;
		        }
		        pc.last += needed;
		        if(pc.last >= length) { this.pulseColors.splice(p, 1) }
		    }
	    }
	    
	    //this.render()
	}
}