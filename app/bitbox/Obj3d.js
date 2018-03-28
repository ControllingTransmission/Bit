
window.Obj3dAnimation = ideal.Proto.clone().newSlots({ 
    name: null,
    target: null,
    methodName: null,
	startTime: 0,
	runTime: 1,
	repeats: false,
}).setSlots({
    init: function() {        
        return this
    },
    
    currentTime: function() {
        return new Date().getTime()/1000
    },
    
    start: function() {
        this.setStartTime(this.currentTime())
        return this
    },
    
    endTime: function() {
        return this.startTime() + this.runTime()
    },
    
    isDone: function() {
        return this.dt() > this.runTime()
    },
    
    dt: function() {
        return this.currentTime() - this.startTime()
    },
    
    ratioDone: function() {
        var dt = this.dt()
        var ratio = Math.min(dt/this.runTime(), 1)
        return ratio
    },
                   
    update: function(time) {
        this.target()[this.methodName()].apply(this.target(), [this.dt(), this.ratioDone()])
    },
    
    removeIfDone: function() {
        if (this.isDone()) {
            this.target().removeAnimation(this)
        }
    },
})

// ------------------------------------------------------------------------------

window.Obj3d = ideal.Proto.clone().newSlots({
	protoType: "Obj3d",
	object3d: null,
	children: null,
	animations: null,
	targetPosition: null,
	targetRate: 0.04,
}).setSlots({
    init: function() {   
        this.setObject3d(new THREE.Object3D())
        this.setChildren([])
        this.setAnimations([])
    	return this
    },
    
    keydown: function(event, c) {
    },
    
    // animations
    
    addAnimation: function(anim) {
        this.animations().push(anim)
    },
    
    hasAnimation: function(anim) {
        if (anim.name() == null) { 
            return false 
        }
        
        return this.animations().detect((anAnim) => {
            return anAnim.name() == anim.name()
        })
    },
    
    addAnimationIfAbsent: function(anim) {
        if (!this.hasAnimation(anim)) {
            this.addAnimation(anim)
        }
    },
    
    removeAnimation: function(anim) {
        this.animations().remove(anim)
    },
	
	addToScene: function() {
	    setTimeout(() => { VizApp.addObj3d(this) }, 1)
	},
	
	removeFromScene: function() {
	    setTimeout(() => { VizApp.removeObj3d(this) }, 1)
	},
	
	update: function(time) {
	    this.animations().forEach((anim) => {
	        anim.update(time)
	    })
	    
	    this.animations().slice().forEach((anim) => {
	        anim.removeIfDone()
	    })
	    
	    this.children().forEach((child) => {
	        child.update(time)
	    })

	    if (this.targetPosition()) {
	        var d = this.targetPosition().clone().sub(this.object3d().position)
	        d.multiplyScalar(this.targetRate())
	        this.object3d().position.add(d)

            /*
	        if (d.length() < 0.1) {
	            this.chooseRandomTargetPosition()
            }
            */
            
	        if (d.length() < 0.01) {
	            //this.object3d().position = this.targetPosition()
	            this.setTargetPosition(null)
	        }
	    }
	},
	
	chooseRandomTargetPosition: function(r) {
	    if (!r) {
	        r = 20
	    }
	    var t = new THREE.Vector3()
	    /*
	    t.x = r * (Math.random()*2 - 1)
	    t.y = r * (Math.random()*2 - 1)
	    t.z = r * (Math.random()*2 - 1)
	    */
	    
	    t.x = r * (Math.random()*2 - 1)
	    t.y = r * (Math.random()*2 - 1)
	    t.z = r * (-Math.random()*2)
	    
	    this.setTargetPosition(t)
	    return this
	},
	
	addObject: function(obj) {
	    this.children().push(obj)
        this.object3d().add(obj.object3d())        
	},
	
	removeObject: function(obj) {
	    this.children().remove(obj)
        this.object3d().remove(obj.object3d())        
	},
	
    setScale: function(s) {
	    var o = this.object3d()
	    o.scale.x = s
	    o.scale.y = s
	    o.scale.z = s
	    return this
    },
    
    scale: function() {
        return this.object3d().x
    },
    
    setX: function(v) {
	    this.object3d().position.x = v
	    return this
    },
    
    setY: function(v) {
	    this.object3d().position.y = v
	    return this
    },
    
    setZ: function(v) {
	    this.object3d().position.z = v
	    return this
    },
    
    setColor: function(c) {
        this.object3d().material.color = c
    },

    grayColor: function() {
        return new THREE.Color("rgb(200, 200, 255)")
    },
    
    lightBlueColor: function() {
        return new THREE.Color("rgb(200, 200, 255)")
    },
    
    pinkColor: function() {
        return new THREE.Color("rgb(255, 200, 200)")
    },
    
    flatMaterial: function() {
        var material = new THREE.MeshPhongMaterial( {
            color: this.grayColor(),
            shading: THREE.FlatShading,
            shininess: 50,
        })
        
        material.transparent = true

        return material
    },
    
    keydown: function(event, c) {

    },
    
    shrinkAndRemove: function() {
        this._initialShrinkScale = this.object3d().scale.x
        this.addAnimation(Obj3dAnimation.clone().setTarget(this).setMethodName("shrinkAndRemoveAnim").setRunTime(1).start())
        setTimeout(() => { this.removeFromScene() }, 1000)
    },
    
    shrinkAndRemoveAnim: function(dt, r) {
        this.setScale(this._initialShrinkScale * Math.cos(r*Math.PI/2))
        if (r == 1) {
           // this.removeFromScene()
        }
    },
})

