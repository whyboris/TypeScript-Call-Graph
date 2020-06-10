#!/usr/bin/env node

import open = require('open');
const { green, bold } = require('kleur');

import { processFiles } from './extract';

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

  serveStuff();
}



function serveStuff(): void {
  const handler = require('serve-handler');
  const http = require('http');

  const server = http.createServer((request, response) => {
    return handler(request, response, { public: './graphing' });
  })

  server.listen(3000, () => {
    console.log(green('╭───────────────────────────╮'));
    console.log(green('│      ') + 'Graph visible @ ' + green('     │'));
    console.log(green('│  ') + ' http://localhost:3000' + green('   │'));
    console.log(green('│      ') + 'Ctrl + C to quit ' + green('    │'));
    console.log(green('╰───────────────────────────╯'));
    const filePath: string = 'http://localhost:3000';
    open(filePath);
  });
}
