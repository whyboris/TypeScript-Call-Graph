"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertForArc = convertForArc;
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
            group: 1, // later make this tied to an integer representing the file it came from
        });
    });
    calledFunctions.forEach(function (childArr, key) {
        childArr.forEach(function (child) {
            links.push({
                source: key,
                target: child,
                value: 1, // indicates 'strength' of connection -- leave as 1 for now
            });
        });
    });
    var all = {
        nodes: nodes,
        links: links,
    };
    return all;
}
