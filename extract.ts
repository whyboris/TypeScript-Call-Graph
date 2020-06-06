import * as ts from "typescript";
const fs = require('fs');

const functionsToIgnore: string[] = []; // optionally ['require', 'parseInt', 'exec', 'reject', 'resolve'];

const allFunctions: string[] = [];
const calledFunctions: Map<string, string[]> = new Map();

let currentFunction = undefined; // to keep track of which function we are inside

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
function extractFunctionCalls(node: ts.Node, sourceFile: ts.SourceFile, indentLevel: number) {

  // e.g `function hello()`
  if (ts.isFunctionDeclaration(node)) {
    node.forEachChild(child => {
      if (ts.isIdentifier(child)) {
        const declaredFunction: string = child.getText(sourceFile);
        updateDeclaredFunctions(declaredFunction);
      }
    });
  }

  // First child must be `Identifier`
  // examples of what gets skipped: `fs.readFile('lol.json')` or `ipc.on('something', () => {})`
  if (ts.isCallExpression(node)) {
    const child = node.getChildAt(0, sourceFile);
    if (ts.isIdentifier(child)) {
      const calledFunction: string = child.getText(sourceFile);
      updateCalledFunctions(calledFunction);
    }
  }

  // logThings(node, sourceFile, indentLevel);

  node.forEachChild(child => extractFunctionCalls(child, sourceFile, indentLevel + 1));
}

/**
 * Log stuff if needed
 * @param node
 * @param sourceFile
 * @param indentLevel
 */
function logThings(node: ts.Node, sourceFile: ts.SourceFile, indentLevel: number) {
  const indentation = "-".repeat(indentLevel);
  const syntaxKind = ts.SyntaxKind[node.kind];
  const nodeText = node.getText(sourceFile).split('\n')[0];
  console.log(`${indentation}${syntaxKind}: ${nodeText}`);
}


/**
 * Update `allFunctions` and `currentFunction`
 * @param declaredFunction
 */
function updateDeclaredFunctions(declaredFunction: string): void {
  currentFunction = declaredFunction;
  allFunctions.push(declaredFunction);
}

/**
 * Update `calledFunctions` map with current called function name
 * @param calledFunction - name of the function getting called
 */
function updateCalledFunctions(calledFunction: string): void {
  if (!functionsToIgnore.includes(calledFunction)) {

    if (calledFunctions.has(currentFunction)) {
      const pastCalls = calledFunctions.get(currentFunction);
      pastCalls.push(calledFunction);
      calledFunctions.set(currentFunction, pastCalls);
    } else {
      calledFunctions.set(currentFunction, [calledFunction]);
    }
  }
}


export function processFiles(filenames: string[]) {

  // =================================================================================================
  // instead of: extractFunctionCalls(sourceFile, 0, sourceFile);
  // grab all the root nodes first
  // then do recursion for each
  filenames.filter(file => file.endsWith('ts')).forEach((filename) => {

    const rootNodes: ts.Node[] = [];

    const codeAsString: string = fs.readFileSync(filename).toString();

    const sourceFile: ts.SourceFile = ts.createSourceFile(filename, codeAsString, ts.ScriptTarget.Latest);

    sourceFile.forEachChild((child: ts.Node) => {
      rootNodes.push(child)
    });

    rootNodes.forEach((node: ts.Node) => {
      currentFunction = undefined;
      extractFunctionCalls(node, sourceFile, 1);
    });

  });

  calledFunctions.delete(undefined);

  // Output
  console.log('======================================');
  console.log(allFunctions);
  console.log('--------------------------------------');
  console.log(calledFunctions);
  console.log('--------------------------------------');
  console.log('Functions: \t\t\t', allFunctions.length);
  console.log('Functions that call others: \t', calledFunctions.size);
  console.log('--------------------------------------');

  // Only include functions that exist in the `allFunctions` list
  calledFunctions.forEach((value, key) => {
    calledFunctions.set(key, value.filter((calledFunc: string) => {
      return allFunctions.includes(calledFunc);
    }));
  });

  console.log(calledFunctions);

}
