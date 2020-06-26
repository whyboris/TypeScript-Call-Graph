"use strict";
exports.__esModule = true;
exports.convertForMermaid = void 0;
function convertForMermaid(functionMap) {
    var connections = [];
    functionMap.forEach(function (childArr, key) {
        childArr.forEach(function (child) {
            connections.push(key + '(' + key + ')' + ' --> ' + child + '(' + child + ')');
        });
    });
    return connections;
}
exports.convertForMermaid = convertForMermaid;
