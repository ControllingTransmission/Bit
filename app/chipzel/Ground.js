/*
    creates blocks of ground as we move 
*/

Block = ideal.Proto.extend().newSlots({
    type: "Block",
    geometry: null,
    mesh: null,
    planeWidth: 32,
    blockSize: 20000,
	audioGain: 20,
	sectionPos: null,
	rand: null,
	ground: null,
	isCameraSection: false,
	gameboy: null,
	bandname: null,
}).setSlots({
    init: function () {
        this._rand = Math.random() *.8 + .2
        this._planeWidth = Spectrum._fftSize
        
        this._geometry = new THREE.PlaneGeometry( 
            this.blockSize(), this.blockSize(), 
            this.planeWidth(), this.planeWidth() 
       )
        
        this._sectionPos = new THREE.Vector3(0, 0, 0)
		
		this._planeRandomization = []
		
		var length = this._geometry.vertices.length;
		
		for(var i = 0; i <= length; i++) {
			this._planeRandomization[i] = Math.random() * (i/length);
		}

		this._material = new THREE.MeshBasicMaterial( {
		//this._material = new THREE.MeshPhongMaterial( {
	    //this._material = new THREE.MeshLambertMaterial( {
			//side: THREE.FrontSide,
			//side: THREE.DoubleSide,
			side: THREE.FrontSide,
			vertexColors: THREE.FaceColors,
			wireframeLinewidth: 5,
			wireframe: true,
		});
				
        this._mesh = new THREE.Mesh( this._geometry, this._material);
		
		this._mesh.rotateX( degreesToRadians(-90))

	    if (Math.random() < .3) {
    	    this.addGameboy()
        } 
        else if (Math.random() < .3) {
    	    this.addBandName()
        }
    },
    
    position: function() {
        return this._mesh.position
    },
    
    obj: function () {
        if (this._gameboy) { return this._gameboy; }
        return this._bandname
    },
    
    bandnamePos: function () {
        if (this._bandname == null) { return null }
        return this.bandname().position.clone().add(this.position())
    },
    
    gameboyPos: function () {
      if (this._gameboy == null) { return null }
       return this.gameboy().position.clone().add(this.position())
    },
    
    objPos: function () {
        var p = this.bandnamePos()
        if (p) { return p }
        return this.gameboyPos()
    },

    addGameboy: function () {
        if (this._gameboy) { return }
        
	    this._gameboy = addGameboy()
        //this.scene().remove(this._gameboy)
		this._gameboy.rotateX( degreesToRadians(90))
		this._gameboy.position.z = 840
		this._gameboy.position.y = -2000
	    this._mesh.add(this._gameboy)
    	return this
    },
    
    addBandName: function () {
        if (this._bandname && !this._gameboy) { return }
      	var bn = new BandName(function(){ /* console.log('loaded'); */ }).init();
		bn.position.set(0, -2000, 1000)
		bn.scale.set(100, 100, 100)
		bn.rotateX( degreesToRadians(80))
		//bn.speed.rotation.y = Math.PI/400
		bn.needsUpdate = true
    	this._mesh.add(bn)
    	this._bandname = bn
    	return this
    },
    
    
    colorForIndex: function (i) {
        var stripeWidth = 7
		var color = new THREE.Color(this._colorset[Math.floor(i/(this.planeWidth()*2)/stripeWidth)]);
		var hsl = color.getHSL();   
		return hsl     
    },
    
    updateColors: function() {
		var i = Math.abs(this.sectionPos().z) % COLORSETS.length
		this._colorset = COLORSETS[i]
		
		var geometry = this._mesh.geometry;
		var length = geometry.faces.length;
		for(var i = 0; i < length; i++) {
			var hsl = this.colorForIndex(i)
			geometry.faces[i].color.setHSL(hsl.h, hsl.s, hsl.l - Math.random()*0.07)
		}
		geometry.colorsNeedUpdate = true;
	},
    
        
	add: function()
	{
		this.scene().add(this.mesh())
		return this
	},

	remove: function()
	{
		this.scene().remove(this.mesh())
		
		/*
		if (this._gameboy) {   
		    this._gameboy.remove()
		}
		*/
		return this
	},

    update: function () {
        camera.position        
    },
    
    scene: function() {
        return window.scene
    },
    
    /*
    sectionPos: function() {
        var p = this._mesh.position
        var s = this.blockSize()
        return new THREE.Vector3( Math.floor(p.x/s), Math.floor(p.y/s), Math.floor(p.z/s));
    },
    */
    
    setSectionPos: function(p) {
        this._sectionPos = p.clone()
        var newPos = p.multiplyScalar(this.blockSize())
        //console.log("setSectionPos newPos ", newPos)
        this._mesh.position.z = newPos.z
        this._mesh.position.x = newPos.x
        this.updateColors()
        return this
    },

/*
    shouldUpdateAudio: function() {
	    var sp = this.sectionPos()
	    return sp.x % 2 == 0 && sp.z % 2 == 0        
    },
*/

    mode: function () {
        return this.ground().mode()
    },
    
	updateAudio: function(t) {
	    var audioBins = Spectrum.audioBin()
	    
	    if (audioBins === undefined) {
//	        console.log("Ground.js: audioBins === undefined, will wait until it's defined to update from audio")
	        return 
	    }
	    
	    this._material.wireframe = this.ground().wireframe()
	    
        //if (this.isCameraSection()) {
            if (this._gameboy) {
                this._gameboy.update()
            }
        //}
        
        if (this._bandname) {
            this._bandname.update()
        }
        
		var g = this._geometry
		var pw = this.planeWidth()+1
		var p = this._mesh.position
		var bs = this.blockSize()
    	var mode = this.mode()

		var ymax = pw
		for(var y = 0; y < ymax; y ++) {
		    for(var x = 0; x < pw; x ++) {
		        var i = y*pw + x
                
    			if (mode == "wave") {
    			    
    			    g.vertices[i].z = Math.sin(2*Math.PI*y/(pw-1) + 2*Math.PI*x/(pw-1) + t/20)*400 
 
                } else if (mode == "wave2")  {
                    
    			   g.vertices[i].z = Math.sin(2*Math.PI*y/(pw-1) - 2*Math.PI*x/(pw-1) + t/20)*400 

                } else if (mode == "pause")  {
                    
		            
                } else if (mode == "spikewaves")  {

                    var v = y % 2 + x % 2
    			    g.vertices[i].z = v * 200 *  Math.sin(2*Math.PI*y/(pw-1) - 2*Math.PI*x/(pw-1) + t/20) 
    			    //g.vertices[i].z += Math.sin(2*Math.PI*y/(pw-1) - 2*Math.PI*x/(pw-1) + t/20)*400 
                                          			    
                } else if (mode == "other")  {
    			    
    			    var v = 0
    			    v = Math.sin(2*Math.PI*y/(pw-1) + t/25) 
    			    v += Math.sin(2*Math.PI*x/(pw-1) + t/15) 
    			        
    			    g.vertices[i].z = v * 400 

                                          			    
                } else if (mode == "evolve")  {
                    
            		var xx = this._mesh.position.x + bs*x/(pw-1)
            		var yy = this._mesh.position.z + bs*y/(pw-1)
		
		            var dx = Math.sin(t/20 + xx/2000)
		            var dy = Math.sin(t/20 + yy/2000)
    			    g.vertices[i].z = (dy + dx)*400
    			   
                                        
                } else if (mode == "equalizer")  {
                    
                    var r = x/(pw -1)
		        
    		        if (x/pw > .5) {
    		            // map .5 -> 1 to 0 -> 1
    		           r = 2 * (r - .5)
    		        } else {
    		            // map 0 -> .5 to 1 -> 0
    		            r = 1 - r * 2
    		        }
		        
    		        r = r*.5
		        
    		        if (r < 0 || r > 1) {
    		            throw "invalid r " + r
    		        }
		        
    		        var b = Math.floor((audioBins.length - 1) * r)
		        
        			//var v = Math.pow(audioBins[b] * 4, 1.4)
        			var v = Math.pow(audioBins[b] * 2, 1.4)
        			var ydamp = 1/(1 + Math.abs(ymax/2 - y))
                    v = v * ydamp*ydamp
                
    			    g.vertices[i].z = v 
                }

		    }
		}
		
        if (mode == "colors")  {
		    g.colorsNeedUpdate = true;
		} else {
		    g.verticesNeedUpdate = true;
        }
		
		return this
	},
})

