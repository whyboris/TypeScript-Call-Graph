#!/usr/bin/env node

import open = require('open');

import { processFiles } from './extract';

import { convertForArc } from './arc';
import { convertForCascade } from './cascade';
import { convertForGraphViz } from './graphviz';
import { convertForMermaid } from './mermaid';
import { showHelpMessage, showServerRunning } from './helper';

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
 * If user confirms the files they want to analyze, proceed
 */
function proceed(): void {
  const functions = processFiles(withoutNodeModules);

  startServer(functions.all, functions.called);
}

/**
 * Start Express server with static files and API endpoints
 * @param functionMap
 */
function startServer(allFunctions: string[], functionMap: Map<string, string[]>): void {

  const express = require('express');
  const app = express();

  const path = require('path');

  app.use(express.static(path.join(__dirname, '..', 'graphing')));

  app.use('/arc',      express.static(path.join(__dirname, '..', 'graphing/arc')));
  app.use('/cascade',  express.static(path.join(__dirname, '..', 'graphing/cascade')));
  app.use('/graphviz', express.static(path.join(__dirname, '..', 'graphing/graphviz')));
  app.use('/mermaid',  express.static(path.join(__dirname, '..', 'graphing/mermaid')));
  app.use('/vendor',   express.static(path.join(__dirname, '..', 'graphing/vendor')));

  app.get('/arcAPI',      function (req, res) { res.json(convertForArc(allFunctions, functionMap)) });
  app.get('/cascadeAPI',  function (req, res) { res.json(convertForCascade(functionMap))  });
  app.get('/graphvizAPI', function (req, res) { res.json(convertForGraphViz(functionMap)) });
  app.get('/mermaidAPI',  function (req, res) { res.json(convertForMermaid(functionMap)) });

  app.listen(3000)

  const filePath: string = 'http://localhost:3000';

  showServerRunning(filePath);

  open(filePath);
}
