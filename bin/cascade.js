"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.convertForCascade = void 0;
// Some globals
var myMap;
var final = [];
var calledAlready = []; // to keep track of what has been called; prevent reculsion!
/**
 * Take a parent function and return all children in proper format
 * @param parent
 */
function generateFromOneParent(parent) {
    var newElements = [];
    if (myMap.has(parent)) {
        var children = myMap.get(parent);
        children.forEach(function (element) {
            if (!calledAlready.includes(element)) { // PREVENT RECURSION !
                newElements.push({ id: element, parents: [parent] });
            }
        });
    }
    return newElements;
}
/**
 * Recursive function to generate each subsequent level
 * @param parents
 * @param stackDepth - maximum depth of calls to trace
 */
function generateNextLevel(parents, stackDepth) {
    calledAlready.push.apply(calledAlready, parents);
    if (stackDepth === 0) {
        return;
    }
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
        generateNextLevel(nextLevel, stackDepth - 1);
    }
}
/**
 * Convert the call map to format D3 wants
 * @param calledFunctions
 * @param startFunction -- string of the function name we want to use as start of call graph
 */
function convertForCascade(calledFunctions, startFunction) {
    myMap = calledFunctions;
    final = [];
    calledAlready = [];
    // 1st case -- handle manually
    final.push([{ id: startFunction }]);
    // all next cases generate automatically
    generateNextLevel([startFunction], 10);
    return final;
}
exports.convertForCascade = convertForCascade;
