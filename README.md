[![npm version](https://badge.fury.io/js/typescript-call-graph.svg)](https://badge.fury.io/js/typescript-call-graph)

# TypeScript Call Graph

This **CLI** will create an interactive graph of all the functions and their calls in the TypeScript files you provide.

⚠️ This is a work in progress 🚧 More visualization contributions are welcome.

![image](https://user-images.githubusercontent.com/17264277/85908941-62ba6d00-b7e5-11ea-8e50-2686990aa4f5.png)

## How to use

Install globally:

```sh
npm install -g typescript-call-graph
```

Inside any directory, run:

```sh
tcg
```

It will remind you how to use the CLI: you need to provide specific files, or globs (wildcard paths):

```sh
tcg myFile.ts folder/* anotherFolder/**/*
```

## Developing

Clone repository. Edit `index.ts` and/or `extract.ts` and run `npm start` to build changes, `npm test` to run CLI against files in this repository.

Suggestions or PRs for how to improve this CLI are very welcome 	🙇

You may also edit this repository as you'd like and install your custom version of `tcg` command with `npm run global`

### Thank you

- [Matteo Abrate](https://observablehq.com/@nitaku/tangled-tree-visualization-ii) for the _tangled tree visualization_
- [Mike Bostock](https://observablehq.com/@d3/arc-diagram) for the _arc diagram_
- [GraphViz](https://graphviz.org/), [node-graphviz](https://github.com/glejeune/node-graphviz), and [d3-graphviz](https://github.com/magjac/d3-graphviz) for the simple graph
- [Mermaid-JS](https://github.com/mermaid-js/mermaid) for a way to create a graph
- [Tutorial](https://convincedcoder.com/2019/01/19/Processing-TypeScript-using-TypeScript/) and code for processing TypeScript (AST)
- [Tutorial](https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs) for creating a *CLI*
- [TS-Call-Graph](https://github.com/Deskbot/TS-Call-Graph) for inspiration
