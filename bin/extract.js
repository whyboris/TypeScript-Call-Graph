"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFiles = processFiles;
var ts = require("typescript");
var fs = require('fs');
var _a = require('kleur'), green = _a.green, red = _a.red;
var functionsToIgnore = []; // optionally ['require', 'parseInt', 'exec', 'reject', 'resolve'];
var allFunctions = [];
var calledFunctions = new Map();
var currentFunction = undefined; // to keep track of which function we are inside
// =================================================================================================
/**
 * Recursively walk through TypeScript code extracting
 *  - function declarations and
 *  - function calls within each function
 *
 * Code modified from https://convincedcoder.com/2019/01/19/Processing-TypeScript-using-TypeScript/
 * @param node
 * @param sourceFile
 * @param indentLevel -- helpful for logging
 */
function extractFunctionCalls(node, sourceFile, indentLevel) {
    // e.g `function hello()`
    if (ts.isFunctionDeclaration(node)) {
        node.forEachChild(function (child) {
            if (ts.isIdentifier(child)) {
                var declaredFunction = child.getText(sourceFile);
                updateDeclaredFunctions(declaredFunction);
            }
        });
    }
    // Arrow function
    if (ts.isVariableDeclaration(node) &&
        node.initializer &&
        ts.isArrowFunction(node.initializer) &&
        indentLevel === 3) {
        var child = node.getChildAt(0, sourceFile);
        if (ts.isIdentifier(child)) {
            var declaredFunction = child.getText(sourceFile);
            updateDeclaredFunctions(declaredFunction);
        }
    }
    // First child must be `Identifier`
    // examples of what gets skipped: `fs.readFile('lol.json')` or `ipc.on('something', () => {})`
    if (ts.isCallExpression(node)) {
        var child = node.getChildAt(0, sourceFile);
        if (ts.isIdentifier(child)) {
            var calledFunction = child.getText(sourceFile);
            updateCalledFunctions(calledFunction);
        }
    }
    // logNode(node, sourceFile, indentLevel);
    node.forEachChild(function (child) { return extractFunctionCalls(child, sourceFile, indentLevel + 1); });
}
/**
 * Log stuff if needed
 * @param node
 * @param sourceFile
 * @param indentLevel
 */
function logNode(node, sourceFile, indentLevel) {
    var indentation = "-".repeat(indentLevel);
    var syntaxKind = ts.SyntaxKind[node.kind];
    var nodeText = node.getText(sourceFile).split('\n')[0];
    console.log("".concat(indentation).concat(syntaxKind, ": ").concat(nodeText));
}
/**
 * Update `allFunctions` and `currentFunction`
 * @param declaredFunction
 */
function updateDeclaredFunctions(declaredFunction) {
    currentFunction = declaredFunction;
    allFunctions.push(declaredFunction);
}
/**
 * Update `calledFunctions` map with current called function name
 * @param calledFunction - name of the function getting called
 */
function updateCalledFunctions(calledFunction) {
    if (!functionsToIgnore.includes(calledFunction)) {
        if (calledFunctions.has(currentFunction)) {
            var pastCalls = calledFunctions.get(currentFunction);
            pastCalls.push(calledFunction);
            calledFunctions.set(currentFunction, pastCalls);
        }
        else {
            calledFunctions.set(currentFunction, [calledFunction]);
        }
    }
}
function processFiles(filenames) {
    // =================================================================================================
    // instead of: extractFunctionCalls(sourceFile, 0, sourceFile);
    // grab all the root nodes first
    // then do recursion for each
    filenames.forEach(function (filename) {
        var rootNodes = [];
        var codeAsString;
        var skipFile = false;
        try {
            codeAsString = fs.readFileSync(filename).toString();
        }
        catch (err) {
            console.log('File', green(filename), red('not found!'), ' - skipping');
            skipFile = true;
        }
        if (!skipFile) {
            var sourceFile_1 = ts.createSourceFile(filename, codeAsString, ts.ScriptTarget.Latest);
            sourceFile_1.forEachChild(function (child) {
                rootNodes.push(child);
            });
            rootNodes.forEach(function (node) {
                currentFunction = undefined;
                extractFunctionCalls(node, sourceFile_1, 1);
            });
        }
    });
    calledFunctions.delete(undefined);
    // Output
    console.log('');
    console.log('======================================');
    console.log(allFunctions);
    console.log('--------------------------------------');
    console.log(calledFunctions);
    console.log('--------------------------------------');
    console.log('Functions: \t\t\t', allFunctions.length);
    console.log('Functions that call others: \t', calledFunctions.size);
    console.log('--------------------------------------');
    // Only include functions that exist in the `allFunctions` list
    calledFunctions.forEach(function (value, key) {
        calledFunctions.set(key, value.filter(function (calledFunc) {
            return allFunctions.includes(calledFunc);
        }));
        if (!calledFunctions.get(key).length) {
            calledFunctions.delete(key);
        }
    });
    console.log(calledFunctions);
    var functions = {
        all: allFunctions,
        called: calledFunctions,
    };
    return functions;
}
