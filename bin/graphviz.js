"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertForGraphViz = convertForGraphViz;
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
