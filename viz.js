var viz = viz || {}

viz.config = {
    renderer: "WebGLRenderer",
    numWaves: 20,
    particleAge: 50,
    scale: 1 / 50,
}

viz.scene = null
viz.shapes = []
viz.connectingLines = []

viz.materials = {
    line: {
        config: {
            // color: faceMaterials[getFaceColorIndex()].color,
            color: 0x171756,
            linewidth: 3,
            transparent: true,
            // wireframeLinewidth: 6,
            // wireframeLinejoin: "round",
            // wireframe: true,
        },
        type: "LineBasicMaterial",
    },
    edge: {
        config: {
            color: 0x171756,
            emissive: 0x171756,
            // wireframe: true,
            vertexColors: THREE.FaceColors
        },
        type: "MeshLambertMaterial"
    }
}

    // threejs
viz.init_waves = function() {
    // http://math.hws.edu/graphicsbook/source/threejs/curves-and-surfaces.html
    // https://stemkoski.github.io/Three.js/#vertex-colors
    // http://www.pshkvsky.com/gif2code/sine-animation-tutorial-three-js/
    function sinusoid_xy(amplitude, freq, phase, height, width, depth) {
        return function(t) {
            return new THREE.Vector3(
                width*(t-0.5),
                height + amplitude*Math.cos(freq * Math.PI * t + phase),
                depth
            );
        }
    }

    for(n=-20; n<20; n++) {
        var cosine = new THREE.Curve();
        cosine.getPoint = sinusoid_xy(20, 25, 0, 35*n, window.innerWidth * 3.2, -1000);
        var curveGeom = new THREE.Geometry();
        curveGeom.vertices = cosine.getPoints(256);
        var curve = new THREE.Line(curveGeom, new THREE.LineBasicMaterial({
            color:0xDCF3F3,
            linewidth:3
        }));
        viz.scene.add(curve);
    }
}

viz.init_xlive_viz = function() {
    viz.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);
    viz.camera.position.z = viz.config.scale * 500;
    viz.scene = new THREE.Scene();
    viz.scene.background = new THREE.Color(0xfafafa);
    viz.renderer = new THREE[viz.config.renderer]();
    viz.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(viz.renderer.domElement);
}

viz.initControls = function() {
    viz.controls = new THREE.TrackballControls( viz.camera );
    viz.controls.rotateSpeed = 1.0;
    viz.controls.zoomSpeed = 1.2;
    viz.controls.panSpeed = 0.8;
    viz.controls.noZoom = false;
    viz.controls.noPan = false;
    viz.controls.staticMoving = true;
    viz.controls.dynamicDampingFactor = 0.3;
    viz.controls.keys = [ 65, 83, 68 ];
    viz.controls.addEventListener( 'change', viz.render );
}

viz.render = function() {
    viz.renderer.render(viz.scene, viz.camera);
}
