#!/usr/bin/env node

import open = require('open');
const { green, bold } = require('kleur');

import { processFiles } from './extract';
import { convertForD3 } from './convert';
import { generateGraphViz } from './graphviz';

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

/**
 * Shown when user runs `tcg` without arguments
 */
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
  const functionMap: Map<string, string[]> = processFiles(withoutNodeModules);

  generateGraphViz(functionMap);

  startServer(functionMap);
}

/**
 * Start Express server with static files and API endpoints
 * @param functionMap
 */
function startServer(functionMap): void {

  const express = require('express');
  const app = express();

  const path = require('path');

  app.use(express.static(path.join(__dirname, '..', 'graphing')));

  app.get('/hi', function (req, res) {
    res.json(convertForD3(functionMap));
  });

  app.listen(3000)

  const filePath: string = 'http://localhost:3000';

  // Helpful message
  console.log(green('╭───────────────────────────╮'));
  console.log(green('│      ') + 'Graph visible @ ' + green('     │'));
  console.log(green('│   ') +        filePath         + green('   │'));
  console.log(green('│      ') + 'Ctrl + C to quit ' + green('    │'));
  console.log(green('╰───────────────────────────╯'));

  open(filePath);
}
