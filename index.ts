#!/usr/bin/env node

import { processFiles } from './extract';

const { green, bold } = require('kleur');

const myArgs = process.argv.slice(2);

const onlyTypescript: string[] = myArgs.filter(file => file.endsWith('ts'));

const withoutNodeModules: string[] = onlyTypescript.filter(file => !file.includes('node_modules'));

if (withoutNodeModules.length) {

  console.log(withoutNodeModules);

  var inquirer = require('inquirer');

  inquirer
    .prompt([{
      type: 'confirm',
      name: 'want',
      message: 'Are these the files you want to analyze?',
      default: false
    }])
    .then(answer => {
      if (answer.want) {
        proceed();
      }
    })

} else {
  showHelpMessage();
}

function showHelpMessage(): void {
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
function proceed(): void {
  processFiles(withoutNodeModules);
}
