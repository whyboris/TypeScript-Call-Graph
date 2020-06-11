#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var open = require("open");
var _a = require('kleur'), green = _a.green, bold = _a.bold;
var extract_1 = require("./extract");
var convert_1 = require("./convert");
var graphviz_1 = require("./graphviz");
var myArgs = process.argv.slice(2);
var onlyTypescript = myArgs.filter(function (file) { return file.endsWith('ts'); });
var withoutNodeModules = onlyTypescript.filter(function (file) { return !file.includes('node_modules'); });
if (withoutNodeModules.length) {
    console.log(withoutNodeModules);
    var inquirer = require('inquirer');
    inquirer
        .prompt([{
            type: 'confirm',
            name: 'want',
            message: 'Are these the files you want to analyze?',
            "default": false
        }])
        .then(function (answer) {
        if (answer.want) {
            proceed();
        }
    });
}
else {
    showHelpMessage();
}
function showHelpMessage() {
    console.log(green('╭───────────────────────────╮'));
    console.log(green('│                           │'));
    console.log(green('│   ') + bold('Typescript Node Graph') + green('   │'));
    console.log(green('│                           │'));
    console.log(green('╰───────────────────────────╯'));
    console.log('Please provide a list of input files and/or folders');
    console.log('e.g. `'
        + green('myFile.ts') + '`, `'
        + green('*') + '`, `'
        + green('**/*') + '`, `'
        + green('myFolder/*') + '`');
    console.log('or any combination of the above, like `' + green('myFile.ts myFolder/*') + '`');
}
/**
 * If user confirms the files they want to analyze, proceed
 */
function proceed() {
    var functionMap = extract_1.processFiles(withoutNodeModules);
    convert_1.convertForD3(functionMap);
    graphviz_1.generateGraphViz(functionMap);
    serveStuff();
}
function serveStuff() {
    var handler = require('serve-handler');
    var http = require('http');
    var server = http.createServer(function (request, response) {
        return handler(request, response, { public: './graphing' });
    });
    server.listen(3000, function () {
        console.log(green('╭───────────────────────────╮'));
        console.log(green('│      ') + 'Graph visible @ ' + green('     │'));
        console.log(green('│  ') + ' http://localhost:3000' + green('   │'));
        console.log(green('│      ') + 'Ctrl + C to quit ' + green('    │'));
        console.log(green('╰───────────────────────────╯'));
        var filePath = 'http://localhost:3000';
        open(filePath);
    });
}
