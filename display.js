var camera, scene, renderer;
var geometry, material, mesh;

function sinusoid_xy(amplitude, freq, phase, height, width, depth) {
    return function(t) {
        return new THREE.Vector3(
            width*(t-0.5),
            height + amplitude*Math.cos(freq * Math.PI * t + phase),
            depth
        );
    }
}

var numWaves = 20;
function init_waves() {
    // http://math.hws.edu/graphicsbook/source/threejs/curves-and-surfaces.html
    // https://stemkoski.github.io/Three.js/#vertex-colors
    // http://www.pshkvsky.com/gif2code/sine-animation-tutorial-three-js/
    for(n=-numWaves; n<numWaves; n++) {
        var cosine = new THREE.Curve();
        cosine.getPoint = sinusoid_xy(20, 15, 0, 20*n, 3500, -200);
        var curveGeom = new THREE.Geometry();
        curveGeom.vertices = cosine.getPoints(256);
        var curve = new THREE.Line(curveGeom, new THREE.LineBasicMaterial({ color:0xDCF3F3, linewidth:2 }));
        scene.add(curve);
    }
}

function init_xlive_viz() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    // camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    init_big_shapes();
    init_waves();
}


var wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x171756,
    wireframe: true,
    // transparent: true,
    wireframeLinewidth: 3,
    wireframeLinejoin: "round",
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    // depthTest: false,
});
var config = {
    color: 0xfafafa,
    // polygonOffset: true,
    // linewidth: 30,
    // polygonOffsetFactor: 1,
    // polygonOffsetUnits: 1,
    side: THREE.DoubleSide,
    // depthTest: true,
    vertexColors: THREE.FaceColors,
}
var faceColors = [0x45FFD0, 0xA8F6F7, 0x4DB9F7]
var chanceOfFaceColor = 0.3;

function getMaterial() {
    var mat = [];
    for (var i = 0; i < 10; i++) {
        var conf = Object.assign({}, config);
        var color = !Math.floor(Math.random() * 1 / chanceOfFaceColor) ?
                    faceColors[Math.floor(Math.random() * faceColors.length)] : 0xffffff
        conf.color = color;
        mat.push(new THREE.MeshBasicMaterial(conf));
    }
    var darkMaterial = new THREE.MeshFaceMaterial(mat);
    return [ darkMaterial, wireframeMaterial ];
}

var shapes = [];
function init_big_shapes() {
    var top = new THREE.ConeGeometry(100, 100, 6);
    var bottom = new THREE.ConeGeometry(100, -100, 6);

    var topMesh = new THREE.Mesh(top);
    var bottomMesh = new THREE.Mesh(bottom);
    topMesh.translateY(50);
    bottomMesh.translateY(-50);

    topMesh.updateMatrix();
    bottomMesh.updateMatrix();

    pyramidGeometry = new THREE.Geometry();
    pyramidGeometry.merge(bottomMesh.geometry, bottomMesh.matrix);
    pyramidGeometry.merge(topMesh.geometry, topMesh.matrix);

    var objs = [
        new THREE.BoxGeometry(200, 200, 200),
        new THREE.CylinderGeometry(100, 100, 200, 6),
        pyramidGeometry,
        new THREE.ConeGeometry(100, 200, 64)
    ]

    function createObj(geom, idx) {
        geom = THREE.SceneUtils.createMultiMaterialObject(
            geom,
            getMaterial()
        );
        var spacing = window.innerWidth / objs.length;
        geom.translateX(-((objs.length - 1) * spacing / 2) + idx * spacing);
        geom.translateZ(400);
        scene.add( geom );

        shapes.push(geom);
    }

    objs.forEach(createObj);
}

function animate_xlive_viz() {
    requestAnimationFrame(animate_xlive_viz);

    shapes.forEach(function(shape) {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.02;

    })

    renderer.render(scene, camera);
}
