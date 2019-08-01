(function () {
    "use strict";

    ol.style.StyleConverter = ol.style.StyleConverter || {};

    ol.style.StyleConverter.convertToOL4Style = function(ol2Style) {

        var newStyle = ol.style.Style.defaultFunction()[0].clone();

        /* creates 4 element array with color and opacity */
        var calculateColor = function(color,opacity,originalColor) {
            var newColor = ol.color.asArray(color !== undefined ? color : originalColor);
            newColor[3] = opacity !== undefined ? opacity : newColor[3];

            return newColor;
        };

        newStyle.getStroke().setColor(calculateColor(ol2Style.strokeColor,ol2Style.strokeOpacity, newStyle.getStroke().getColor()));
        newStyle.getStroke().setWidth(ol2Style.strokeWidth || newStyle.getStroke().getWidth());
        newStyle.getStroke().setLineCap(ol2Style.strokeLinecap || newStyle.getStroke().getLineCap());
        newStyle.getStroke().setLineDash(ol2Style.strokeDashstyle || newStyle.getStroke().getLineDash());

        newStyle.getFill().setColor(calculateColor(ol2Style.fillColor,ol2Style.fillOpacity,newStyle.getFill().getColor()));



        newStyle.getImage().getStroke().setColor(calculateColor(ol2Style.strokeColor,ol2Style.strokeOpacity, newStyle.getStroke().getColor()));
        newStyle.getImage().getStroke().setWidth(ol2Style.strokeWidth || newStyle.getStroke().getWidth());
        newStyle.getImage().getStroke().setLineCap(ol2Style.strokeLinecap || newStyle.getStroke().getLineCap());
        newStyle.getImage().getStroke().setLineDash(ol2Style.strokeDashstyle || newStyle.getStroke().getLineDash());

        newStyle.getImage().getFill().setColor(calculateColor(ol2Style.fillColor,ol2Style.fillOpacity,newStyle.getFill().getColor()));
        newStyle.getImage().setRadius(ol2Style.pointRadius || newStyle.getImage().getRadius());

        Object.freeze(newStyle);

        return newStyle;

    };

})(); 
