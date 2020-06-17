export function convertForMermaid(functionMap: Map<string, string[]>) {

  const connections = [];

  functionMap.forEach((childArr, key) => {
    childArr.forEach((child) => {
      connections.push(key + '(' + key + ')' + ' --> ' + child + '(' + child + ')')
    });
  });

  return connections;
}


