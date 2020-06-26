"use strict";
exports.__esModule = true;
exports.convertForGraphViz = void 0;
var graphviz = require('graphviz');
function convertForGraphViz(functionMap) {
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
    return g.to_dot();
}
exports.convertForGraphViz = convertForGraphViz;
