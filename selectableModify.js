(function () {

    function getStyleFunction_() {
        var baseStyle = ol.style.Style.defaultFunction()[0].clone();
        var verticesStyle = new ol.style.Style({
            geometry: function(feature) {
                // Concatenate all vertices of all rings
                var coordinates = Array.prototype.concat.apply([], feature.getGeometry().getCoordinates());
                return new ol.geom.MultiPoint(coordinates);
            },
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: "#ffcc33"
                })
            })
        });
        var midpointStyle = new ol.style.Style({
            geometry: function(feature) {
                var lineStrings = feature.getGeometry().getCoordinates().map(function(ringCoordinates) {
                    return new ol.geom.LineString(ringCoordinates);
                });
                var coordinates = Array.prototype.concat.apply([], lineStrings.map(function(lineString) {
                    var midpoints = [];
                    lineString.forEachSegment(function(start, end) {
                        midpoints.push([(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]);
                    });
                    return midpoints;
                }));
                return new ol.geom.MultiPoint(coordinates);
            },
            image: new ol.style.Circle({
                radius: 3,
                stroke: new ol.style.Stroke({
                    color: "#ffcc33",
                    width: 4
                })
            })
        });

        return function (feature) {
            var geometry = feature.getGeometry();
            var styles = [baseStyle];

            if (feature.getGeometry().getType() == "Polygon") {
                styles.push(verticesStyle);
                styles.push(midpointStyle);
            }
            return styles;
        }
    }

    ol.interaction.SelectableModify = function (options) {
        var vertices = this.vertices_ = null;

        var edges = this.edges_ = null;

        this.select_ = new ol.interaction.Select({
            style: getStyleFunction_()
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
        this.select_.setActive(active);
        ol.interaction.Modify.prototype.setActive.apply(this, arguments);
        if (!active) {
            // ???
            this.select_.dispatchEvent({type: 'select', deselected: this.select_.getFeatures()});
            this.select_.getFeatures().clear();
        }
    };

    ol.interaction.SelectableModify.prototype.setMap = function(map) {
        // Called implicitly by map.addInteraction.
        // @see https://github.com/openlayers/openlayers/blob/main/src/ol/PluggableMap.js#L419
        // @see https://github.com/openlayers/openlayers/blob/main/src/ol/PluggableMap.js#L495
        // We must add our selct control the map as well. Calling setMap on it is not enough.
        ol.interaction.Modify.prototype.setMap.apply(this, arguments);
        if (-1 === map.getInteractions().getArray().indexOf(this.select_)) {
            map.addInteraction(this.select_);
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
})();
