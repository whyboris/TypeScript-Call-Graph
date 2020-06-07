interface NodeForGraphing {
  id: string,
  parents: string[],
}

const final = [];

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
      newElements.push({ id: element, parents: [parent] });
    });
  }

  return newElements;
}

/**
 * Recursive function to generate each subsequent level
 * @param parents
 */
function generateNextLevel(parents: string[]): void {

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
      nextLevel.push(...myMap.get(parent))
    }
  });

  if (nextLevel.length) {
    generateNextLevel(nextLevel);
  }
}

/**
 * Convert the call map to format D3 wants
 * @param calledFunctions
 */
export function convertForD3(calledFunctions: Map<string, string[]>) {
  myMap = calledFunctions;

  // 1st case -- handle manually
  final.push([{ id: 'openThisDamnFile' }]);
  // all next cases generate automatically
  generateNextLevel(['openThisDamnFile']);

  console.log('====================');
  console.log(final);
  console.log(JSON.stringify(final));

}
