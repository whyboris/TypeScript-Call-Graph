const graphviz = require('graphviz');

export function generateGraphViz(functionMap: Map<string, string[]>) {

  const g = graphviz.digraph("G");

  functionMap.forEach((value, key) => {
    g.addNode(key);
  });

  functionMap.forEach((childArr, key) => {
    childArr.forEach((child) => {
      g.addEdge(key, child);
    });
  });

  console.log(g.to_dot());

  try {
    g.output("png", "graphing/temp.png");
  } catch (err) {
    console.log('GraphViz not installed');
  }
}


