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
            // default color gradient
            colorGradient: { 
                colorStops : [
                    {"val":0,"color":"#08f"},
                    {"val":0.5,"color":"#03f"},
                    {"val":1,"color":"#005"}
                ]
            },
            colorResolution: 1024,
            naColor: "#000",
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
                var r1 = Math.min(rect[2],rect[3])*0.1;
                var r2 = Math.max(rect[2],rect[3]);
                var x = rect[0]+rect[2]*0.5;
                var y = rect[1]+rect[3]*0.5;
                var gradient = ctx.createRadialGradient(x,y,r1,x,y,r2);
                gradient.addColorStop(0,TreemapUtils.lighterColor(TreemapUtils.rgb2hex(rgb),0.2));
                gradient.addColorStop(1,TreemapUtils.darkerColor(TreemapUtils.rgb2hex(rgb),0.2));
                return gradient;
            },
            labelOption: 0, // index into label attribute of this.options.nodeData elements
            sizeOption: 0, // index into size attribute of this.options.nodeData elements
            colorOption: 0, // index into this.options.colorGradients array of color gradient definitions
            nodeBorderWidth: 0, // TODO: >0 doesn't work quite right yet
            enableLabels: true,
            nodeData: []
        },  

        // Set up the widget
        _create: function() {
            //this._refresh();
        },

        _init: function() {
            this._refresh();
        },

        _squarify: function(rect,vals) {
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
                var s = TreemapUtils.sumArray(r);
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
                    var rowHeight = Math.ceil(TreemapUtils.sumArray(row)/subrect.getW());
                    if (y+rowHeight >= maxY) { rowHeight = maxY-y; }
                    for (var i = 0; i < row.length; i++) {
                        var w = Math.ceil(row[i]/rowHeight);
                        if (x+w > maxX || i+1 == row.length) { w = maxX-x; }
                        layout.push([x,y,w,rowHeight]);
                        x = (x+w);
                    }
                    subrect.setY(y+rowHeight);
                } else {
                    var rowHeight = Math.ceil(TreemapUtils.sumArray(row)/subrect.getH());
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
                    break;
                case "enableLabels":
                    this.options.enableLabels = value;
                    this._renderNodes();
                    this._renderNodeLabels();
                    this._trigger("refresh",null,this.element);
                    break;
                case "nodeGradient":
                    this.options.nodeGradient = value;
                    this._renderNodes();
                    this._renderNodeLabels();
                    this._trigger("refresh",null,this.element);
                    break;
                case "colorGradient":
                    this.options.colorGradient = value;
                    this._refreshColorGradient();
                    this._renderNodes();
                    this._renderNodeLabels();
                    this._trigger("refresh",null,this.element);
                    break;
                case "colorOption":
                    this.options.colorOption = value;
                    this._refreshColorGradient();
                    this._renderNodes();
                    this._renderNodeLabels();
                    this._trigger("refresh",null,this.element);
                    break;
                case "sizeOption":
                    this.options.sizeOption = value;
                    this._refresh();
                    break;
                case "nodeData":
                    this.options.nodeData = value;
                    this._refresh();
                    break;
            }  
        },

        _refresh: function() {
            this._refreshCanvas();
            this._refreshLayout(this._squarify);
            this._refreshColorGradient();
            this._renderNodes();
            this._renderNodeLabels();
            this._trigger("refresh", null, this.element);
        },

        _renderNodes: function() {
            var headerGradient = function(ctx,rect,headerOptions) {
                var gradient = ctx.createLinearGradient(rect[0],rect[1],rect[0],rect[1]+headerOptions.height);
                for (var i in headerOptions.colorStops) {
                    gradient.addColorStop(parseFloat(headerOptions.colorStops[i].val),headerOptions.colorStops[i].color);
                }
                return gradient;
            };
            var processNodes = function(nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (that._isRootNode(nodes[i]) == false) { // skip root node
                        var rect = nodes[i].geometry;
                        if (isNaN(rect[0]) || isNaN(rect[1]) || isNaN(rect[2]) || isNaN(rect[3]) || rect[2] == 0. || rect[3] == 0.) continue; // blow off nodes w/o area TODO: track down why NaNs are showing up here
                        var rgb = that._getRgbColor(nodes[i].color[that.options.colorOption]);
                        nodes[i].computedColor = rgb;
                        ctx.save();
                        if ( nodes[i].hasOwnProperty('children')) { // group node
                            if(that.options.dimensions[0] > rect[0]+rect[2]) rect[2] -= that.options.nodeBorderWidth;
                            if(that.options.dimensions[1] > rect[1]+rect[3]) rect[3] -= that.options.nodeBorderWidth;
                            ctx.fillStyle = headerGradient(ctx,rect,that.options.groupHeader);
                        } else { // leaf node
                            ctx.fillStyle = that.options.nodeGradient.call(that,ctx,rect,rgb);
                        }
                        ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
                        if ( nodes[i].hasOwnProperty('children') && that.options.nodeBorderWidth == 0) {
                            ctx.strokeStyle = "#000";
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(rect[0]+rect[2],rect[1]);
                            ctx.lineTo(rect[0]+rect[2],rect[1]+that.options.groupHeader.height);
                            ctx.closePath();
                            ctx.stroke();
                        }
                        ctx.restore();
                        for (var j = 0; j < rect[3]; j++) {
                            that._addRunlength(rect[0],rect[0]+rect[2],(rect[1]+j),nodes[i].id);
                        }
                        nodeCnt++;
                    }
                    if (nodes[i].hasOwnProperty('children')) {
                        processNodes(nodes[i].children);
                    }
                }
            };
            var t0 = new Date();
            var that = this;
            var canvas = that.element.find("canvas")[0];
            var ctx = canvas.getContext("2d");
            var nodeCnt = 0;
            that._clearScanLines();
            processNodes(that.options.nodeData);
            var t1 = new Date();
            console.log("Render Layout: node count = " + nodeCnt + "; msec = " + (t1-t0));
        },

        _renderNodeLabels: function() {
            if (this.options.enableLabels != true) return;
            var processNodes = function(nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (that._isRootNode(nodes[i]) == false) { // skip root node
                        //console.log(nodes[i].label[that.options.labelOption]);
                        var rect = nodes[i].geometry;
                        if (isNaN(rect[0]) || isNaN(rect[1]) || isNaN(rect[2]) || isNaN(rect[3]) || rect[2] == 0. || rect[3] == 0.) continue; // blow off nodes w/o area TODO: track down why NaNs are showing up here
                        var rgb = nodes[i].computedColor;
                        var text = nodes[i].label[that.options.labelOption];
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(rect[0],rect[1],rect[2],rect[3]);
                        ctx.clip();
                        if ( nodes[i].hasOwnProperty('children')) {
                            // Group Node
                            ctx.fillStyle = '#555'; // TODO: make an option value
                            ctx.font = '0.625em Verdana, Geneva, sans-serif'; // TODO: make option value
                            ctx.fillText(text,rect[0],rect[1]+10);
                        } else {
                            // Leaf Node
                            if (TreemapUtils.avgRgb(rgb) <= 200) { // TODO: make an option value
                                ctx.fillStyle = '#fff'; // TODO: make an option value
                            } else {
                                ctx.fillStyle = '#888'; // TODO: make an option value
                            }
                            /* TODO: improve text fill of node
                            if (text.length > 13) {
                                text = text.substr(0,13);
                                text += '...';
                            }*/
                            /* Vary font size
                            var textMetrics = ctx.measureText(text);
                            var ptSize = Math.floor((rect[2] / textMetrics.width)*10);
                            ctx.font = 'italic '+ptSize+'px sans-serif';
                            ctx.fillText(text,rect[0],rect[1]+ptSize);
                            */
                            // TODO: only render text that fits node
                            ctx.font = '0.625em Verdana, Geneva, sans-serif'; // TODO: make option value
                            ctx.fillText(text,rect[0],rect[1]+10);
                        }
                        ctx.restore();
                    }
                    if (nodes[i].hasOwnProperty('children')) {
                        processNodes(nodes[i].children);
                    }
                    nodeCnt++;
                }
            };
            // TODO: variable size based on node size | fixed size and position
            var t0 = new Date();
            var that = this;
            var canvas = that.element.find("canvas")[0];
            var ctx = canvas.getContext("2d");
            var nodeCnt = 0;
            processNodes(that.options.nodeData);
            var t1 = new Date();
            console.log("Render Node Labels: node count = " + nodeCnt + "; msec = " + (t1-t0));
        },

        _refreshCanvas: function() {
            var canvas = this.element.find("canvas");
            if (canvas){
                canvas.remove();
            }
            canvas = document.createElement("canvas");
            canvas.setAttribute("width",this.options.dimensions[0]);
            canvas.setAttribute("height",this.options.dimensions[1]);
            var that = this; // to pass this to event handler
            this.element.append(canvas).mousemove(function(e){
                var offset = that.element.offset();
                var offsetX = parseInt(offset.left); // offsets are float values on mac/FF
                var offsetY = parseInt(offset.top); // convert them to ints so coordsToId will work
                var width = that.options.dimensions[0];
                var height = that.options.dimensions[1];
                if (e.pageX < offsetX+width && e.pageY < (offsetY+height))
                {
                    var ids = that._coordsToId(e.pageX-offsetX,e.pageY-offsetY);
                    var nodes = [];
                    for ( var i = 0; i < ids.length; i++ )
                    {
                        nodes.push(that._getNode([ids[i]]));
                    }
                    var data = {"nodes": nodes, "ids": ids};
                    that._trigger('mousemove',e,data);
                }
            }).click(function(e){
                var offset = that.element.offset();
                var offsetX = parseInt(offset.left); // offsets are float values on mac/FF
                var offsetY = parseInt(offset.top); // convert them to ints so coordsToId will work
                var width = that.options.dimensions[0];
                var height = that.options.dimensions[1];
                if (e.pageX < offsetX+width && e.pageY < (offsetY+height))
                {
                    var ids = that._coordsToId(e.pageX-offsetX,e.pageY-offsetY);
                    var nodes = [];
                    for ( var i = 0; i < ids.length; i++ )
                    {
                        nodes.push(that._getNode([ids[i]]));
                    }
                    var data = {"nodes": nodes, "ids": ids};
                    that._trigger('click',e,data);
                }
            });
        },

        _refreshColorGradient: function() {
            var canvas = document.createElement("canvas");
            var colorGradient = this.options.colorGradient;
            canvas.setAttribute("width",this.options.colorResolution);
            canvas.setAttribute("height",1);
            if (typeof(G_vmlCanvasManager) != 'undefined') G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext("2d");
            var gradient1 = ctx.createLinearGradient(0, 0, this.options.colorResolution, 0);
            for (var i = 0; i < colorGradient.colorStops.length; i += 1) {
                gradient1.addColorStop(colorGradient.colorStops[i].val,colorGradient.colorStops[i].color);
            }
            ctx.fillStyle=gradient1;
            ctx.fillRect(0,0,this.options.colorResolution,1);
            this.options.colorGradientMap = ctx.getImageData(0,0,this.options.colorResolution,1);
        },

        _refreshLayout: function(layoutMethod) {
            function _processNodes(rect,nodes,area,layoutMethod) {
                nodes.sort(function(x,y){
                    if (x.size[that.options.sizeOption] > y.size[that.options.sizeOption])
                        return -1;
                    if (x.size[that.options.sizeOption] < y.size[that.options.sizeOption])
                        return 1;
                    return 0;
                });
                var a = [];
                for (var i = 0; i < nodes.length; i++) {
                    a[i]=nodes[i].size[that.options.sizeOption]*area;
                }
                var b = layoutMethod([rect[0],rect[1],rect[2],rect[3]],a);
                nodeCnt += b.length;
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].geometry = b[i];//.slice();
                    that._addNode2NodeList(nodes[i]);
                }
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].hasOwnProperty('children')) {
                        rect = nodes[i].geometry;
                        // adjust rect according to header height
                        if (that._isRootNode(nodes[i]) == false && (rect[3]-that.options.groupHeader.height>0)) { // skips root node
                            rect = [rect[0],rect[1]+that.options.groupHeader.height,rect[2],rect[3]-that.options.groupHeader.height];
                        }
                        // adjust rect according to border width
                        if (that._isRootNode(nodes[i]) == false && (rect[3]-that.options.nodeBorderWidth>0)) { // skips root node
                            //rect = [rect[0],rect[1],rect[2]-that.options.nodeBorderWidth,rect[3]-that.options.nodeBorderWidth];
                            if(that.options.dimensions[0] > rect[0]+rect[2]) rect[2] -= that.options.nodeBorderWidth;
                            if(that.options.dimensions[1] > rect[1]+rect[3]) rect[3] -= that.options.nodeBorderWidth;
                        }
                        area = rect[2]*rect[3];
                        _processNodes(rect,nodes[i].children,area,layoutMethod);
                    }
                }
            };
            var t0 = new Date();
            var that = this;
            var nodeCnt = 0;
            var area = that.options.dimensions[0] * that.options.dimensions[1];
            var rect = [0,0,that.options.dimensions[0],that.options.dimensions[1]];
            that._clearNodeList();
            _processNodes(rect,that.options.nodeData,area,layoutMethod);
            var t1 = new Date();
            console.log("Computing Layout: node count = " + nodeCnt + "; msec = " + (t1-t0));
        },

        _getRgbColor: function(val) {
            //console.log(val);
            if (val == null) return TreemapUtils.hex2rgb(this.options.naColor);
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
            if (this.scanLines === undefined) return [];
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

        // nodeList is internal index into nodeData nodes
        _clearNodeList: function() {
            if (this.nodeList) {
                this.nodeList.length = 0;
            }
        },

        _addNode2NodeList: function(node) {
            if (this.nodeList === undefined) {
                this.nodeList = [];
            }
            if (!this.nodeList[node.id]) {
                this.nodeList[node.id] = node;
            }
        },

        _getNode: function(id){
            return this.nodeList[id];
        },

        _isRootNode: function(node) {
            if (this.options.nodeData[0] === node)
                return true;
            return false;
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
// sumArray is copied from: 
// http://stackoverflow.com/questions/3762589/fastest-javascript-summation
// 
TreemapUtils.sumArray = function() {
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
    return Math.floor(TreemapUtils.sumArray(rgb)/3);
};

TreemapUtils.hex2rgb = function(color) {
    // Convert hex to decimal
    return color.replace(
        /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
        function() {
            return parseInt(arguments[1], 16) + ',' +
                parseInt(arguments[2], 16) + ',' +
                parseInt(arguments[3], 16);
        }
    ).split(/,/); // return array
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

