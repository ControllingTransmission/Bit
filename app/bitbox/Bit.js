
window.Bit = Obj3d.clone().newSlots({
	protoType: "Bit",
	bitYes: null,
	bitIdleGroup: null,
	bitNo: null,
}).setSlots({
    init: function() {   
        Obj3d.init.apply(this)
        this.setScale(5)
        this.initParts()
        this.scaleIn()
    	return this
    },
    
    doBitYes: function() {
        this.bitYes().start()
        this.bitIdleGroup().startShrinkAnimation()       
    },
    
    doBitNo: function() {
        this.bitNo().start()
        this.bitIdleGroup().startShrinkAnimation()
    },
    
    keydown: function(event, c) {
        Obj3d.keydown.apply(this, [event, c])
        //console.log(this.protoType() + " keydown('" + c + "')")
                
        if(c == "Y") { 
            this.doBitYes()
        }
        
        if(c == "N") { 
            this.doBitNo()
        }
        
        if (c == "M") {
            this.chooseRandomTargetPosition()
        }
        
        if (c == "R") {
            if (Math.random() < 0.5) {
                this.shrinkAndRemove()
            }
        }
        
        if (c == "D") {
            var dup = this.duplicate()
            dup.chooseRandomTargetPosition()
            dup.addToScene()
        }
    },
    
    /*
    chooseRandomTargetPosition: function() {
        Obj3d.chooseRandomTargetPosition.apply(this)
          //  this.doBitYes()

        if (Math.random() < 0.33) {
            this.doBitYes()
        } else {
         if (Math.random() < 0.5) {
             this.doBitNo()
          }
        }
    },
    */
    
    duplicate: function() {
        var dup = this.clone()
        dup.object3d().position.copy(this.object3d().position)
        setTimeout(() => { dup.shrinkAndRemove() }, 5000)
        return dup
    },

    
    initParts: function() {
        this.setBitIdleGroup(BitIdleGroup.clone())
        this.addObject(this.bitIdleGroup())
        
        this.setBitYes(BitYes.clone())
        this.addObject(this.bitYes())    
     
        this.setBitNo(BitNo.clone())
        this.addObject(this.bitNo())      
    },

	update: function(time) {
        Obj3d.update.apply(this, [time])
	},
	
    scaleIn: function() {
         
        var s = this.object3d().scale.x
        //console.log("this.object3d().scale = ", this.object3d().scale)
        //console.log("s = ", s)
        this.setScale(0.001)
        
        var tween = new TWEEN.Tween(this.object3d().scale) 
        .to( { x:s, y:s, z:s }, 1000) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();            
    },
    
})





// -------------------------------------------------------------------------

window.BitYes = Obj3dThing.clone().newSlots({ 
	protoType: "BitYes",
	audioPath: "sounds/yes.wav",
	modelPath: "models/bit/bit_yes.obj",
	materialColor: new THREE.Color("rgb(237, 179, 84)"),
	modelScale: 0.02,
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        this.loadAudioIfNeeded()
        this.setScale(0.01)
        return this
    },
    
    start: function() {
        Obj3dThing.start.apply(this)
        this.addAnimation(Obj3dAnimation.clone().setTarget(this).setMethodName("inflateAndDeflate").setRunTime(1).start())
    },
                   
    inflateAndDeflate: function(dt, ratioDone) {
        this.setScale(0.1 + (0 + Math.sin(ratioDone * Math.PI)) * 1.5)
    }, 
    
//	    object.rotation.y = Math.PI*0.6
})

// -------------------------------------------------------------------------

window.BitNo = Obj3dThing.clone().newSlots({ 
	protoType: "BitNo",
	audioPath: "sounds/no.wav",
	modelPath: "models/bit/bit_no.obj",
	materialColor: new THREE.Color("rgb(237, 20, 20)"),
	modelScale: 0.02,
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        this.setScale(0.01)
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
    	    var rate = 0.0018
    	    //o.rotation.x += 0.01
    	    o.rotation.y += rate * Math.sin(time)
    	    o.rotation.z += rate * Math.cos(time)
        }
    },
	
    loadedModel: function(object) {
        Obj3dThing.loadedModel.apply(this, [object])
	    object.rotation.x = Math.PI/4
    },    
})