// ------


window.Obj3dThing = Obj3d.clone().newSlots({ 
	protoType: "Obj3dThing",
	modelPath: null,
	model: null,
	audioPath: null,
    audio: null,
    modelScale: 1,
}).setSlots({
    init: function() {        
        Obj3d.init.apply(this)
        
        this.loadModelIfNeeded()
        this.loadAudioIfNeeded()
        
        return this
    },
    
    // audio
    
    loadAudioIfNeeded: function() {
        if (this.audioPath()) {
            this.loadAudio() 
        }        
    },
    
    loadAudio: function() {
        this.setAudio(SharedResources.audioForPath(this.audioPath()))
        //this.setAudio(new Audio(this.audioPath()))
        return this
    },
    
    speak: function() {
        if (this.audio()) {
            this.audio().play()
        }
    },

    start: function() {
        this.speak()
    },
    
    // model
    
    loadModelIfNeeded: function() {
        if (this.modelPath()) {
            this.loadModel()
        }
    },
    
    loadModel: function() {
        //SharedResources.modelForPath(this.modelPath(), (object) => { this.loadedModel(object) })
        //return
        
        var loader = new THREE.OBJLoader();
        loader.load(this.modelPath(),
        	 ( group ) => {
        	    var object = group.children[0]
        	    group.remove(object)
        	    object.geometry.center()
	            object.material = this.flatMaterial()
                this.loadedModel(object)
        	},

        	function ( xhr ) {
        		//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        	},

        	function ( error ) {
        		console.log( 'obj load error: ', error );
        	}
        );
        

    },
    
    loadedModel: function(object) {
        this._model = object //.clone()
	    var s = this.modelScale()
	    this._model.scale.x = s
	    this._model.scale.y = s
	    this._model.scale.z = s
 	    this._model.material = this.flatMaterial()
	    this._model.material.color = this.materialColor()
        this.object3d().add(this._model)
    },    
})



window.SharedResources = ideal.Proto.clone().newSlots({ 
    protoType: "SharedResources",
    map: {},
}).setSlots({
    init: function() {
    },
    
    audioForPath: function(path) {
        var a = this.map()[path]
        if (a) {
            return a
        }
        
        var newAudio = new Audio(path)
        this.map()[path] = newAudio
        return newAudio
    },  
    
    modelForPath: function(modelPath, doneCallback) {
        var m = this.map()[modelPath]
        if (m) { 
            return m 
        }

        var loader = new THREE.OBJLoader();
        loader.load(modelPath,
        	 ( group ) => {
        	    var object = group.children[0]
                this.map()[modelPath] = object
        	    group.remove(object)
        	    object.geometry.center()
                doneCallback(object.clone())
        	},

        	function ( xhr ) {
        		//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        	},

        	function ( error ) {
        		console.log( 'obj load error: ', error );
        	}
        );
    },
})
        
