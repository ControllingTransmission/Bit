

document.addEventListener('DOMContentLoaded', () => { VizApp.init() }, false);

//$(document).ready(() => { VizApp.run() })

VizApp = {
    _container: null,
    _renderer: null,
    _objects: null,
    
    initCamera: function() {
		//this._camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
        
		this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
		this._camera.position.x = 0;
		this._camera.position.y = 1;
		this._camera.position.z = 15;
		
		//this._camera.lookAt(0, 200, 0)        
    },
    
    initScene: function() {
		this._scene = new THREE.Scene();
	    window.scene = this._scene        
    },
    
    initSpotlight: function() {
		var spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(-30, 60, 160);
        spotLight.target.position.set(0, 0, 0);
        
		spotLight.castShadow = true;
        /*

		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;

		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 4000;
		spotLight.shadow.camera.fov = 40;
*/
		this._scene.add( spotLight );
    },
    
    initAmbientLight: function() {
		var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5);
		this._scene.add( ambientLight );
    },
    
    /*
    
    initAmbientLight2: function() {
	    // amnient light 2
		var ambientLight2 = new THREE.AmbientLight( 0xffffff ); 
        this._scene.add( ambientLight2 )
    },
    
    initHemisphereLight: function() {
		var light = new THREE.HemisphereLight( 0xcccccc, 0x080820, 1 );
		window.light = light
		light.position.set( 0, 500, 3000 );
		this._scene.add( light );
    },    
    */
    
    initLights: function() {
		this.initSpotlight()
        this.initAmbientLight()
        //this.initHemisphereLight()
        //this.initAmbientLight2()        
    },
    
	init: function()  {
	    this._objects = []

        this.initCamera()
		this.initScene()
		this.initLights()

		this._renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		this._renderer.autoClear = false;

		this._container = document.createElement('div');
		document.body.appendChild(this._container);
		this._container.appendChild(this._renderer.domElement);
		window.addEventListener('resize', function() { VizApp.onWindowResize() }, false );

        setTimeout(() => {
			Skybox.init();
			
			var bit = Bit.clone()
		    this.addObj3d(bit)
		    
/*			
		    var s = 15
		    var d = 1
			for (var x = -d; x < d+1; x ++) {
			for (var y = -d; y < d+1; y ++) {
			for (var z = -d; z < d; z ++) {
                //var bit = Bit.clone().setX(x*s).setY(y*s).setZ(z*s)
                //var bit = KatamariPrince.clone().setX(x*s).setY(y*s).setZ(z*s)
			    var bit = KatamariBall.clone().setX(x*s).setY(y*s).setZ(z*s)
			    this.addObj3d(bit)
			    
			    //bit.chooseRandomTargetPosition()
		    }}}
		    */
		    this.animate();			        
           //Ground.shared().update()
        }, 1000)
        
        document.addEventListener('keydown', (event) => {
            var c = String.fromCharCode(event.keyCode)
            console.log("c1 = ", c)
            this._objects.forEach((obj) => { obj.keydown(event, c) })
        });
	},

    addObj3d: function(obj) {
		this._objects.push(obj)
		this._scene.add(obj.object3d())
		return obj
	},
	
	removeObj3d: function(obj) {
		this._objects.remove(obj)
		this._scene.remove(obj.object3d())
		return this
	},

	onWindowResize: function() 
	{
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize( window.innerWidth, window.innerHeight );
	},

	animate: function() 
	{
		requestAnimationFrame(() => { this.animate() });
		this.render();
	},

	render: function() 
	{
		var bins = Spectrum.timeStep()
        var time = new Date().getTime()/1000
        
		for(var i = 0; i < this._objects.length; i++) {
			var child = this._objects[i];
			
		    if (child.update) { 
		        child.update(time) 
		    }
		    
		    if (child.updateAudio) { 
		        child.updateAudio(bins) 
		    }
		}

/*
		TWEEN.update()
		
		if (window.Skybox) {
		    Skybox.update()
	    }
		
		Skybox.render()
		*/
		//this._scene.background = new THREE.Color( 0xff0000 );
		//this._scene.background = new THREE.Color( 0x2222ff );

        //renderer.setClearColor( new THREE.Color(0xff0000), 1);
		this._renderer.render(this._scene, this._camera);
	},
}
