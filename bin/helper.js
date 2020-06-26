"use strict";
exports.__esModule = true;
exports.showServerRunning = exports.showHelpMessage = void 0;
var _a = require('kleur'), green = _a.green, bold = _a.bold;
/**
 * Shown when user runs `tcg` without arguments
 */
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
exports.showHelpMessage = showHelpMessage;
/**
 * Console log that server is running
 * @param filePath
 */
function showServerRunning(filePath) {
    // Helpful message
    console.log(green('╭───────────────────────────╮'));
    console.log(green('│      ') + 'Graph visible @ ' + green('     │'));
    console.log(green('│   ') + filePath + green('   │'));
    console.log(green('│      ') + 'Ctrl + C to quit ' + green('    │'));
    console.log(green('╰───────────────────────────╯'));
}
exports.showServerRunning = showServerRunning;
