(function () {
    "use strict";

    ol.Feature.prototype.setStyleWithLabel = function (style) {

        var clonedStyle = style.clone();

        var createLabel = function (tpl, data) {
            return tpl.replace(/\${([^}]+)}/g, function (match, p1) {
                return data[p1] || "";
            });
        };

        var labelStyle = new ol.style.Style({
            text: clonedStyle.getText().clone()
        });


        labelStyle.getText().setText(labelStyle.getText().getText());

        var newstyle = function () {

            var feature = this;
            var label = createLabel(labelStyle.getText().getText() || '', feature.get("data") || {});
            labelStyle.getText().setText(label);
            clonedStyle.getText().setText(undefined);
            return [clonedStyle, labelStyle];
        };

        return ol.Feature.prototype.setStyle.apply(this, [newstyle]);
    };

})();
