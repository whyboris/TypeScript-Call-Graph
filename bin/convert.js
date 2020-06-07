"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.convertForD3 = void 0;
var final = [];
var myMap;
/**
 * Take a parent function and return all children in proper format
 * @param parent
 */
function generateFromOneParent(parent) {
    var newElements = [];
    if (myMap.has(parent)) {
        var children = myMap.get(parent);
        children.forEach(function (element) {
            newElements.push({ id: element, parents: [parent] });
        });
    }
    return newElements;
}
/**
 * Recursive function to generate each subsequent level
 * @param parents
 */
function generateNextLevel(parents) {
    // Generate the NodeForGraphing[] for this 'level'
    var thisLevel = [];
    parents.forEach(function (parent) {
        thisLevel.push.apply(thisLevel, generateFromOneParent(parent));
    });
    if (thisLevel.length) {
        final.push(__spreadArrays(thisLevel));
    }
    // start building the next `level`
    var nextLevel = [];
    parents.forEach(function (parent) {
        if (myMap.has(parent)) {
            nextLevel.push.apply(nextLevel, myMap.get(parent));
        }
    });
    if (nextLevel.length) {
        generateNextLevel(nextLevel);
    }
}
/**
 * Convert the call map to format D3 wants
 * @param calledFunctions
 */
function convertForD3(calledFunctions) {
    myMap = calledFunctions;
    // 1st case -- handle manually
    final.push([{ id: 'openThisDamnFile' }]);
    // all next cases generate automatically
    generateNextLevel(['openThisDamnFile']);
    console.log('====================');
    console.log(final);
    console.log(JSON.stringify(final));
}
exports.convertForD3 = convertForD3;
