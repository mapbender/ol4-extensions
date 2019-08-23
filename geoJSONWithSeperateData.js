(function() {
    "use strict";

    ol.format.GeoJSONWithSeperateData = function () {
        ol.format.GeoJSON.apply(this, arguments);
    };

    ol.inherits(ol.format.GeoJSONWithSeperateData, ol.format.GeoJSON);


    /**
     * Method differs from its parent's method by only delivering features with valid geometry
     * @param object
     * @param opt_options
     * @returns {Array<ol.Feature>}
     */
    ol.format.GeoJSONWithSeperateData.prototype.readFeaturesFromObject = function(
        object, opt_options) {
        var geoJSONObject = /** @type {GeoJSONObject} */ (object);
        /** @type {Array.<ol.Feature>} */
        var features = null;
        if (geoJSONObject.type === 'FeatureCollection') {
            var geoJSONFeatureCollection = /** @type {GeoJSONFeatureCollection} */
                (object);
            features = [];
            var geoJSONFeatures = geoJSONFeatureCollection.features;
            var i, ii;
            for (i = 0, ii = geoJSONFeatures.length; i < ii; ++i) {
                var feature = this.readFeatureFromObject(geoJSONFeatures[i],
                    opt_options);
                if (feature.getGeometry()) {
                    features.push();
                } else {
                    console.warn("Feature "+feature.getId()+" does not have a valid geometry and is therefore ommited");
                }
            }
        } else {
            features = [this.readFeatureFromObject(object, opt_options)];
        }
        return features;
    };

    /**
     * Method distinguishes from its parent's method by not storing the GeoJsonFeature's properties in the Feature's properties but wraps it in a data property within the Feature's properties
     *
     * @param object
     * @param opt_options
     * @returns {ol.Feature}
     */

    ol.format.GeoJSONWithSeperateData.prototype.readFeatureFromObject = function (object, opt_options) {
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
