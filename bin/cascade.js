"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
        final.push(__spreadArray([], thisLevel, true));
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
