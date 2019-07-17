
ol.style.StyleConverter = function() {
}

ol.style.StyleConverter.prototype.convert = function(style) {
  
  var newStyle = new ol.style.Style();
  
  var stroke = new ol.style.Stroke();
  
  if (style.strokeWidth) {
    stroke.setWidth(style.strokeWidth);
  }
  if (style.strokeColor) {
    stroke.setColor(ol.style.StyleConverter.hexToRgb(style.strokeColor));
  }
  var fill = new ol.style.Fill();
  
  if (style.fillColor) {
    fill.setColor(ol.style.StyleConverter.hexToRgb(style.fillColor));
  }  
  
  if (style.fillOpacity) {
    fill.setColor(fill.getColor().push(style.fillOpacity);
  }  
     
  var circle = new ol.style.Circle();
                  
  if (style.pointRadius) {
    circle.setRadius(style.pointRadius);
  }
    
    style.setStroke(stroke);
    style.setFill(fill);
    style.setImage(circle);
    
    return style;
  
}

ol.style.StyleConverter.hexToRgb = function(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

