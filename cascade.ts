interface NodeForGraphing {
  id: string,
  parents: string[],
}

// Some globals
let myMap: Map<string, string[]>;
let final = [];
let calledAlready = []; // to keep track of what has been called; prevent reculsion!

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
 * @param startFunction -- string of the function name we want to use as start of call graph
 */
export function convertForCascade(calledFunctions: Map<string, string[]>, startFunction: string) {
  myMap = calledFunctions;
  final = [];
  calledAlready = [];

  // 1st case -- handle manually
  final.push([{ id: startFunction }]);
  // all next cases generate automatically
  generateNextLevel([startFunction], 10);

  return final;
}
