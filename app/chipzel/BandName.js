var BandName = function(onloaded){
  THREE.Object3D.apply(this, arguments);
  this.renderOn = true;
  this.name = null;
  this.model = null;
  this.audioGain = 20;
  this.colorSet = 0;
  this.onloaded = (onloaded) ? onloaded : function(){};
  this.speed = {
      /*
      rotation: new THREE.Vector3( 0, 0, 0),
      position: new THREE.Vector3( 0, 0, 0),
      scale: new THREE.Vector3( 0, 0, 0),
      */
    rotation: {
      x: 0,
      y: 0,
      z: 0
    },
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    scale: {
      x: 0,
      y: 0,
      z: 0
    }
  }

  this.loadModel = function(){
    var onProgress = function ( xhr) {
      if ( xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded');
      }
    };

    var onError = function ( xhr) {
    };

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total) {

      console.log( item, loaded, total);

    };
    var loader = new THREE.OBJLoader( manager);
    loader.load( 'models/chipzel/chipzel-name.obj', function ( object) {

      object.traverse( function ( child) {

        if ( child instanceof THREE.Mesh) {

          // child.material.map = texture;

        }

      });

      object.position.x = -3.8;
      object.position.y = -8
      BandName.model = object

      this.orient();

    }.bind(this), onProgress, onError);
  }

  this.orient = function(){
    // this.scale.x = 1;
    // this.scale.y = 1;
    // this.scale.z = 1;

    this.bandname = BandName.model.clone()
    for(var c=0; c<BandName.model.children.length; c++) {
      this.bandname.children[c].material = BandName.model.children[c].material.clone()
    }
    this.add(this.bandname)

    this.onloaded()
  }

  this.init = function(){

    if(BandName.model === undefined) { 
      console.log('not loaded');
      this.loadModel();
    } else {
      this.orient();
    }

    return this
  };

  this.update = function(){
    // this.rotation.x += 0.05
    // this.rotation.z += 0.05
    /*
    this.rotation.add(this.speed.rotation)
    this.position.add(this.speed.position)
    */

    this.rotation.x += this.speed.rotation.x
    this.rotation.y += this.speed.rotation.y
    this.rotation.z += this.speed.rotation.z
    
    this.position.x += this.speed.position.x
    this.position.y += this.speed.position.y
    this.position.z += this.speed.position.z
  };
  
  this.pulse = function () {
      
      if (!this._baseScale) {
          this._baseScale = this.scale.clone()
          this._endScale = this.scale.clone().multiplyScalar(1.2)
      }
      var self = this

      var dt = 10
      new TWEEN.Tween(self.scale).to(self._endScale, 10)
         .onComplete(function() {
            console.log("complete")
            new TWEEN.Tween(self.scale).to(self._baseScale, dt).start();
        })        
        .start();        
  };
  
  this.pulseBig = function () {
      
      if (!this._baseScale) {
          this._baseScale = this.scale.clone()
          this._endScale = this.scale.clone().multiplyScalar(2)
      }
      var self = this

      var dt = 50
      new TWEEN.Tween(self.scale).to(self._endScale, dt)
         .onComplete(function() {
            new TWEEN.Tween(self.scale).to(self._baseScale, dt).start();
        })        
        .start();        
  };

  this.spin = function () {
      console.log("bandname spin")

      var self = this
      var nextRotation = this.rotation.clone()
      nextRotation.x += 2*Math.PI
      nextRotation.z += 2*Math.PI
      var tween = new TWEEN.Tween(this.rotation)
        .to({ x: nextRotation.x, z: nextRotation.z }, 100)
        .start(); 
  };


  this.warpAway = function(index, object){
    var o = this.children[0].children
    for(var x=0; x<o.length; x++){
      var index = x
      var object = o[x]
      var scale = 10
      if(object.tween) { object.tween.stop() }
      object.tween = new TWEEN.Tween(object.position)
        .to({ x: (Math.random()-0.5)*scale, y: (Math.random()-0.5)*scale}, 100)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();
    }
  }

  this.warpBack = function(index, object){
    var o = this.children[0].children
    for(var x=0; x<o.length; x++){
      var index = x
      var object = o[x]
      if(object.tween) { object.tween.stop() }
      object.tween = new TWEEN.Tween(object.position)
        .to({ x: 0, y: 0, z: 0 }, 100)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();
    }
  }

  this.twistOut = function(){
    var o = this.children[0].children
    for(var x=0; x<o.length; x++){
      var index = x
      var object = o[x]
      if(object.tween) { object.tween.stop() }
      object.tween = new TWEEN.Tween(object.rotation)
        .to({ z: degreesToRadians(45 * (Math.random()-0.5)) }, 100)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();
    }
  }

  this.twistBack = function(){
    var o = this.children[0].children
    for(var x=0; x<o.length; x++){
      var index = x
      var object = o[x]
      if(object.tween) { object.tween.stop() }
        object.tween = new TWEEN.Tween(object.rotation)
          .to({ z: degreesToRadians(0) }, 100)
          .easing(TWEEN.Easing.Quadratic.In)
          .start();
    }
  }

  this.startSpin = function(){
    this.speed.rotation.y = 0.05
  }
  
   this.stopSpin = function(){
        this.speed.rotation.y = 0
        new TWEEN.Tween(this.rotation)
                  .to({ y: 0 }, 100)
                  .easing(TWEEN.Easing.Quadratic.In)
                  .start();
   }

   this.startSpinZ = function(){
       this.speed.rotation.z = 0.01

   }   
   
   this.stopSpinZ = function(){
        this.speed.rotation.z = 0
        new TWEEN.Tween(this.rotation)
                  .to({ z: 0 }, 100)
                  .easing(TWEEN.Easing.Quadratic.In)
                  .start();
   }   
  

}
BandName.prototype = Object.create(THREE.Object3D.prototype);
// Planet.prototype.constructor = THREETree;