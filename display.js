viz = viz || {};
// utils
function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function randomNumberBetween(min, max) {
    return (Math.random() * (max - min)) + min
}

function randomIndexOf(arr) {
    return randomIntBetween(0, arr.length)
}

function randomBool(chance) {
    return !!Math.floor(randomIntBetween(0, 1 + chance))
}

// init
setTimeout(function() {
    viz.init_xlive_viz()
    viz.init_waves();
    viz.initControls();
    animate_xlive_viz()
    init_big_shapes();
})


var FaceMaterialConfig = {
    color: 0xfafafa,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
    transparent: true,
    side: THREE.DoubleSide,
    overdraw: 0.5,
    // depthTest: true,
    vertexColors: THREE.FaceColors,
    opacity: 0,
}
var faceColorOptions = [0x45FFD0, 0xA8F6F7, 0x4DB9F7]
var chanceOfFaceColor = 0.3;

var transparentFaceMaterial = new THREE.MeshBasicMaterial(FaceMaterialConfig)
var faceMaterials = [transparentFaceMaterial]
faceColorOptions.forEach(function(color) {
    var conf = Object.assign({}, FaceMaterialConfig)
    conf.color = color
    conf.opacity = 1
    faceMaterials.push(new THREE.MeshBasicMaterial(conf))
})
function getFaceColorIndex() {
    return !Math.floor(Math.random() * 1 / chanceOfFaceColor) ?
           randomIntBetween(1, 3) :
           0
}

var objs = [
    // "Cube",
    // "Dodecahedron",
    // "Tetrahedron",
    // "J7", // Elongated Triangular Pyramid
    // "J31", // Pentagonal Gyrobicupola
    // "J83", // Tridiminished Rhombicosidodecahedron
    "Tetrahedron", "Cube", "Octahedron", "Dodecahedron", "Icosahedron", "TruncatedTetrahedron", "TruncatedCube", "TruncatedOctahedron", "TruncatedDodecahedron", "TruncatedIcosahedron", "Cuboctahedron", "TruncatedCubocahedron", "Rhombicubocahedron", "SnubCuboctahedron", "Icosidodecahedron", "TruncatedIcosidodecahedron", "Rhombicosidodecahedron", "SnubIcosidodecahedron", "TriangularPrism", "SquarePrism", "PentagonalPrism", "HexagonalPrism", "HepatgonalPrism", "OctagonalPrism", "EnneagonalPrism", "DecagonalPrism", "TriangularAntiprism", "SquareAntiPrism", "PentagonalAntiPrism", "HexagonalAntiprism", "HeptagonalAntiprism", "OctagonalAntiprism", "EnneagonalAntiprism", "DecagonalAntiprism", "J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10", "J11", "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J19", "J20", "J21", "J22", "J23", "J24", "J25", "J26", "J27", "J28", "J29", "J30", "J31", "J32", "J33", "J34", "J35", "J36", "J37", "J38", "J39", "J40", "J41", "J42", "J43", "J44", "J45", "J46", "J47", "J48", "J49", "J50", "J51", "J52", "J53", "J54", "J55", "J56", "J57", "J58", "J59", "J60", "J61", "J62", "J63", "J64", "J65", "J66", "J67", "J68", "J69", "J70", "J71", "J72", "J73", "J74", "J75", "J76", "J77", "J78", "J79", "J80", "J81", "J82", "J83", "J84", "J85", "J86", "J87", "J88", "J89", "J90", "J91", "J92",
]
function createObj(shape) {
    shape = shape || objs[randomIndexOf(objs)]
    var geom = POLYHEDRA[shape]
	var polyhedronMesh = new THREE.Object3D();
    polyhedronMesh = viz.polyhedronDataToMesh(geom);
    var spacing = window.innerWidth / (viz.shapes.length + 1) * viz.config.scale * 0.6;
    var yExtent = viz.config.scale * 100

    polyhedronMesh.position.y = randomIntBetween(-yExtent, yExtent)
    polyhedronMesh.particles = []
    polyhedronMesh.sparkling = randomBool(0.6);
    polyhedronMesh.shapeName = shape;
    polyhedronMesh.xRotation = randomNumberBetween(-0.03, 0.03);
    polyhedronMesh.yRotation = randomNumberBetween(-0.03, 0.03);

    viz.scene.add(polyhedronMesh);
    viz.shapes.push(polyhedronMesh);
    viz.shapes.forEach(function(shape, i) {
        shape.xPos = { x : shape.position.x };
        var target = { x : -((viz.shapes.length - 1) * spacing / 2) + i * spacing };
        shape.tween = new TWEEN.Tween(shape.xPos).to(target, 900)
                          .easing(TWEEN.Easing.Elastic.Out)
                          .onUpdate(function(){
                              shape.position.x = shape.xPos.x;
                          })
                          .start()
    })

    elems.updateShapeLabels()
}

