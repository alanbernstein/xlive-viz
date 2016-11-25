var elems = {
    updateShapeLabels: function() {
        var shapeContainer = $("#shape-container")
        shapeContainer.empty()
        viz.shapes.forEach(function(shape, i) {
            var shapeElem = "<div class='shape'>"
            shapeElem += shape.shapeName
            shapeElem += "<button "
            if (shape.sparkling) shapeElem += "class='active' "
            shapeElem += "onclick='toggleSparkling("+ i +")'>\u2729</button>"
            shapeElem += "</div>"
            shapeContainer.append(shapeElem)
        })
    }
}
