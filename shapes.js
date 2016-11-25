function createShape(verts) {
    var shape = new THREE.Shape();
    verts.forEach(function(vert, i) {
        if (!i) {
            shape.moveTo(vert[0], vert[1])
        } else {
            shape.lineTo(vert[0], vert[1])
        }
    })
    if (verts.length > 1) {
        shape.lineTo(verts[0][0], verts[0][1])
    }
    return shape
}

var basicShapes = {
    cross: function(radius) {
        radius = radius || 20
        var verts = [
            [-radius,       0],
            [ radius,       0],
            [      0,       0],
            [      0,  radius],
            [      0, -radius],
            [      0,       0],
        ]
        return createShape(verts)
    },

    triangle: function(radius) {
        radius = radius || 20

        var verts = [
            [-radius,    0 ],
            [ radius,  radius],
            [ radius, -radius],
        ]
        return createShape(verts)
    },

    rect: function(length, width) {
        length = length || 120
        width = width || 40

        var verts = [
            [     0,     0],
            [     0, width],
            [length, width],
            [length,     0],
            [     0,     0],
        ]
        return createShape(verts)
    },

    roundedRect: function(width, height, radius) {
        width = width || 50
        height = height || 50
        radius = radius || 20

        var shape = new THREE.Shape()
        shape.moveTo( 0, radius );
        shape.lineTo( 0, height - radius );
        shape.quadraticCurveTo( 0, height, 0 + radius, height );
        shape.lineTo( width - radius, height) ;
        shape.quadraticCurveTo( width, height, width, height - radius );
        shape.lineTo( width, radius );
        shape.quadraticCurveTo( width, 0, width - radius, 0 );
        shape.lineTo( radius, 0 );
        shape.quadraticCurveTo( 0, 0, 0, radius );

        return shape
    },

    hexagon: function(radius, numPoints) {
        radius = radius || 20
        numPoints = numPoints || 6

        var angle = 2 * Math.PI / numPoints
        var verts = []
        for (var i = 0; i < numPoints; i++) {
            x = radius * Math.sin(i * angle);
            y = radius * Math.cos(i * angle);
            verts.push([x, y])
        }
        return createShape(verts)
    },
}
