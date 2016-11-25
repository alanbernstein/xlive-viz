viz = viz || {};
viz.polyhedronDataToMesh = function(data) {
	var polyhedron = new THREE.Object3D();

	// convert vertex data to THREE.js vectors
	var vertex = []
	for (var i = 0; i < data.vertex.length; i++)
		vertex.push( new THREE.Vector3( data.vertex[i][0], data.vertex[i][1], data.vertex[i][2] ).multiplyScalar(viz.config.scale * 50) );
    // drawPoints(polyhedron, data, vertex)
    drawEdges(polyhedron, data, vertex)
    var geometry = drawFaces(polyhedron, data, vertex)
    // drawInteriorFaces(polyhedron, geometry)

	return polyhedron;
}

function drawPoints(polyhedron, data, vertex) {
    var vertexGeometry = new THREE.SphereGeometry( 6, 12, 6 );
    var vertexMaterial = new THREE.MeshLambertMaterial( { color: 0x171756 });
    var vertexSingleMesh = new THREE.Mesh( vertexGeometry );

    var vertexAmalgam = new THREE.Geometry();
    for (var i = 0; i < data.vertex.length; i++) {
        var vMesh = vertexSingleMesh.clone();
        vMesh.position.x = vertex[i].x;
        vMesh.position.y = vertex[i].y;
        vMesh.position.z = vertex[i].z;
        vertexAmalgam.merge( vMesh.geometry, vMesh.matrix );
    }
    var vertexMesh = new THREE.Mesh( vertexAmalgam, vertexMaterial );
    polyhedron.add( vertexMesh );
}

function cylinderMesh(point1, point2, material) {
    var direction = new THREE.Vector3().subVectors(point2, point1);
    var arrow = new THREE.ArrowHelper(direction.clone().normalize(), point1);
    var rotation = new THREE.Euler().setFromQuaternion(arrow.quaternion);
    var edgeGeometry = new THREE.CylinderGeometry( viz.config.scale * 1.5, viz.config.scale * 1.5, direction.length(), 8, 4 );
    var edge = new THREE.Mesh(edgeGeometry, material);
    var pos = new THREE.Vector3().addVectors(point1, direction.multiplyScalar(0.5));
    edge.position.x = pos.x;
    edge.position.y = pos.y;
    edge.position.z = pos.z;
	edge.rotation.x = rotation._x;
	edge.rotation.y = rotation._y;
	edge.rotation.z = rotation._z;
	return edge;
}

function drawEdges(polyhedron, data, vertex) {
    var edgeMaterial = new THREE[viz.materials.edge.type](viz.materials.edge.config);
    var edgeAmalgam = new THREE.Geometry();
    for (var i = 0; i < data.edge.length; i++) {
        var index0 = data.edge[i][0];
        var index1 = data.edge[i][1];
        var eMesh = cylinderMesh( vertex[index0], vertex[index1], edgeMaterial );
        eMesh.updateMatrix();
        edgeAmalgam.merge(eMesh.geometry, eMesh.matrix)
    }
    var edgeMesh = new THREE.Mesh(edgeAmalgam, edgeMaterial)
    polyhedron.add(edgeMesh)
}

function drawFaces(polyhedron, data, vertex) {
    var faceMaterial = new THREE.MeshFaceMaterial(faceMaterials)

    var geometry = new THREE.Geometry();
    geometry.vertices = vertex;
    var faceIndex = 0
    data.face.forEach(function(face) {
        let faceColor = getFaceColorIndex()
        face.forEach(function(subFace, j) {
            if (j > face.length - 3) return
            geometry.faces[faceIndex] = new THREE.Face3(face[0], face[j+1], face[j+2])
            geometry.faces[faceIndex].materialIndex = faceColor
            faceIndex++
        })
    })

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var faces = new THREE.Mesh(geometry, faceMaterial);
    // faces.scale.multiplyScalar(0.97);
    polyhedron.add(faces);
    return geometry
}

function drawInteriorFaces(polyhedron, geometry) {
    var interiorMaterial = new THREE.MeshBasicMaterial({
        color: 0xfafafa,
        vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide
    });

    var interiorFaces = new THREE.Mesh(geometry, interiorMaterial);
    interiorFaces.scale.multiplyScalar(0.096);
    polyhedron.add( interiorFaces );
}