// ----------------------------------------------------------

//Ground.shared().currentBlock().gameboy()


Ground = ideal.Proto.extend().newSlots({
    type: "Ground",
    blocks: null,
    t: 0,
	mode: "equalizer", // "wave", "wave2", "equalizer", "random", "pause"
	currentBlock: null,
	wireframe: false,
	blockPool: null,
}).setSlots({
    init: function () {
        this.setBlocks([])
        this.setBlockPool([])
        
        //var block = Block.clone().add()
        //this.blocks().push(block)
        this.addBlockForSectionPos(this.cameraSectionPos())
    },
    
//    setMode: function (
    
    updateAudio: function() {
        this._t ++
        var self = this
        this.blocks().forEach(function (block) { block.updateAudio(self._t) })
        return this
    },
    
    shared: function() {
        if (!this._shared) {
            this._shared = Ground.clone();
        }
        return this._shared;
    },
    
    cameraSectionPos: function() {
        var p = camera.position
        var s = Block.blockSize()
        return new THREE.Vector3( Math.floor(p.x/s), Math.floor(p.y/s), Math.floor(p.z/s));
    },
    
    hasBlockForSectionPos: function(p) {
        var r = this.blocks().detect(function (block) {
            return block.sectionPos().z == p.z && block.sectionPos().x == p.x
        }) != null        
        return r
    },
        
    addBlockForSectionPos: function(p) {
        if (this.blocks().length > 100) { 
            console.log("too many blocks")
            return
        }

        var block = this.newBlock().setSectionPos(p)
        return this   
    },
    
    newBlock: function() {
        var block = this.blockPool().pop()
        if (!block) {
            block = Block.clone()
        }
        block.setGround(this)
        this.blocks().push(block)
        block.add()
        return block
    },
    
    removeBlock: function(block) {
        //console.log("removing block ", block.sectionPos())
        this.blocks().remove(block)
        block.remove()
        this.blockPool().push(block)
        return this
    },
    
    removeDistantBlocks: function() {      
        var p = this.cameraSectionPos()
        var self = this
        this.blocks().copy().forEach(function (block) {
            
            var dz = Math.abs(block.sectionPos().z - p.z)
            if (dz > 4) { 
                self.removeBlock(block)
            }
            
            var dx = Math.abs(block.sectionPos().x - p.x)
            if (dx > 4) { 
                self.removeBlock(block)
            }
            
            var same = dx == 0 && dz == 0
            block.setIsCameraSection(same)
            
            if (same) { 
                self.setCurrentBlock(block) 
            }
        })
          
    },
    
    update: function () {
        var cp = this.cameraSectionPos()
        var p = cp.clone()
        
        //var r = 2
        for (var dz = -2; dz <= 2; dz ++) {
            p.z = cp.z + dz
 
             for (var dx = -2; dx <= 2; dx ++) {
                p.x = cp.x + dx
                       
                if (!this.hasBlockForSectionPos(p)) {
                     this.addBlockForSectionPos(p)
                }
            }
        }
        
        this.removeDistantBlocks()
        return this
    },

    toggleWireframe: function () {
        this._wireframe = !this._wireframe
        return this
    },

    blocksWithBandname: function() {
        return this.blocks().filter(function (block) {
            return block.bandname() != null
        })
    },
        
    blocksWithGameboy: function() {
        return this.blocks().filter(function (block) {
            return block.gameboy() != null
        })
    },
    
    randomBandnamePos: function () {
        var blocks = this.blocksWithBandname()
        if (blocks.length == 0) { return null }
        var block = blocks[Math.floor(Math.random()*blocks.length)]
        
        return block.objPos()
    },
    
    randomGameboyPos: function () {
        var blocks = this.blocksWithGameboy()
        if (blocks.length == 0) { return null }
        var block = blocks[Math.floor(Math.random()*blocks.length)]
        
        return block.objPos()
    },
    
    performOnBlockObjects: function(msg) {
        this.blocks().forEach(function (block) {
            var obj = block.obj()
            if (obj && obj[msg]) {
                obj[msg].apply(obj)
            }
        })
        
    },
    
})
