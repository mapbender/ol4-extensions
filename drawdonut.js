
        /**
         * @classdesc
         * Interaction for drawing feature geometries.
         *
         * @constructor
         * @extends {ol.interaction.Pointer}
         * @fires ol.interaction.Draw.Event
         * @param {olx.interaction.DrawOptions} options Options.
         * @api
         */
        ol.interaction.DrawDonut = function (options) {
            ol.interaction.Draw.apply(this, [options]);

            this.originalFeature_ = null;
            
        };


        ol.inherits(ol.interaction.DrawDonut, ol.interaction.Draw);


        ol.interaction.DrawDonut.prototype.startDrawing_ = function (event) {

            ol.interaction.Draw.prototype.startDrawing_.apply(this, arguments);

            var map = event.map;
            var coordinate = this.sketchFeature_.getGeometry().getFirstCoordinate();

            this.originalFeature_ = map.forEachFeatureAtPixel(map.getPixelFromCoordinate(coordinate), function (feature) {
                if (feature.getGeometry().getType() === 'Polygon') {
                    return feature;
                }
            });

            if (!this.originalFeature_) {
                this.abortDrawing_();
            }

            this.dispatchEvent({type: 'modifystart', features: new ol.Collection([this.originalFeature_]});
        };


        ol.interaction.DrawDonut.prototype.finishDrawing = function () {

            var sketchFeature = this.abortDrawing_();
            var coordinates = this.sketchCoords_;
            var geometry = /** @type {ol.geom.SimpleGeometry} */ (sketchFeature.getGeometry());
            if (this.mode_ === ol.interaction.Draw.Mode_.LINE_STRING) {
                // remove the redundant last point
                coordinates.pop();
                this.geometryFunction_(coordinates, geometry);
            } else if (this.mode_ === ol.interaction.Draw.Mode_.POLYGON) {
                // remove the redundant last point in ring
                coordinates[0].pop();
                this.geometryFunction_(coordinates, geometry);
                coordinates = geometry.getCoordinates();
            }

            // cast multi-part geometries
            if (this.type_ === ol.geom.GeometryType.MULTI_POINT) {
                sketchFeature.setGeometry(new ol.geom.MultiPoint([coordinates]));
            } else if (this.type_ === ol.geom.GeometryType.MULTI_LINE_STRING) {
                sketchFeature.setGeometry(new ol.geom.MultiLineString([coordinates]));
            } else if (this.type_ === ol.geom.GeometryType.MULTI_POLYGON) {
                sketchFeature.setGeometry(new ol.geom.MultiPolygon([coordinates]));
            }
            if (this.originalFeature_) {
                var coordinates = sketchFeature.getGeometry().getCoordinates()[0];
                this.originalFeature_.getGeometry().appendLinearRing(new ol.geom.LinearRing(coordinates));
                this.dispatchEvent({type: 'modifyend', features: new ol.Collection([this.originalFeature_])});
            }
        };
