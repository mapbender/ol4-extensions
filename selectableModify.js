(function () {

    ol.interaction.SelectableModify = function (options) {


        var vertices = this.vertices_ = null;

        var edges = this.edges_ = null;

        this.select_ = new ol.interaction.Select({
            style: function (feature) {

                var verticesStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 3,
                        fill: new ol.style.Fill({
                            color: "#ffcc33"
                        })
                    })
                });

                var edgesStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 3,
                        stroke: new ol.style.Stroke({
                            color: "#ffcc33",
                            width: 4
                        })
                    })
                });

                var styles = [options.defaultStyle || ol.style.Style.defaultFunction()[0].clone()];
                if (feature.getGeometry().getType() == "Polygon") {
                    var outerCoords = feature.getGeometry().getCoordinates();

                    var allcoords = [];
                    var allmidpoints =  [];

                    outerCoords.forEach(function (coords) {

                        allcoords = allcoords.concat(coords.slice(0,-1));

                        var line = new ol.geom.LineString(coords);
                        var midpoints = [];
                        line.forEachSegment(function (start, end) {
                            midpoints.push([(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]);
                        });
                        allmidpoints = allmidpoints.concat(midpoints);

                    });

                    vertices = new ol.geom.MultiPoint(allcoords);
                    verticesStyle.setGeometry(vertices);
                    styles.push(verticesStyle);

                    edges = new ol.geom.MultiPoint(allmidpoints);
                    edgesStyle.setGeometry(edges);
                    styles.push(edgesStyle);

                } else {
                    vertices = undefined;
                    edges = undefined;
                }
                return styles;
            }
        });


        this.select_.on('select', function (event) {

            event.selected && event.selected.forEach(function (feature) {
                feature.set("featureStyleDisabled", true);
            });

            event.deselected && event.deselected.forEach(function (feature) {
                feature.unset("featureStyleDisabled");
            });
        });

        options.features = this.select_.getFeatures();


        ol.interaction.Modify.apply(this, [options]);

        this.on(ol.interaction.ModifyEventType.MODIFYSTART, function () {
        });


        this.on(ol.interaction.ModifyEventType.MODIFYEND, function () {
        });
    };

    ol.inherits(ol.interaction.SelectableModify, ol.interaction.Modify);


    ol.interaction.SelectableModify.prototype.setActive = function (active) {
        if (active) {
            this.select_.setActive(true);
            ol.interaction.Modify.prototype.setActive.apply(this, [true]);
        } else {
            this.select_.setActive(false);
            ol.interaction.Modify.prototype.setActive.apply(this, [false]);
            this.select_.dispatchEvent({type: 'select', deselected: this.select_.getFeatures()});
            this.select_.getFeatures().clear();

        }
    };

    ol.interaction.SelectableModify.prototype.condition = function (event) {
        if (event.type == "pointerdown") {
            if (this.edges_) {
                var point = this.getMap().getPixelFromCoordinate(
                    new ol.geom.GeometryCollection([this.edges_, this.vertices_]).getClosestPoint(event.coordinate)
                );
                var dx = point[0] - event.pixel[0];
                var dy = point[1] - event.pixel[1];
                var ds = dx * dx + dy * dy;
                return ds < 100;
            } else {
                return true;
            }
        }
    };

    ol.interaction.SelectableModify.prototype.getFeatures = function () {
        return this.select_.getFeatures();
    };


    ol.interaction.SelectableModify.prototype.addSelectToMap = function (map) {
        map.addInteraction(this.select_);
    };


    ol.interaction.SelectableModify.prototype.removeSelectFromMap = function (map) {
        map.removeInteraction(this.select_);
    };


})();
