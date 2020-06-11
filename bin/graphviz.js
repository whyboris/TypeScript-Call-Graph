"use strict";
exports.__esModule = true;
exports.generateGraphViz = void 0;
var graphviz = require('graphviz');
function generateGraphViz(functionMap) {
    var g = graphviz.digraph("G");
    g.set("rankdir", "LR");
    functionMap.forEach(function (value, key) {
        g.addNode(key);
    });
    functionMap.forEach(function (childArr, key) {
        childArr.forEach(function (child) {
            g.addEdge(key, child);
        });
    });
    console.log(g.to_dot());
    try {
        g.output("png", "graphing/temp.png");
    }
    catch (err) {
        console.log('GraphViz not installed');
    }
}
exports.generateGraphViz = generateGraphViz;