function init_big_shapes() {
    for (var i = 0; i < 5; i++) {
        createObj(objs[i])
    }
}

var circleGeom = new THREE.CircleGeometry(10, 128)
circleGeom.vertices.shift()
var squareDiameter = 13
var particleElems = [
    basicShapes.cross(),
    basicShapes.triangle(),
    basicShapes.rect(squareDiameter, squareDiameter),
    basicShapes.roundedRect(squareDiameter, squareDiameter, squareDiameter / 2),
    basicShapes.polyhedron(),
    basicShapes.polyhedron(20, 12),
]

function drawParticles(shape) {
    var particleElem = particleElems[randomIndexOf(particleElems)]

    var geometry = particleElem.createPointsGeometry()
    var scale = viz.config.scale * randomNumberBetween(0.2, 0.7)
    geometry.scale(scale, scale, scale)
    var particle = new THREE.Line( geometry, new THREE[viz.materials.line.type](viz.materials.line.config))

    var maxDistance = viz.config.scale * 60
    var extent = viz.config.scale
    var xDir = randomNumberBetween(-extent, extent)
    var yDir = randomNumberBetween(-extent, extent)
    function randomPos(dir, pos) {
        return randomNumberBetween(
            dir < 0 ? pos - maxDistance : pos,
            dir > 0 ? pos + maxDistance : pos
        )
    }
    particle.position.set(randomPos(xDir, shape.position.x),
                          randomPos(yDir, shape.position.y),
                          0)
    particle.age = particle.age = 0
    particle.xDir = xDir
    particle.yDir = yDir
    shape.particles.push(particle)
    viz.scene.add(particle)
}

function getVert(shape) {
    var pos = shape.position
    return new THREE.Vector3(pos.x, pos.y, pos.z)
}

var lineMaterial = new THREE[viz.materials.line.type](viz.materials.line.config)
function animate_xlive_viz(time) {
    requestAnimationFrame(animate_xlive_viz);
    viz.controls.update()
    viz.connectingLines.forEach(function(line) {
        viz.scene.remove(line)
    })
    viz.connectingLines = []

    TWEEN.update(time)

    viz.shapes.forEach(function(shape, i) {
        shape.rotation.x += shape.xRotation;
        shape.rotation.y += shape.yRotation;

        if (shape.sparkling && randomBool(0.3)) drawParticles(shape)
        shape.particles.forEach(function(particle, i) {
            if (particle.age > viz.config.particleAge) {
                viz.scene.remove(particle)
                shape.particles.splice(i, 1)
                return
            }

            var scale = particle.scale.x - .01
            particle.scale.set(scale, scale, scale)
            particle.position.x += particle.xDir
            particle.position.y += particle.yDir
            particle.age++
            particle.material.opacity -= 1 / viz.config.particleAge;
        })

        if (i) {
            var newLine = cylinderMesh( getVert(shape), getVert(viz.shapes[i - 1]), lineMaterial)
            viz.connectingLines.push(newLine);
            viz.scene.add(newLine)
        }
    })

    viz.render()
}

function clearShapes() {
    viz.shapes.forEach(function(shape) {
        shape.particles.forEach(function(particle) {
            viz.scene.remove(particle)
        })
        viz.scene.remove(shape)
    })

    viz.shapes = []
    elems.updateShapeLabels()
}

function toggleSparkling(i) {
    var shape = viz.shapes[i]
    shape.sparkling = !shape.sparkling
    if (!shape.sparkling) {
        shape.particles.forEach(function(particle, i) {
            viz.scene.remove(particle)
        })
        shape.particles = []
    }
    elems.updateShapeLabels()
}
