

window.Octahedron = Obj3d.clone().newSlots({ // 8 sides
	protoType: "Octahedron",
}).setSlots({
    init: function() {        
        Obj3d.init.apply(this)
        var mesh = new THREE.Mesh(new THREE.OctahedronGeometry(1), this.flatMaterial())
        //this._mesh.geometry.computeVertexNormals();
        this.setObject3d(mesh)
        return this
    },
})

window.Octahedron1 = Obj3d.clone().newSlots({ // 8 sides
	protoType: "Octahedron",
}).setSlots({
    init: function() {        
        Obj3d.init.apply(this)
        var mesh = new THREE.Mesh(new THREE.OctahedronGeometry(1, 1), this.flatMaterial())
        //this._mesh.geometry.computeVertexNormals();
        this.setObject3d(mesh)
        return this
    },
})


window.Dodecahedron = Obj3d.clone().newSlots({ // 12 sides
	protoType: "Dodecahedron",
}).setSlots({
    init: function() {        
        Obj3d.init.apply(this)
        var mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(1), this.flatMaterial())
        this.setObject3d(mesh)
        return this
    },
})

window.Dodecahedron1 = Obj3d.clone().newSlots({ // 12 sides
	protoType: "Dodecahedron1",
}).setSlots({
    init: function() {        
        Obj3d.init.apply(this)
        var mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 1), this.flatMaterial())
        this.setObject3d(mesh)
        return this
    },
})


window.Icosahedron = Obj3d.clone().newSlots({ // 20 sides
	protoType: "Icosahedron",
}).setSlots({
    init: function() {        
        Obj3d.init.apply(this)
        var mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1), this.flatMaterial())
        this.setObject3d(mesh)
        return this
    },
})
