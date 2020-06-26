/**
 * Convert the call map to format D3 wants
 * @param calledFunctions
 */
export function convertForArc(allFunctions: string[], calledFunctions: Map<string, string[]>) {

  const nodes = [];
  const links = [];

  allFunctions.forEach((func: string) => {
    nodes.push({
      id: func,
      group: 1, // later make this tied to an integer representing the file it came from
    })
  });

  calledFunctions.forEach((childArr, key) => {
    childArr.forEach((child) => {
      links.push({
        source: key,
        target: child,
        value: 1, // indicates 'strength' of connection -- leave as 1 for now
      });
    });
  });

  const all = {
    nodes: nodes,
    links: links,
  };

  return all;
}
