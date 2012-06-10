/*******************************************************************************
 * Copyright (c) 2012 Evan Carey,
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Evan Carey - initial API and implementation and initial documentation
 *******************************************************************************/ 

(function( $ ) {
    $.widget( "ui.treemap", {
        // These options will be used as defaults
        options: {
            // in future get dimensions from containing element maybe?
            dimensions: [600,400],
            // For initial dev, color gradient is hard coded here.  
            colorGradient: { 
                resolution: 1024,
                colorStops : [
                    {"val":0,  "color":"#a03"},
                    {"val":.25,"color":"#c77"},
                    {"val":.5, "color":"#fff"},
                    {"val":.75,"color":"#77c"},
                    {"val":1,  "color":"#30a"}
                ]
            },
            groupHeader: {
                height: 12,
                colorStops : [
                    {"val":0, "color":"#ccc"},
                    {"val":.4, "color":"#fff"},
                    {"val":.6, "color":"#fff"},
                    {"val":1, "color":"#777"}
                ]
            },
            nodeGradient: function(ctx,rect,rgb) {
                var gradient = ctx.createLinearGradient(rect[0],rect[1],rect[0]+rect[2],rect[1]+rect[3]);
                gradient.addColorStop(0,TreemapUtils.rgb2hex(rgb));
                gradient.addColorStop(0.65,TreemapUtils.rgb2hex(rgb));
                gradient.addColorStop(1,TreemapUtils.darkerColor(TreemapUtils.rgb2hex(rgb),0.1));
                return gradient;
            },
            nodeBorderWidth: 0,
            // For initial dev, node list is hard coded here.  
            // In future node list will be obtained from ajax call and/or setOption call.
            // nodeList format subject to change after working through rendering.
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
            $(window).resize(function(){  
            });  
        },

        _init: function() {
            this._refresh();
        },

        _squarify: function(rect,vals) {
            //
            // sumArray is copied from: 
            // http://stackoverflow.com/questions/3762589/fastest-javascript-summation
            // 
            var sumArray = function() {
                // Use one adding function rather than create a new one each
                // time sumArray is called.
                function add(a,b) {
                    return a + b;
                }
                return function(arr) {
                    return arr.reduce(add);
                };
            }();
            //
            // Non-recursive version of algorithm published in:
            // "Squarified Treemaps" by Mark Bruls, Kees Huizing and Jarke J. van Wijk
            // http://www.win.tue.nl/~vanwijk/stm.pdf
            //
            // Includes tips and tricks from:
            // http://ejohn.org/blog/fast-javascript-maxmin/#postcomment
            //
            var Subrectangle = function(rect) {
                this.setX = function(x) {
                    rect[2] -= x - rect[0];
                    rect[0] = x;
                }
                this.setY = function(y) {
                    rect[3] -= y - rect[1];
                    rect[1] = y;
                }
                this.getX = function() {
                    return rect[0];
                }
                this.getY = function() {
                    return rect[1];
                }
                this.getW = function() {
                    return rect[2];
                }
                this.getH = function() {
                    return rect[3];
                }
                this.getWidth = function() {
                    return Math.min(rect[2],rect[3]);
                }
            };
            //
            // The function worst() gives the highest aspect ratio of a list 
            // of rectangles, given the length of the side along which they are to
            // be laid out.
            // Let a list of areas R be given and let s be their total sum. Then the function worst is
            // defined by:
            // worst(R,w) = max(max(w^2r=s^2; s^2=(w^2r)))
            //              for all r in R 
            // Since one term is increasing in r and the other is decreasing, this is equal to
            //              max(w^2r+=(s^2); s^2=(w^2r-))
            // where r+ and r- are the maximum and minimum of R. 
            // Hence, the current maximum and minimum of the row that is being laid out.
            // 
            var worst = function(r,w) {
                var rMax = Math.max.apply(null,r);
                var rMin = Math.min.apply(null,r);
                var s = sumArray(r);
                var sSqr = s*s;
                var wSqr = w*w;
                return Math.max((wSqr*rMax)/sSqr,sSqr/(wSqr*rMin));
            };

            // Take row of values and calculate the set of rectangles 
            // that will fit in the current subrectangle.
            var layoutrow = function(row) {
                var x = subrect.getX();
                var y = subrect.getY();
                var maxX = x + subrect.getW();
                var maxY = y + subrect.getH();
                if (subrect.getW() < subrect.getH()) {
                    var rowHeight = Math.ceil(sumArray(row)/subrect.getW());
                    if (y+rowHeight >= maxY) { rowHeight = maxY-y; }
                    for (var i = 0; i < row.length; i++) {
                        var w = Math.ceil(row[i]/rowHeight);
                        if (x+w > maxX || i+1 == row.length) { w = maxX-x; }
                        layout.push([x,y,w,rowHeight]);
                        x = (x+w);
                    }
                    subrect.setY(y+rowHeight);
                } else {
                    var rowHeight = Math.ceil(sumArray(row)/subrect.getH());
                    if (x+rowHeight >= maxX) { rowHeight = maxX-x; }
                    for (var i = 0; i < row.length; i++) {
                        var w = Math.ceil(row[i]/rowHeight);
                        if (y+w > maxY || i+1 == row.length) { w = maxY-y; }
                        layout.push([x,y,rowHeight,w]);
                        y = (y+w);
                    }
                    subrect.setX(x+rowHeight);
                }
            };

            // Pull values from input array until the aspect ratio of rectangles in row
            // under construction degrades.
            var buildRow = function(children) {
                var row = [];
                row.push(children.shift()); // descending input
                //row.push(children.pop()); // ascending input
                if (children.length == 0) {
                    return row;
                }
                var newRow = row.slice();
                var w = subrect.getWidth();
                do {
                    newRow.push(children[0]); // descending input
                    //newRow.push(children[children.length-1]); // ascending input
                    if (worst(row,w) > worst(newRow,w)){
                        row = newRow.slice();
                        children.shift(); // descending input
                        //children.pop(); // ascending input
                    }
                    else {
                        break;
                    }
                } while (children.length > 0);
                return row;
            };

            // Non recursive version of Bruls, Huizing and van Wijk
            // squarify layout algorithim.
            // While values exist in input array, make a row with good aspect
            // ratios for its values then caclulate the row's geometry, repeat.
            var nrSquarify = function(children) {
                do {
                    layoutrow(buildRow(children));
                } while (children.length > 0);
            };
        
            var row = [];
            var layout = [];
            var subrect = new Subrectangle(rect.slice());
            nrSquarify(vals.slice());
            return layout;
        },

        // Use the _setOption method to respond to changes to options
        _setOption: function(option, value) {  
            $.Widget.prototype._setOption.apply( this, arguments );  
            switch (option) {  
                case "dimensions":
                    this.options.dimensions = value;
                    this._refresh();
                    this._trigger("refresh",null,this.element);
                    break;
                case "nodeGradient":
                    this.options.nodeGradient = value;
                    //this._refresh();
                    //this._refreshColorGradient();
                    this._render();
                    this._trigger("refresh",null,this.element);
                    break;
                case "colorGradient":
                    this.options.colorGradient = value;
                    //this._refresh();
                    this._refreshColorGradient();
                    this._render();
                    this._trigger("refresh",null,this.element);
                    break;
                case "nodeList":
                    this.options.nodeList = value;
                    this._refresh();
                    break;
            }  
        },

        _refresh: function() {
            this._refreshCanvas();
            this._refreshLayout(this._squarify);
            this._refreshColorGradient();
            this._render();
            this._trigger("refresh", null, this.element);
        },

        _render: function() {
            var t0 = new Date();
            
            var headerGradient = function(ctx,rect,headerOptions) {
                var gradient = ctx.createLinearGradient(rect[0],rect[1],rect[0],rect[1]+headerOptions.height);
                for (var i in headerOptions.colorStops) {
                    gradient.addColorStop(parseFloat(headerOptions.colorStops[i].val),headerOptions.colorStops[i].color);
                }
                return gradient;
            }

            var canvas = this.element.find("canvas")[0];
            var ctx = canvas.getContext("2d");
            var nodeCnt = 0;
            this._clearScanLines();
            for (var i in this.options.nodeList) {
                var rect = this.options.nodeList[i].geometry;
                var rgb = this._getRgbColor(this.options.nodeList[i].color);
                this.options.nodeList[i].computedColor = rgb;
                ctx.save();
                if ( this.options.nodeList[i].hasOwnProperty('children')) {
                    // group node
                    ctx.fillStyle = headerGradient(ctx,rect,this.options.groupHeader);
                } else {
                    ctx.fillStyle = this.options.nodeGradient.call(this,ctx,rect,rgb);
                }
                ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
                if ( this.options.nodeList[i].hasOwnProperty('children')) {
                    ctx.strokeStyle = "#000";
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(rect[0],rect[1]);
                    ctx.lineTo(rect[0],rect[1]+this.options.groupHeader.height);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(rect[0]+rect[2],rect[1]);
                    ctx.lineTo(rect[0]+rect[2],rect[1]+this.options.groupHeader.height);
                    ctx.closePath();
                    ctx.stroke();
                }
                //ctx.beginPath();
                //ctx.rect(rect[0],rect[1],rect[2],rect[3]);
                //ctx.clip();
                ctx.restore();
                for (var j = 0; j < rect[3]; j++) {
                    this._addRunlength(rect[0],rect[0]+rect[2],(rect[1]+j),i);
                }
                nodeCnt++;
            }
            var t1 = new Date();
            console.log("Render Layout: node count = " + nodeCnt + "; msec = " + (t1-t0));
        },

        _refreshCanvas: function() {
            var canvas = this.element.find("canvas");
            if (canvas){
                canvas.remove();
            }
            canvas = document.createElement("canvas");
            canvas.setAttribute("width",this.options.dimensions[0]);
            canvas.setAttribute("height",this.options.dimensions[1]);
            var blah = this; // to pass this to event handler
            this.element.append(canvas).mousemove(function(e){
                var offset = blah.element.offset();
                var offsetX = parseInt(offset.left); // offsets are float values on mac/FF
                var offsetY = parseInt(offset.top); // convert them to ints so coordsToId will work
                var width = blah.options.dimensions[0];
                var height = blah.options.dimensions[1];
                if (e.pageX < offsetX+width && e.pageY < (offsetY+height))
                {
                    var ids = blah._coordsToId(e.pageX-offsetX,e.pageY-offsetY);
                    var nodes = [];
                    for ( var i = 0; i < ids.length; i++ )
                    {
                        nodes.push(blah.options.nodeList[ids[i]]);
                    }
                    var data = {"nodes": nodes, "ids": ids};
                    blah._trigger('mousemove',e,data);
                }
            }).click(function(e){
                var offset = blah.element.offset();
                var offsetX = parseInt(offset.left); // offsets are float values on mac/FF
                var offsetY = parseInt(offset.top); // convert them to ints so coordsToId will work
                var width = blah.options.dimensions[0];
                var height = blah.options.dimensions[1];
                if (e.pageX < offsetX+width && e.pageY < (offsetY+height))
                {
                    var ids = blah._coordsToId(e.pageX-offsetX,e.pageY-offsetY);
                    var nodes = [];
                    for ( var i = 0; i < ids.length; i++ )
                    {
                        nodes.push(blah.options.nodeList[ids[i]]);
                    }
                    var data = {"nodes": nodes, "ids": ids};
                    blah._trigger('click',e,data);
                }
            });
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

        _refreshLayout: function(layoutMethod) {
            var t0 = new Date();
            var nodeCnt = 0;
            function _processNodes(rect,children,nodes,area,layoutMethod,header) {
                var a = [];
                for (var i = 0; i < children.length; i++) {
                    a[i]=nodes[children[i]].size*area;
                }
                var b = layoutMethod([rect[0],rect[1],rect[2],rect[3]],a);
                nodeCnt += b.length;
                for (var i = 0; i < children.length; i++) {
                    nodes[children[i]].geometry = b[i];//.slice();
                }
                for (var i = 0; i < children.length; i++) {
                    if (nodes[children[i]].hasOwnProperty('children')) {
                        rect = nodes[children[i]].geometry;
                        if ((children[i] != 0) && (rect[3]-header>0)) {
                            rect = [rect[0],rect[1]+header,rect[2],rect[3]-header];
                        }
                        area = rect[2]*rect[3];
                        _processNodes(rect,nodes[children[i]].children,nodes,area,layoutMethod,header);
                    }
                }
            };
            var header = this.options.groupHeader.height;
            var area = this.options.dimensions[0] * this.options.dimensions[1];
            var rect = [0,0,this.options.dimensions[0],this.options.dimensions[1]];
            _processNodes(rect,[0],this.options.nodeList,area,layoutMethod,header);
            var t1 = new Date();
            console.log("Computing Layout: node count = " + nodeCnt + "; msec = " + (t1-t0));
        },

        _getRgbColor: function(val) {
            var map = this.options.colorGradientMap.data;
            var i = Math.floor(val*(map.length/4))*4;
            return [map[i],map[i+1],map[i+2]];
        },

        _clearScanLines: function() {
            if (this.scanLines) {
                this.scanLines.length = 0;
            }
        },

        _addRunlength: function(x1,x2,y,id) {
            if (this.scanLines === undefined) {
                this.scanLines = [];
            }
            y_str = parseInt(y);
            if(!this.scanLines[y_str]){
                this.scanLines[y_str] = [];
            }
            this.scanLines[y_str].push(new Array(x1,x2,id));
            //this.scanLines[y_str].unshift(new Array(x1,x2,id));
        },

        _coordsToId: function(x, y) {
            var runlengths = this.scanLines[y];
            var ids = new Array();
            if (runlengths) {
                for (var i = runlengths.length-1; i >= 0; i--) {
                    var runlength = runlengths[i];
                    var xstart = runlength[0];
                    var xend = runlength[1];
                    var id = runlength[2];
                    if (xstart<=x && xend>x) {
                        ids.push(id);
                    }
                }
            }
            return ids;
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

var TreemapUtils = TreemapUtils || {};

//
// Color shifting algo from: http://stackoverflow.com/questions/1507931/generate-lighter-darker-color-in-css-using-javascript
// 
// Modified to use the lpad function defined below.
//
// Exmaple Usage
// var darker = darkerColor('rgba(80, 75, 52, .5)', .2);
// var lighter = lighterColor('rgba(80, 75, 52, .5)', .2);

//var pad = function(num, totalChars) {
//    var pad = '0';
//    num = num + '';
//    while (num.length < totalChars) {
//        num = pad + num;
//    }
//    return num;
//};

// Ratio is between 0 and 1
TreemapUtils.changeColor = function(color, ratio, darker) {
    // Trim trailing/leading whitespace
    color = color.replace(/^\s*|\s*$/, '');

    // Expand three-digit hex
    color = color.replace(
        /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
        '#$1$1$2$2$3$3'
    );

    // Calculate ratio
    var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
        // Determine if input is RGB(A)
        rgb = color.match(new RegExp('^rgba?\\(\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '(?:\\s*,\\s*' +
            '(0|1|0?\\.\\d+))?' +
            '\\s*\\)$'
        , 'i')),
        alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

        // Convert hex to decimal
        decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
            /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
            function() {
                return parseInt(arguments[1], 16) + ',' +
                    parseInt(arguments[2], 16) + ',' +
                    parseInt(arguments[3], 16);
            }
        ).split(/,/),
        returnValue;

    // Return RGB(A)
    return !!rgb ?
        'rgb' + (alpha !== null ? 'a' : '') + '(' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ) +
            (alpha !== null ? ', ' + alpha : '') +
            ')' :
        // Return hex
        [
            '#',
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ).toString(16).lpad("0",2),
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ).toString(16).lpad("0",2),
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ).toString(16).lpad("0",2)
        ].join('');
};

TreemapUtils.lighterColor = function(color, ratio) {
    return TreemapUtils.changeColor(color, ratio, false);
};

TreemapUtils.darkerColor = function(color, ratio) {
    return TreemapUtils.changeColor(color, ratio, true);
};

TreemapUtils.rgb2hex = function(rgb) {
    var str = "#"+((rgb[2]|(rgb[1]<<8)|(rgb[0]<<16)).toString(16).lpad("0",6));
    return str;
};

TreemapUtils.avgRgb = function(rgb) {
    return Math.floor(sumArray(rgb)/3);
};

//
// String functions from: http://sajjadhossain.com/2008/10/31/javascript-string-trimming-and-padding/
//
//trimming space from both side of the string
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}
 
//trimming space from left side of the string
String.prototype.ltrim = function() {
    return this.replace(/^\s+/,"");
}
 
//trimming space from right side of the string
String.prototype.rtrim = function() {
    return this.replace(/\s+$/,"");
}

//pads left
String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

//pads right
String.prototype.rpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}

