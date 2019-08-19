(function() {
    "use strict";
    
    ol.format.GeoJSONWithSeperateData = function () {
        ol.format.GeoJSON.apply(this, arguments);
    };

    ol.inherits(ol.format.GeoJSONWithSeperateData, ol.format.GeoJSON);

    ol.format.GeoJSONWithSeperateData.prototype.readFeatureFromObject = function (object, opt_options) {
        var feature = ol.format.GeoJSON.prototype.readFeatureFromObject.apply(this, arguments);
        /**
         * @type {GeoJSONFeature}
         */
        var geoJSONFeature = null;
        if (object.type === 'Feature') {
            geoJSONFeature = /** @type {GeoJSONFeature} */ (object);
        } else {
            geoJSONFeature = /** @type {GeoJSONFeature} */ ({
                type: 'Feature',
                geometry: /** @type {GeoJSONGeometry|GeoJSONGeometryCollection} */ (object)
            });
        }

        var geometry = ol.format.GeoJSON.readGeometry_(geoJSONFeature.geometry, opt_options);
        var feature = new ol.Feature();
        if (this.geometryName_) {
            feature.setGeometryName(this.geometryName_);
        } else if (this.extractGeometryName_ && geoJSONFeature.geometry_name !== undefined) {
            feature.setGeometryName(geoJSONFeature.geometry_name);
        }
        feature.setGeometry(geometry);
        if (geoJSONFeature.id !== undefined) {
            feature.setId(geoJSONFeature.id);
        }

        var props = geoJSONFeature.properties;

        if (props) {

            props.get = function (key) {
                return this[key]
            };
            props.set = function (key, value) {
                this[key] = value;
            };


            feature.setProperties({
                data: props
            });
        }
        return feature;

    };
})();
