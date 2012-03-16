(function( $ ) {
  $.widget( "ui.treemap", {
    // These options will be used as defaults
    options: {  
      dimensions: [600,400]
    },  
    // Set up the widget
    _create: function() {
        var self = this,  
            o = self.options,  
            el = self.element;  
        self._refresh(o.dimensions);
        self._trigger("added", null, canvas);  
        $(window).resize(function(){  
        });  
    },
    // Use the _setOption method to respond to changes to options
    _setOption: function(option, value) {  
        $.Widget.prototype._setOption.apply( this, arguments );  
        switch (option) {  
            case "dimensions":
                this._refresh(value);
                this._trigger("resize", null, canvas);
                break;
        }  
    },
    _refresh: function(dimensions) {
        var el = this.element;  
        var canvas = el.find("canvas");
        if (canvas)
            canvas.remove();
        canvas = document.createElement("canvas");
        canvas.setAttribute("width",dimensions[0]);
        canvas.setAttribute("height",dimensions[1]);
        el.append(canvas);
    },
    // Use the destroy method to clean up any modifications your widget has made to the DOM
    destroy: function() {
        this.element.find("canvas").remove();  
        $(window).unbind("resize");  
        // In jQuery UI 1.8, you must invoke the destroy method from the base widget
        $.Widget.prototype.destroy.call( this );
        // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
    }
  });

}( jQuery ) );
