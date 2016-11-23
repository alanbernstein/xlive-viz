var camera, scene, renderer;
var geometry, material, mesh;


function init_cube_demo() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}
function animate_cube_demo() {

    requestAnimationFrame(animate_cube_demo);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);

}

function sinusoid_xy(amplitude, freq, phase, height, width, depth) {
    return function(t) {
        return new THREE.Vector3(
            width*(t-0.5),
            height + amplitude*Math.cos(freq * Math.PI * t + phase),
            depth
        );
    }
}


function init_waves() {
    // http://math.hws.edu/graphicsbook/source/threejs/curves-and-surfaces.html
    // https://stemkoski.github.io/Three.js/#vertex-colors
    // http://www.pshkvsky.com/gif2code/sine-animation-tutorial-three-js/
    for(n=-5; n<6; n++) {
        var cosine = new THREE.Curve();
        cosine.getPoint = sinusoid_xy(50, 20, 0, 100*n, 2000, 200);
        var curveGeom = new THREE.Geometry();
        curveGeom.vertices = cosine.getPoints(256);
        var curve = new THREE.Line(curveGeom, new THREE.LineBasicMaterial({ color:0xffffff, linewidth:2 }));
        scene.add(curve);
    }
}

function init_xlive_viz() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    // camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x004400);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    init_big_shapes();
    init_waves();
}

function init_big_shapes() {
    // cube
    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        linewidth: 10,
        wireframe: true
    });
    cube_mesh = new THREE.Mesh(geometry, material);
    cube_mesh.translateX(-600);
    scene.add(cube_mesh);

    // prism
    geometry = new THREE.CylinderGeometry(100, 100, 200, 6);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    prism_mesh = new THREE.Mesh(geometry, material);
    prism_mesh.translateX(-200);
    scene.add(prism_mesh);

    // bipyramid
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
    
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    pyramid_mesh = new THREE.Mesh(pyramidGeometry, material);
    pyramid_mesh.translateX(200);
    scene.add(pyramid_mesh);

    // cone
    geometry = new THREE.ConeGeometry(100, 200, 64);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    cone_mesh = new THREE.Mesh(geometry, material);
    cone_mesh.translateX(600);
    scene.add(cone_mesh);

}

function animate_xlive_viz() {

    requestAnimationFrame(animate_xlive_viz);

    cube_mesh.rotation.x += 0.01;
    cube_mesh.rotation.y += 0.02;

    prism_mesh.rotation.x += 0.01;
    prism_mesh.rotation.y += 0.02;

    pyramid_mesh.rotation.x += 0.01;
    pyramid_mesh.rotation.y += 0.02;

    cone_mesh.rotation.x += 0.01;
    cone_mesh.rotation.y += 0.02;

    renderer.render(scene, camera);

}


