const fs = require('fs')

interface NodeForGraphing {
  id: string,
  parents: string[],
}

const final = [];

const calledAlready = []; // to keep track of what has been called; prevent reculsion!

let myMap: Map<string, string[]>;

/**
 * Take a parent function and return all children in proper format
 * @param parent
 */
function generateFromOneParent(parent: string): NodeForGraphing[] {
  const newElements = [];

  if (myMap.has(parent)) {
    const children =  myMap.get(parent);

    children.forEach((element) => {
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
function generateNextLevel(parents: string[], stackDepth: number): void {

  calledAlready.push(...parents);

  if (stackDepth === 0) {
    return;
  }

  // Generate the NodeForGraphing[] for this 'level'
  let thisLevel = [];

  parents.forEach(parent => {
    thisLevel.push(...generateFromOneParent(parent));
  });

  if (thisLevel.length) {
    final.push([...thisLevel]);
  }

  // start building the next `level`
  let nextLevel = [];

  parents.forEach(parent => {
    if (myMap.has(parent)) {
      nextLevel.push(...myMap.get(parent));
    }
  });

  if (nextLevel.length) {
    generateNextLevel(nextLevel, stackDepth - 1);
  }
}

/**
 * Convert the call map to format D3 wants
 * @param calledFunctions
 */
export function convertForD3(calledFunctions: Map<string, string[]>) {
  myMap = calledFunctions;

  // 1st case -- handle manually
  final.push([{ id: 'proceed' }]);
  // all next cases generate automatically
  generateNextLevel(['proceed'], 10);

  console.log('====================');
  console.log(final);
  console.log(JSON.stringify(final));

  try {
    fs.writeFileSync('./graphing/temp', JSON.stringify(final))
  } catch (err) {
    console.error(err)
  }

}
