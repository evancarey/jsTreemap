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
                    {"val":0,"color":"#770"},
                    {"val":0.5,"color":"#fff"},
                    {"val":1,"color":"#077"}
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
                var r1 = Math.min(rect[2],rect[3])*0.1;
                var r2 = Math.max(rect[2],rect[3]);
                var x = rect[0]+rect[2]*0.5;
                var y = rect[1]+rect[3]*0.5;
                var gradient = ctx.createRadialGradient(x,y,r1,x,y,r2);
                gradient.addColorStop(0,TreemapUtils.lighterColor(TreemapUtils.rgb2hex(rgb),0.2));
                gradient.addColorStop(1,TreemapUtils.darkerColor(TreemapUtils.rgb2hex(rgb),0.2));
                return gradient;
            },
            nodeBorderWidth: 0,
            nodeData: [
                {"id":"2fc414e2-ae59-41ed-8cba-377be0950b9d", "label":"root", "size":1.0, "color":.74, "children":[
                    {"id":"23f627dc-6078-403e-96d3-c05aabf9f2c9", "label":"blah1", "size":.25, "color":.39, "children":[
                        {"id":"ce96d31f-24fa-4258-bd25-c94191096c86", "label":"blah11", "size":.25, "color":.74},
                        {"id":"91e0ea1d-47e9-4520-b991-2fdb7d73caf1", "label":"blah12", "size":.25, "color":.98},
                        {"id":"62188591-f1b2-42df-a6aa-6831a8c53352", "label":"blah13", "size":.16667, "color":.39},
                        {"id":"b80861a4-cdad-49fa-b6f3-aa8508f2bf7d", "label":"blah14", "size":.125, "color":.19},
                        {"id":"9216f340-4949-472b-8246-b25a71dd9916", "label":"blah15", "size":.083333, "color":.52},
                        {"id":"40236148-e7b4-4a0d-ba33-463b814ba736", "label":"blah16", "size":.083333, "color":.98},
                        {"id":"c12264b7-e79e-444d-b357-6b002f0ada65", "label":"blah17", "size":.041666667, "color":.74}
                    ]},
                    {"id":"126debf5-aa68-45bb-9603-8808d6bfdb79", "label":"blah2", "size":.25, "color":.52, "children":[
                        {"id":"634c7555-31a8-4d35-adf3-b078b91b6fa1", "label":"blah21", "size":.25, "color":.32},
                        {"id":"2eac5833-59f8-49df-be6d-5debc8af0a83", "label":"blah22", "size":.25, "color":.39},
                        {"id":"50790bdd-f30d-4c52-960f-ec396a20ecc1", "label":"blah23", "size":.16667, "color":.32},
                        {"id":"15b8f1e1-e0ee-4780-9d12-dc483384e678", "label":"blah24", "size":.125, "color":.85},
                        {"id":"4e14522d-04bc-4a1c-8c66-3a847d38782d", "label":"blah25", "size":.083333, "color":.52},
                        {"id":"92cf9150-3b91-47dd-8dce-d9a4c9c7e8ee", "label":"blah26", "size":.083333, "color":.63},
                        {"id":"97794307-46b8-44eb-865d-3d8c2a95ea83", "label":"blah27", "size":.041666667, "color":.19}
                    ]},
                    {"id":"7e3f0349-ce9d-4aea-a203-0e0a0cc45ada", "label":"blah3", "size":.16667, "color":.74, "children":[
                        {"id":"1dbf73a8-585b-4075-9f63-c16201204a03", "label":"blah31", "size":.25, "color":.39},
                        {"id":"caefaba5-ab72-4445-8f9d-ce1e62f68606", "label":"blah32", "size":.25, "color":.85},
                        {"id":"89bd30be-b249-41d0-a24b-6fe4a5c20ffe", "label":"blah33", "size":.16667, "color":.63, "children":[
                            {"id":"7d56b381-3543-4ada-8a9b-86a8adce97a2", "label":"blah331", "size":.25, "color":.39},
                            {"id":"5f3fcf29-7b66-46cc-955d-9fe3ba08d37a", "label":"blah332", "size":.25, "color":.85},
                            {"id":"50aa205c-57e7-4c6a-b2f9-a50df14593ff", "label":"blah333", "size":.16667, "color":.63},
                            {"id":"beba7a53-cc5c-4fd8-8de0-3263f3e9973c", "label":"blah334", "size":.125, "color":.52},
                            {"id":"b15f0ae4-179d-4557-b755-57c25a69c150", "label":"blah335", "size":.083333, "color":.74},
                            {"id":"cecbda69-3736-457e-8128-674277e618cf", "label":"blah336", "size":.083333, "color":.29},
                            {"id":"496c7052-6826-4860-8ebd-70ee441ac3e3", "label":"blah337", "size":.041666667, "color":.98}
                        ]},
                        {"id":"57582ef2-b933-485f-9b20-8db82db7403e", "label":"blah34", "size":.125, "color":.52},
                        {"id":"ef593822-a89f-4241-98fe-973349ad487d", "label":"blah35", "size":.083333, "color":.74},
                        {"id":"c93cd65d-a96c-4090-b277-9ddc5f645b06", "label":"blah36", "size":.083333, "color":.29},
                        {"id":"81c3e4d8-7ea9-4f7c-a401-01c901b2e9ad", "label":"blah37", "size":.041666667, "color":.98}
                    ]},
                    {"id":"a3bec3a8-55b6-4d05-a2bc-b289ed1ad346", "label":"blah4", "size":.125, "color":.52, "children":[
                        {"id":"27605654-f4fb-4ec0-8967-9c6aaa96934b", "label":"blah41", "size":.25, "color":.19},
                        {"id":"a113de2d-80b1-4223-b040-bb21fb332669", "label":"blah42", "size":.25, "color":.52},
                        {"id":"121fec09-0654-4de1-b27e-3ff23e25dac0", "label":"blah43", "size":.16667, "color":.09},
                        {"id":"0b1c34bf-ae59-40df-a89e-3b9a05feec8d", "label":"blah44", "size":.125, "color":.32},
                        {"id":"6e4576d4-cf15-4c4a-93c2-8408d40a1253", "label":"blah45", "size":.083333, "color":.39},
                        {"id":"55d92db9-52c1-4709-a96b-592c8f886247", "label":"blah46", "size":.083333, "color":.31},
                        {"id":"8dca9e0e-6e40-461f-b3fc-e5c3dde35153", "label":"blah47", "size":.041666667, "color":.74}
                    ]},
                    {"id":"c467043d-b862-4bd5-b7c2-056f4d743a5e", "label":"blah5", "size":.083333, "color":.39, "children":[
                        {"id":"e0b3ced3-96c4-4f01-97e6-8867526eff71", "label":"blah51", "size":.25, "color":.31},
                        {"id":"904ad26e-fde0-41d8-8b5e-97907a1f51c7", "label":"blah52", "size":.25, "color":.85},
                        {"id":"8f58816c-e1d5-4594-9f9e-85d6a11f0ac8", "label":"blah53", "size":.16667, "color":.63},
                        {"id":"ee1ca0bb-a4af-43e2-adcd-8fa9ed4f05b5", "label":"blah54", "size":.125, "color":.52},
                        {"id":"1f7df236-7854-4aac-8e31-b1aded537c86", "label":"blah55", "size":.083333, "color":.98},
                        {"id":"e411614a-30c9-4a0f-9855-52de98a37a64", "label":"blah56", "size":.083333, "color":.32},
                        {"id":"234fa244-33cd-42dd-b4ad-291ea8bc8fae", "label":"blah57", "size":.041666667, "color":.39}
                    ]},
                    {"id":"ae6f93e2-9c4c-4f6c-87e2-0260aebeba55", "label":"blah6", "size":.083333, "color":.98, "children":[
                        {"id":"4511fee8-ae17-4df1-b84b-a3e1a66ea470", "label":"blah61", "size":.25, "color":.19},
                        {"id":"ab206acd-b0f7-4789-9f17-35b54ce119d9", "label":"blah62", "size":.25, "color":.74},
                        {"id":"d436ff53-076d-4b8a-86cc-c102ebf58a3f", "label":"blah63", "size":.16667, "color":.29},
                        {"id":"25a300d6-c361-43ec-b9e1-bad3399383b8", "label":"blah64", "size":.125, "color":.52},
                        {"id":"391c72a8-1db8-4d7c-a84f-51200d092159", "label":"blah65", "size":.083333, "color":.74},
                        {"id":"7071d634-c233-45a2-a169-f0fbe2403292", "label":"blah66", "size":.083333, "color":.39},
                        {"id":"939985e5-1872-4ec4-90d7-1b3c5ab62a2f", "label":"blah67", "size":.041666667, "color":.63}
                    ]},
                    {"id":"08095bd4-0942-470c-92fc-eb042d9f14f3", "label":"blah7", "size":.041666667, "color":.85, "children":[
                        {"id":"0e27d9c9-4b20-44ec-b22b-d19947d1d8c4", "label":"blah71", "size":.25, "color":.39},
                        {"id":"2fa79804-ac2c-47c6-a370-80790742f3d7", "label":"blah72", "size":.25, "color":.52},
                        {"id":"e3ede063-f42b-4573-af6b-c0a3f9281483", "label":"blah73", "size":.16667, "color":.74},
                        {"id":"40e92699-fae5-4703-9520-fe5f5fa56ef6", "label":"blah74", "size":.125, "color":.85},
                        {"id":"9296b705-2bd0-4c77-a5f2-2cbe775fa84a", "label":"blah75", "size":.083333, "color":.98},
                        {"id":"432db33d-f5a3-4acd-a5ef-739b0de091c0", "label":"blah76", "size":.083333, "color":.74},
                        {"id":"4a01b07c-fa6b-4ce6-a12a-2c28c5310475", "label":"blah77", "size":.041666667, "color":.52}
                    ]},
                ]},
            ]
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
                    var rect = nodes[i].geometry;
                    var rgb = that._getRgbColor(nodes[i].color);
                    nodes[i].computedColor = rgb;
                    ctx.save();
                    if ( nodes[i].hasOwnProperty('children')) { // group node
                        ctx.fillStyle = headerGradient(ctx,rect,that.options.groupHeader);
                    } else { // leaf node
                        ctx.fillStyle = that.options.nodeGradient.call(that,ctx,rect,rgb);
                    }
                    ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
                    if ( nodes[i].hasOwnProperty('children')) {
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(rect[0],rect[1]);
                        ctx.lineTo(rect[0],rect[1]+that.options.groupHeader.height);
                        ctx.closePath();
                        ctx.stroke();
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
            var processNodes = function(nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (that.options.nodeData[0] !== nodes[i]){ // skip root node
                        //console.log(nodes[i].label);
                        var rect = nodes[i].geometry;
                        var rgb = nodes[i].computedColor;
                        var text = nodes[i].label;
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(rect[0],rect[1],rect[2],rect[3]);
                        ctx.clip();
                        if ( nodes[i].hasOwnProperty('children')) {
                            // Group Node
                            ctx.fillStyle = '#555'; // TODO: make an option value
                            ctx.font = 'italic 0.625em sans-serif'; // TODO: make option value
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
                            ctx.font = 'italic 0.625em sans-serif';
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
            function _processNodes(rect,nodes,area,layoutMethod,header) {
                var a = [];
                for (var i = 0; i < nodes.length; i++) {
                    a[i]=nodes[i].size*area;
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
                        if (that.options.nodeData[0] !== nodes[i] && (rect[3]-header>0)) { // skips root node
                            rect = [rect[0],rect[1]+header,rect[2],rect[3]-header];
                        }
                        area = rect[2]*rect[3];
                        _processNodes(rect,nodes[i].children,area,layoutMethod,header);
                    }
                }
            };
            var t0 = new Date();
            var that = this;
            var nodeCnt = 0;
            var header = that.options.groupHeader.height;
            var area = that.options.dimensions[0] * that.options.dimensions[1];
            var rect = [0,0,that.options.dimensions[0],that.options.dimensions[1]];
            that._clearNodeList();
            _processNodes(rect,that.options.nodeData,area,layoutMethod,header);
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