window.ShrinkOnKeyGroup = Obj3dThing.clone().newSlots({ 
	protoType: "ShrinkOnKeyGroup",
	shrinkKey: "S",
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        return this
    },

    keydown: function(event, c) {
        Obj3d.keydown.apply(this, [event, c])        
        console.log("ShrinkOnKeyGroup c = ", c)
        
        if(c == this.shrinkKey()) { 
            this.startShrinkAnimation()
        }
    },
    
	startShrinkAnimation: function() {
        this.addAnimation(Obj3dAnimation.clone().setTarget(this).setMethodName("shrinkAnimation").setRunTime(1).start())
    },
    
    shrinkAnimation: function(dt, ratioDone) {
        var s = Math.cos(ratioDone * Math.PI) * Math.cos(ratioDone * Math.PI)
        this.setScale(s * 0.9 + 0.1)
    },
})

window.BitIdleGroup = Obj3dThing.clone().newSlots({ 
	protoType: "BitIdleGroup",
	audioPath: null,
	modelPath: null,
	materialColor: null,
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        
        var p = PulsatingGroup.clone()
        this.addObject(p)
        
        var s = SpinningGroup.clone()
        p.addObject(s)
        
        s.addObject(BitIdleGroup1.clone())
        s.addObject(BitIdleGroup2.clone())
        return this
    },
	
	startShrinkAnimation: function() {
        this.addAnimation(Obj3dAnimation.clone().setTarget(this).setMethodName("shrinkAnimation").setRunTime(1).start())
    },
    
    shrinkAnimation: function(dt, ratioDone) {
        var s = Math.cos(ratioDone * Math.PI)*Math.cos(ratioDone * Math.PI)
        this.setScale(s*0.9 + 0.1)
    },
})



window.SpinningGroup = Obj3dThing.clone().newSlots({ 
	protoType: "SpinningGroup",
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        return this
    },
    
	update: function(time) {
        Obj3dThing.update.apply(this, [time])
        if (true) {
    	    var o = this.object3d()
    	    var r = 0.028
    	    //var r = 1.5
    	    //var t = Math.ceil(4 * time * 2)/4
    	    var t = time * 3 // (1 + Math.random()*0.001)
    	    //o.rotation.x += 0.01
    	    o.rotation.y += r * Math.sin(t)
    	    o.rotation.x += r * Math.cos(t) 
    	   // o.rotation.z += r * Math.sin(t*1.3) 
        }
        //this.setScale(1 + 0.03*Math.sin(time*10))
	},
})


window.PulsatingGroup = Obj3dThing.clone().newSlots({ 
	protoType: "PulsatingGroup",
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        return this
    },
    
	update: function(time) {
        Obj3d.update.apply(this, [time])
        this.setScale(1 + 0.03*Math.sin(time*10))
	},
})


window.BitIdleGroup1 = Obj3dThing.clone().newSlots({ 
	protoType: "BitIdleGroup1",
	audioPath: null,
	modelPath: "models/bit/bit_idle_1.obj",
	materialColor: new THREE.Color("rgb(200, 200, 255)"),
	modelScale: 0.03,
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        return this
    },
})


window.BitIdleGroup2 = Obj3dThing.clone().newSlots({ 
	protoType: "BitIdleGroup2",
	audioPath: null,
	modelPath: "models/bit/bit_idle_2.obj",
	materialColor: new THREE.Color("rgb(200, 200, 255)"),
	modelScale: 0.03,
}).setSlots({
    init: function() {        
        Obj3dThing.init.apply(this)
        return this
    },
    
	update: function(time) {
        var t = time * 1.9
        var s = Math.sin(t)*Math.sin(t)
        this.setScale(0.1 + 1.1*s)
	},
    
    loadedModel: function(object) {
        Obj3dThing.loadedModel.apply(this, [object])
	    object.rotation.x = Math.PI/2
    },    
})

        