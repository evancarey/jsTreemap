(function( $ ) {
    $.widget( "ui.treemap", {
    // These options will be used as defaults
    options: {  
        dimensions: [600,400],
        colorGradient: { 
            resolution: 1024,
            colorStops : [
                {"val":0,  "color":"#033"},
                {"val":.25,"color":"#066"},
                {"val":.5, "color":"#666"},
                {"val":.75,"color":"#660"},
                {"val":1,  "color":"#330"}
            ],
        },
        groupHeaderHeight: 0,
        nodeBorderWidth: 0,
        nodeList: {
            0:{"size":1.0, "color":.74, "label":"root", "children":[1,2,3,4,5,6,7]},
            1:{"size":.25, "color":.39, "label":"blah1", "parent":0, "children":[11,12,13,14,15,16,17]},
            2:{"size":.25, "color":.52, "label":"blah2", "parent":0, "children":[21,22,23,24,25,26,27]},
            3:{"size":.16667, "color":.74, "label":"blah3", "parent":0, "children":[31,32,33,34,35,36,37]},
            4:{"size":.125, "color":.52, "label":"blah4", "parent":0, "children":[41,42,43,44,45,46,47]},
            5:{"size":.083333, "color":.39, "label":"blah5", "parent":0, "children":[51,52,53,54,55,56,57]},
            6:{"size":.083333, "color":.98, "label":"blah6", "parent":0, "children":[61,62,63,64,65,66,67]},
            7:{"size":.041666667, "color":.85, "label":"blah7", "parent":0, "children":[71,72,73,74,75,76,77]},
            11:{"size":.25, "color":.74, "label":"blah11\nbleep\nblue", "parent":1},
            12:{"size":.25, "color":.98, "label":"blah12", "parent":1},
            13:{"size":.16667, "color":.39, "label":"blah13", "parent":1},
            14:{"size":.125, "color":.19, "label":"blah14", "parent":1},
            15:{"size":.083333, "color":.52, "label":"blah15", "parent":1},
            16:{"size":.083333, "color":.98, "label":"blah16", "parent":1},
            17:{"size":.041666667, "color":.74, "label":"blah17", "parent":1},
            21:{"size":.25, "color":.32, "label":"blah21", "parent":2},
            22:{"size":.25, "color":.39, "label":"blah22", "parent":2},
            23:{"size":.16667, "color":.32, "label":"blah23", "parent":2},
            24:{"size":.125, "color":.85, "label":"blah24", "parent":2},
            25:{"size":.083333, "color":.52, "label":"blah25", "parent":2},
            26:{"size":.083333, "color":.63, "label":"blah26", "parent":2},
            27:{"size":.041666667, "color":.19, "label":"blah27", "parent":2},
            31:{"size":.25, "color":.39, "label":"blah31", "parent":3},
            32:{"size":.25, "color":.85, "label":"blah32", "parent":3},
            33:{"size":.16667, "color":.63, "label":"blah33", "parent":3, "children":[331,332,333,334,335,336,337]},
            331:{"size":.25, "color":.39, "label":"blah331", "parent":33},
            332:{"size":.25, "color":.85, "label":"blah332", "parent":33},
            333:{"size":.16667, "color":.63, "label":"blah333", "parent":33},
            334:{"size":.125, "color":.52, "label":"blah334", "parent":33},
            335:{"size":.083333, "color":.74, "label":"blah335", "parent":33},
            336:{"size":.083333, "color":.29, "label":"blah336", "parent":33},
            337:{"size":.041666667, "color":.98, "label":"blah337", "parent":33},
            34:{"size":.125, "color":.52, "label":"blah34", "parent":3},
            35:{"size":.083333, "color":.74, "label":"blah35", "parent":3},
            36:{"size":.083333, "color":.29, "label":"blah36", "parent":3},
            37:{"size":.041666667, "color":.98, "label":"blah37", "parent":3},
            41:{"size":.25, "color":.19, "label":"blah41", "parent":4},
            42:{"size":.25, "color":.52, "label":"blah42", "parent":4},
            43:{"size":.16667, "color":.09, "label":"blah43", "parent":4},
            44:{"size":.125, "color":.32, "label":"blah44", "parent":4},
            45:{"size":.083333, "color":.39, "label":"blah45", "parent":4},
            46:{"size":.083333, "color":.31, "label":"blah46", "parent":4},
            47:{"size":.041666667, "color":.74, "label":"blah47", "parent":4},
            51:{"size":.25, "color":.31, "label":"blah51", "parent":5},
            52:{"size":.25, "color":.85, "label":"blah52", "parent":5},
            53:{"size":.16667, "color":.63, "label":"blah53", "parent":5},
            54:{"size":.125, "color":.52, "label":"blah54", "parent":5},
            55:{"size":.083333, "color":.98, "label":"blah55", "parent":5},
            56:{"size":.083333, "color":.32, "label":"blah56", "parent":5},
            57:{"size":.041666667, "color":.39, "label":"blah57", "parent":5},
            61:{"size":.25, "color":.19, "label":"blah61", "parent":6},
            62:{"size":.25, "color":.74, "label":"blah62", "parent":6},
            63:{"size":.16667, "color":.29, "label":"blah63", "parent":6},
            64:{"size":.125, "color":.52, "label":"blah64", "parent":6},
            65:{"size":.083333, "color":.74, "label":"blah65", "parent":6},
            66:{"size":.083333, "color":.39, "label":"blah66", "parent":6},
            67:{"size":.041666667, "color":.63, "label":"blah67", "parent":6},
            71:{"size":.25, "color":.39, "label":"blah71", "parent":7},
            72:{"size":.25, "color":.52, "label":"blah72", "parent":7},
            73:{"size":.16667, "color":.74, "label":"blah73", "parent":7},
            74:{"size":.125, "color":.85, "label":"blah74", "parent":7},
            75:{"size":.083333, "color":.98, "label":"blah75", "parent":7},
            76:{"size":.083333, "color":.74, "label":"blah76", "parent":7},
            77:{"size":.041666667, "color":.52, "label":"blah77", "parent":7},
        }
    },  
    // Set up the widget
    _create: function() {
        this._refresh();
        $(window).resize(function(){  
        });  
    },
    _init: function() {
    },
    // Use the _setOption method to respond to changes to options
    _setOption: function(option, value) {  
        $.Widget.prototype._setOption.apply( this, arguments );  
        switch (option) {  
            case "dimensions":
                this.options.dimensions = value;
                this._refresh();
                break;
        }  
    },
    _refresh: function() {
        this._refreshCanvas();
        this._refreshColorGradient();
        this._trigger("refresh", null, this.element);
    },
    _refreshCanvas: function() {
        var canvas = this.element.find("canvas");
        if (canvas)
            canvas.remove();
        canvas = document.createElement("canvas");
        canvas.setAttribute("width",this.options.dimensions[0]);
        canvas.setAttribute("height",this.options.dimensions[1]);
        this.element.append(canvas);
    },
    _refreshColorGradient: function() {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width",this.options.colorGradient.resolution);
        canvas.setAttribute("height",1);
        if (typeof(G_vmlCanvasManager) != 'undefined') G_vmlCanvasManager.initElement(canvas);
        var ctx = canvas.getContext("2d");
        var gradient1 = ctx.createLinearGradient(0, 0, this.options.colorGradient.resolution, 0);
        for (var i = 0; i < this.options.colorGradient.colorStops.length; i += 1) {
            gradient1.addColorStop(this.options.colorGradient.colorStops[i].val,this.options.colorGradient.colorStops[i].color);
        }
        ctx.fillStyle=gradient1;
        ctx.fillRect(0,0,this.options.colorGradient.resolution,1);
        this.options.colorGradientMap = ctx.getImageData(0,0,this.options.colorGradient.resolution,1);
    },
    _refreshLayout: function() {
        var t0 = new Date();
        var t1 = new Date();
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
