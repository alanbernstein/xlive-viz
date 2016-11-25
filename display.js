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
    "Cube",
    "Dodecahedron",
    "Tetrahedron",
    "J7", // Elongated Triangular Pyramid
    "J31", // Pentagonal Gyrobicupola
    "J83", // Tridiminished Rhombicosidodecahedron
]
function createObj(shape) {
    shape = shape || objs[randomIndexOf(objs)]
    var geom = POLYHEDRA[shape]
	var polyhedronMesh = new THREE.Object3D();
    polyhedronMesh = viz.polyhedronDataToMesh(geom);
    var spacing = window.innerWidth / objs.length * viz.config.scale * 0.6;
    var yExtent = viz.config.scale * 100
    // polyhedronMesh.translateZ(400);
    polyhedronMesh.position.y = randomIntBetween(-yExtent, yExtent)
    polyhedronMesh.particles = []
    polyhedronMesh.sparkling = randomBool(0.6);
    polyhedronMesh.shapeName = shape;
    viz.scene.add(polyhedronMesh);
    viz.shapes.push(polyhedronMesh);
    viz.shapes.forEach(function(shape, i) {
        shape.position.x = -((viz.shapes.length - 1) * spacing / 2) + i * spacing;
    })

    elems.updateShapeLabels()
}

function init_big_shapes() {
    objs.forEach(createObj);
}

var circleGeom = new THREE.CircleGeometry(10, 128)
circleGeom.vertices.shift()
var squareDiameter = 13
var particleElems = [
    basicShapes.cross(),
    basicShapes.triangle(),
    basicShapes.rect(squareDiameter, squareDiameter),
    basicShapes.roundedRect(squareDiameter, squareDiameter, squareDiameter),
    basicShapes.hexagon()
]

function drawParticles(shape) {
    var particleElem = particleElems[randomIndexOf(particleElems)]

    var geometry = particleElem.createPointsGeometry()
    geometry.scale(viz.config.scale * 0.4, viz.config.scale * 0.4, viz.config.scale * 0.4)
    var particle = new THREE.Line( geometry, new THREE[viz.materials.line.type](viz.materials.line.config))

    var maxDistance = viz.config.scale * 60
    var extent = viz.config.scale
    var xDir = randomNumberBetween(-extent, extent)
    var yDir = (Math.random() * (extent - -extent)) + -extent
    function randomPos(dir, pos) {
        return randomIntBetween(
            dir < 0 ? pos - maxDistance : 0,
            dir > 0 ? pos + maxDistance : 0
        )
    }
    particle.position.set(randomPos(xDir, shape.position.x),
                          randomPos(yDir, shape.position.y),
                          randomIntBetween(-viz.config.scale, viz.config.scale))
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
function animate_xlive_viz() {
    requestAnimationFrame(animate_xlive_viz);
    viz.controls.update()
    viz.connectingLines.forEach(function(line) {
        viz.scene.remove(line)
    })
    viz.connectingLines = []

    viz.shapes.forEach(function(shape, i) {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.02;

        if (shape.sparkling && randomBool(0.3)) drawParticles(shape)
        shape.particles.forEach(function(particle, i) {
            if (particle.age > viz.config.particleAge) {
                viz.scene.remove(particle)
                shape.particles.splice(i, 1)
                return
            }

            particle.position.x += particle.xDir;
            particle.position.y += particle.yDir;
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
