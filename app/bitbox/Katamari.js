
window.KatamariPrince = Obj3dThing.clone().newSlots({ 
	protoType: "KatamariPrince",
	audioPath: null,
	modelPath: "models/katamari/prince.obj",
	materialColor: new THREE.Color("rgb(237, 179, 84)"),
	modelScale: 0.1,
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        this.setScale(1)
        return this
    },
    
    start: function() {
        Obj3dThing.start.apply(this)
        this.addAnimation(Obj3dAnimation.clone().setTarget(this).setMethodName("inflateAndDeflate").setRunTime(1).start())
    },
    
    inflateAndDeflate: function(dt, ratioDone) {
        this.setScale(0.1 + (0 + Math.sin(ratioDone * Math.PI)) * 1.5)
    },
    
    loadedModel: function(object) {
        console.log("kat loadedModel")
        this._model = object
        Obj3dThing.loadedModel.apply(this, [object])
	    object.rotation.x = -Math.PI/2
	    object.rotation.z = -Math.PI
	    this.useTexture()
        this.setOpacity(0)
    },    
    
    useTexture: function() {
        this._isUsingTexture = true
	    //var texture = new THREE.TextureLoader().load('images/gifs/0.gif')
	    var texture = new THREE.TextureLoader().load('images/1.jpg')
	    
	    //texture.repeat.set(10, 10);
	    
	    /*
	    texture.repeat.set(0.5, 1);
        // scale x2 vertical
        texture.repeat.set(1, 0.5);
        // scale x2 proportional
        texture.repeat.set(0.5, 0.5);
        */

/*
        var o = this._model.geometry
        console.log("o = ", o)
        o.computeFaceNormals();
        o.computeCentroids();
        o.computeVertexNormals();
        o.doubleSided = true;

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.NearestFilter
*/
        var material = new THREE.MeshBasicMaterial({ map: texture})
        this._model.material = material        
    },
    
    useFlatMaterial: function() {
        this._isUsingTexture = false
        this._model.material = this.flatMaterial()        
    },
    
    
	update: function(time) {
        Obj3d.update.apply(this, [time])
        
        if (true) {
    	    var o = this.object3d()
    	    //o.rotation.x += 0.01
    	    //o.rotation.y += 0.018 
    	    //o.rotation.z += 0.018 * Math.cos(time)
    	    //this.setScale(
        }
        
        if ( this._model && !this._isUsingTexture) {
            var r = Math.floor(255 * (0.5 + 0.5*Math.sin(2 * time)) )
            var b = Math.floor(255 * (0.5 + 0.5*Math.cos(3 * time)) )
            var g = Math.floor(255 * (0.5 + 0.5*Math.cos(5 * time)) )
            var c = new THREE.Color("rgb(" + r + "," + g + "," + b + ")")
            this._model.material.color = c
        }
	},
	
    keydown: function(event, c) {
        Obj3d.keydown.apply(this, [event, c])
        //console.log(this.protoType() + " keydown('" + c + "')")

        if(c == "H") { 
            this.useTexture()
        } 
        if(c == "J") { 
            this.useFlatMaterial()
        }                  
        /*    
        if(c == "Y") { 
            this.bitYes().start()
            this.bitIdleGroup().startShrinkAnimation()
        }
        */
        
        /*
        if (c == "D") {
            var ball = KatamariBall.clone()
            ball.object3d().position.copy(this.object3d().position)
            ball.chooseRandomTargetPosition()
            ball.addToScene()
        }
        */
        
        if (c == "L") {
            this.shrinkAndRemove()
        }
        
        if (c  == "O") {
            this.fadeOut()
        }
        
        if (c  == "P") {
            this.fadeIn()
        }
    },
    
    setOpacity: function(v) {
        this._model.material.opacity = v
    },
    
    fadeOut: function() {
         var tween = new TWEEN.Tween(this._model.material) // Create a new tween that modifies 'coords'.
        .to({ opacity: 0 }, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
        })
        .start(); // Start the tween immediately.           
    },
    
    fadeIn: function() {
         var tween = new TWEEN.Tween(this._model.material) // Create a new tween that modifies 'coords'.
        .to({ opacity: 1 }, 1000) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function() { // Called after tween.js updates 'coords'.
            // Move 'box' to the position described by 'coords' with a CSS translation.
        })
        .start(); // Start the tween immediately.           
    },
})

// -------------------------------------------------------------------------

window.KatamariBall = Obj3dThing.clone().newSlots({ 
	protoType: "KatamariBall",
	audioPath: null,
	modelPath: "models/katamari/ball.obj",
	materialColor: new THREE.Color("rgb(255, 80, 200)"),
	modelScale: 0.1,
	targetRate: 0.01,
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        this.setScale(1)
        return this
    },
    
    start: function() {
        Obj3dThing.start.apply(this)
        this.addAnimation(Obj3dAnimation.clone().setTarget(this).setMethodName("inflateAndDeflate").setRunTime(1).start())
    },
                   
    inflateAndDeflate: function(dt, ratioDone) {
        this.setScale(0.01 + (0 + Math.sin(ratioDone * Math.PI)) * 1.5)
    }, 
    
	update: function(time) {
        Obj3d.update.apply(this, [time])
        if (true) {
    	    var o = this.object3d()
    	    var rate = 0.058
    	    //o.rotation.x += 0.01
    	    o.rotation.z -= rate 
    	    //o.rotation.z += rate * Math.cos(time)
        }
	},
	
   loadedModel: function(object) {
        Obj3dThing.loadedModel.apply(this, [object])
	    object.rotation.x = Math.PI/4
    },    
})

