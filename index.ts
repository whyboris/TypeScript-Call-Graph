#!/usr/bin/env node

import { processFiles } from './extract';

const { green, bold } = require('kleur');

const myArgs = process.argv.slice(2);

if (myArgs.length) {

  console.log(myArgs);

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
    + green('*.ts`') + ', `'
    + green('**/*.ts`') + ', `'
    + green('myFolder/*.ts') + '`');
  console.log('or any combination of the above, like `' + green('myFile.ts myFolder/*.ts') + '`');
}

function proceed(): void {
  processFiles(myArgs);
}
