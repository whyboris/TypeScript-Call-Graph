const graphviz = require('graphviz');

export function generateGraphViz(functionMap: Map<string, string[]>) {

  const g = graphviz.digraph("G");

  g.set("rankdir", "LR");

  functionMap.forEach((value, key) => {
    g.addNode(key);
  });

  functionMap.forEach((childArr, key) => {
    childArr.forEach((child) => {
      g.addEdge(key, child);
    });
  });

  // console.log(g.to_dot());

  return g.to_dot();
}


