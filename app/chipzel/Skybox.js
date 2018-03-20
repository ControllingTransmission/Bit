function initSkybox(){
	var segments = 32
	var geometry = new THREE.SphereGeometry( 100000, segments, segments);
	var material = new THREE.MeshBasicMaterial( {
			side: THREE.DoubleSide,
			//side: THREE.BackSide,
			vertexColors: THREE.FaceColors,
		});
	material.side = THREE.DoubleSide
	// material.wireframe = true
	var skybox = new THREE.Mesh( geometry, material);

	skybox.segments = segments;
	skybox.pulseColors = [];
	skybox.on = true

    
	skybox.setColors = function(colorset) {
		this.colorset = colorset;
		var geometry = this.geometry;
		var length = geometry.faces.length;
		for(var i = 0; i < length; i++) {
			var color = new THREE.Color(colorset[0]);
			var hsl = color.getHSL();
			//console.log(hsl.h, hsl.s, hsl.l + Math.random()*0.05)
			geometry.faces[i].color.setHSL(hsl.h, hsl.s, hsl.l - Math.random()*0.07)
		}
		geometry.colorsNeedUpdate = true;
	}

	skybox.setSolidColor = function(color) {
		var geometry = this.geometry;
		var length = geometry.faces.length;
		for(var i = 0; i < length; i++) {
			geometry.faces[i].color.set(color)
		}
		geometry.colorsNeedUpdate = true;
	}

	skybox.twinkle = function() {
		this.setColors(this.colorset)
	}

	skybox.pulseColor = function(color) {
		this.pulseColors.push({color: color, start: null, duration: 1000})
	}

	skybox.toggle = function() {
		if(this.on) {
			this.on = false
			this.setSolidColor('#000000')
		} else {
			this.on = true
			this.twinkle()
		}
	}

	skybox.update = function(time) {
		if(this.pulseColors.length > 0) {
			for(var p=0; p<this.pulseColors.length; p++) {
				var pc = this.pulseColors[p];
				if(pc.start == null) { pc.start = time; continue; }

				var geometry = this.geometry;
				var faces = geometry.faces
				var length = faces.length;

				if(!pc.last) { pc.last = 0 }
				var elapsed = time - pc.start
				var needed = Math.ceil(elapsed/pc.duration/length)
				// console.log(pc.last);

				for(var x=pc.last; x<pc.last+needed; x++) {
				  faces[x].prevColor = faces[x].color
		    	faces[x].color.set(pc.color)
		    	geometry.colorsNeedUpdate = true;
		    }
		    pc.last += needed;
		    if(pc.last >= length) { this.pulseColors.splice(p, 1) }
		  }
	  }
	}

	skybox.setColors(['#00aaff'])


	// add it to the scene
	sceneCube.add( skybox);

	return skybox
}