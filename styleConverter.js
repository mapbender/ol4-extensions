(function () {
    "use strict";

    ol.style.StyleConverter = ol.style.StyleConverter || {};

     ol.style.StyleConverter.convertToOL4Style = function (ol2Style) {

         if (!ol2Style) {
             throw new Error("no Style defined");
         }

        var newStyle = ol.style.Style.defaultFunction()[0].clone();

        /* creates 4 element array with color and opacity */
        var calculateColor = function (color, opacity, originalColor) {
            var color_ = color || originalColor;
            var newColor;
            if (typeof color_ === 'string') {
                newColor = Mapbender.StyleUtil.parseCssColor(color_);
            } else {
                newColor = color_.slice();
            }
            newColor = newColor.slice(0, 3);
            newColor.push(opacity);
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
        if (ol2Style.strokeColor || (typeof ol2Style.strokeOpacity !== 'undefined')) {
            var strokeOpacity, strokeColor;
            if (typeof ol2Style.strokeOpacity !== 'undefined') {
                strokeOpacity = ol2Style.strokeOpacity;
            } else {
                strokeOpacity = newStyle.getStroke().getColor()[3];
            }
            strokeColor = calculateColor(ol2Style.strokeColor || newStyle.getStroke().getColor(), strokeOpacity);
            newStyle.getStroke().setColor(strokeColor);
        }

        // @todo: Fix setting 0 strokeWidth
        newStyle.getStroke().setWidth(ol2Style.strokeWidth || newStyle.getStroke().getWidth());
        newStyle.getStroke().setLineCap(ol2Style.strokeLinecap || newStyle.getStroke().getLineCap());
        newStyle.getStroke().setLineDash(convertDashStyle(ol2Style.strokeDashstyle) || newStyle.getStroke().getLineDash());

        if (ol2Style.fillColor || (typeof ol2Style.fillColor !== 'undefined')) {
            var fillColor, fillOpacity;
            if (typeof ol2Style.fillOpacity !== 'undefined') {
                fillOpacity = ol2Style.fillOpacity;
            } else {
                fillOpacity = newStyle.getFill().getColor()[3];
            }
            fillColor = calculateColor(ol2Style.fillColor || newStyle.getFill().getColor(), fillOpacity);
            newStyle.getFill().setColor(fillColor);
        }

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

        return newStyle;

    };

})();
