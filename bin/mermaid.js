"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertForMermaid = convertForMermaid;
function convertForMermaid(functionMap) {
    var connections = [];
    functionMap.forEach(function (childArr, key) {
        childArr.forEach(function (child) {
            connections.push(key + '(' + key + ')' + ' --> ' + child + '(' + child + ')');
        });
    });
    return connections;
}
