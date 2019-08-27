(function () {
    "use strict";

    ol.style.StyleConverter = ol.style.StyleConverter || {};


    /**
     * Transforms a style Object into a function returning this Object and its evaluated Label as an array
     *
     * @param {ol.style.Style} style
     * @returns {(function(): [*, ol.style.Style])|*}
     */
    var seperateLabelStyle = function(style) {

        if (!style.getText()) {
            return style;
        }

        var createLabel = function (tpl, data) {
            return tpl.replace(/\${([^}]+)}/g, function (match, p1) {
                return data[p1];
            });
        };

        var labelStyle = new ol.style.Style({
            text: style.getText().clone()
        });


        labelStyle.getText().setText(labelStyle.getText().getText());

        var newstyle = function () {

            var feature = this;
            var label = createLabel(labelStyle.getText().getText() || '', feature.get("data"));
            labelStyle.getText().setText(label);
            style.getText().setText(undefined);
            return [style, labelStyle];
        };

       return newstyle;
    };

     ol.style.StyleConverter.convertToOL4Style = function (ol2Style, seperateLabel) {

        var newStyle = ol.style.Style.defaultFunction()[0].clone();

        /* creates 4 element array with color and opacity */
        var calculateColor = function (color, opacity, originalColor) {
            var newColor = ol.color.asArray(color !== undefined ? color : originalColor).slice(); // it is necessary to clone via slice to prevent unpredictable behaviour
            newColor[3] = opacity !== undefined ? opacity : newColor[3];
            return newColor;
        };

        var convertDashStyle = function (dashStyle) {
            switch (dashStyle) {
                case 'solid' :
                    return [];
                case 'dot'   :
                    return [1, 5];
                case 'dash'      :
                    return [10, 10];
                case 'longdash'      :
                    return [20, 20];
                case 'dashdot'      :
                    return [5, 10, 1];
                case 'longdashdot'      :
                    return [5, 20, 1];
            }
        };

        var getFontStyleString = function(style) {
           var fontFamily = style.fontFamily || "sans-serif";
           var fontSize = style.fontSize ? style.fontSize+"px" : "";
           var fontWeight = style.fontWeight || "";

           var str = [fontSize,fontWeight,fontFamily].join(" ");
           return str;
        };

        newStyle.getStroke().setColor(calculateColor(ol2Style.strokeColor, (ol2Style.stroke !== null) ?  ol2Style.strokeOpacity : 0, newStyle.getStroke().getColor()));
        newStyle.getStroke().setWidth(ol2Style.strokeWidth || newStyle.getStroke().getWidth());
        newStyle.getStroke().setLineCap(ol2Style.strokeLinecap || newStyle.getStroke().getLineCap());
        newStyle.getStroke().setLineDash(convertDashStyle(ol2Style.strokeDashstyle) || newStyle.getStroke().getLineDash());


        newStyle.getFill().setColor(calculateColor(ol2Style.fillColor, (ol2Style.fill !== null) ? ol2Style.fillOpacity : 0, newStyle.getFill().getColor()));

        if (ol2Style.label) {

            newStyle.setText(new ol.style.Text({
                text: ol2Style.label || newStyle.getText().getText(),
                font: getFontStyleString(ol2Style),
                overflow: true,
            }));

          newStyle.getText().getFill().setColor(calculateColor(ol2Style.fontColor, ol2Style.fontOpacity, newStyle.getText().getFill().getColor()));
        }

        newStyle.setZIndex(ol2Style.graphicZIndex || 0);


        var image = new ol.style.Circle({
            fill: newStyle.getFill().clone(),
            stroke: newStyle.getStroke().clone(),
            radius: ol2Style.pointRadius || newStyle.getImage().getRadius()
        });

        newStyle.setImage(image);

        Object.freeze(newStyle);

        if (seperateLabel) {
            return seperateLabelStyle(newStyle);
        } else {
            return newStyle;
        }

    };

})();
