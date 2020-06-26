"use strict";
exports.__esModule = true;
exports.convertForArc = void 0;
/**
 * Convert the call map to format D3 wants
 * @param calledFunctions
 */
function convertForArc(allFunctions, calledFunctions) {
    var nodes = [];
    var links = [];
    allFunctions.forEach(function (func) {
        nodes.push({
            id: func,
            group: 1
        });
    });
    calledFunctions.forEach(function (childArr, key) {
        childArr.forEach(function (child) {
            links.push({
                source: key,
                target: child,
                value: 1
            });
        });
    });
    var all = {
        nodes: nodes,
        links: links
    };
    return all;
}
exports.convertForArc = convertForArc;
