var Gameboy = function(onloaded){
  THREE.Object3D.apply(this, arguments);
  this.renderOn = true;
  this.model = null;
  this.materials = null;
  this.bandname = null;
  this.gameboy = null;
  this.audioLines = []
  this.audioGain = 20;
  this.colorSet = 0;
  this.onloaded = onloaded;
  this.speed = {
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

  this.loadModel = function() {
    var onProgress = function ( xhr) {
      if ( xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        //console.log( Math.round(percentComplete, 2) + '% downloaded');
      }
    };

    var onError = function ( xhr) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader());

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl( 'models/gameboy/');
    mtlLoader.setPath( 'models/gameboy/');
    mtlLoader.load( 'gameboy.mtl', function( materials) {

      //console.log(materials);
      materials.preload();
      //console.log(materials);
      Gameboy.materials = materials

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( Gameboy.materials);
      objLoader.setPath( 'models/gameboy/');
      objLoader.load( 'gameboy.obj', function ( object) {
        object.position.y = -1.7;
        Gameboy.model = object;
        this.orient();

      }.bind(this), onProgress, onError);

    }.bind(this));
  }

  this.orient = function() {
    this.gameboy = Gameboy.model.clone()
    for(var c=0; c<Gameboy.model.children.length; c++) {
      this.gameboy.children[c].material = Gameboy.model.children[c].material.clone()
    }
    this.gameboy.children[3].material.side = THREE.DoubleSide
    this.add( this.gameboy);
    this.onloaded();
  }

  this.colorize = function(bodyColor) {
    this.gameboy.children[3].material.color = new THREE.Color(bodyColor)
  }

  this.colorizeScreen = function(screenColor) {
    var c = this.gameboy.children[4].material.color;
    c.set(screenColor)
    c.r += 1.5
    c.g += 1.5
    c.b += 1.5
  }

  this.resetScreen = function() {

  }

  this.addBandname = function() {
    this.bandname = new BandName(function() {
      this.position.set(0, 0.7999999999999999, 0.3)
      this.scale.set(0.019999999999999997, 0.019999999999999997, 0.000001)
      // this.bandname.position.set(-3.8, -8, -0.5)
    }).init();

    this.add(this.bandname);
  }

  this.addAudioline = function(position) {
    if(position) {
      var position = {
        x: (position.x) ? position.x : 0.03100000000000005,
        y: (position.y) ? position.y : 0.8,
        z: (position.z) ? position.z : 0.3
      }
    } else {
      var position = {
        x: 0.03100000000000005,
        y: 0.8,
        z: 0.3
      }
    }
    var audioLine = new AudioLine(function() {
      this.position.set(position.x, position.y, position.z)
      this.scale.set(0.0219, 0.019999999999999997, 0.019999999999999997)
    }).init();

    this.audioLines.push(audioLine)

    this.add(audioLine)
  }


  this.init = function() {

    if(Gameboy.model === undefined) { 
      console.log('not loaded');
      this.loadModel();
    } else {
      this.orient();
    }

    this.addBandname();
    // this.addAudioline();

    // this.bandname.speed.rotation.z = 0.1

    this.position.x = -6;
    this.position.y = 840;
    this.position.z = 2290;

    // this.position.y = 400;
    // this.position.z = 2000;

    this.scale.x = 200;
    this.scale.y = 200;
    this.scale.z = 200;

    //scene.add(this);

    return this
  };

  this.update = function() {
     var audioBin = Spectrum.audioBin()
    // this.rotation.y += 0.05
    // this.rotation.z += 0.05
    this.rotation.x += this.speed.rotation.x
    this.rotation.y += this.speed.rotation.y
    this.rotation.z += this.speed.rotation.z
    this.position.x += this.speed.position.x
    this.position.y += this.speed.position.y
    this.position.z += this.speed.position.z

    if(this.bandname) {
      this.bandname.update()
    }
    for(var l=0; l<this.audioLines.length; l++) {
      var line = this.audioLines[l]
      line.update(audioBin);
    }
  };
  
  this.pulse = function () {
      
      if (!this._baseScale) {
          this._baseScale = this.scale.clone()
          this._endScale = this.scale.clone().multiplyScalar(1.2)
      }
      var self = this

      var dt = 50
      new TWEEN.Tween(self.scale).to(self._endScale, dt)
         .onComplete(function() {
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

      this.bandname.pulse()      
  };

  this.warpAway = function () { this.bandname.warpAway() }
  this.warpBack = function () { this.bandname.warpBack() }
  this.twistOut = function () { this.bandname.twistOut() }
  this.twistBack = function () { this.bandname.twistBack() }
  this.startSpin = function () { this.bandname.startSpin() }
  this.stopSpin = function () { this.bandname.stopSpin() }

}
Gameboy.prototype = Object.create(THREE.Object3D.prototype);
// Planet.prototype.constructor = THREETree;