
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
        Obj3dThing.loadedModel.apply(this, [object])
	    object.rotation.x = -Math.PI/2
	    object.rotation.z = -Math.PI
    },    
    
	update: function(time) {
        Obj3d.update.apply(this, [time])
        
        if (true) {
    	    var o = this.object3d()
    	    //o.rotation.x += 0.01
    	    o.rotation.y += 0.018 
    	    //o.rotation.z += 0.018 * Math.cos(time)
        }
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

