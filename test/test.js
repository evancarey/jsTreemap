/*jslint browser:true, white:true, nomen:true*/
/*global module, test, ok, equal, strictEqual: false*/
(function(globals) {
    "use strict";

    var $ = globals.$,
        testNodeData = {
            id: '123',
            size: [1],
            color: [1],
            children: [
                {
                    id: '1234',
                    size: [1],
                    color: [0.5]
                }
            ]
        };

    $(function() {
        module('basic tests');
        test('jQuery plugin exists', function() {
            var treemapFunc = $('body').treemap;

            ok(treemapFunc);
            ok(typeof treemapFunc === 'function');
        });

        test('building a basic treemap', function() {
            var $treemapWrapper = $('#treemap-wrapper'),
                $canvas;

            $treemapWrapper.treemap({
                dimensions: [300, 200],
                nodeBorderWidth: 1,
                nodeData: testNodeData
            });

            $canvas = $('canvas', $treemapWrapper);
            ok($canvas);
            equal(300, $canvas.width());
            equal(200, $canvas.height());
        });
    });

}(window));
