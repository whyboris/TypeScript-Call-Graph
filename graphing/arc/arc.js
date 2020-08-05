// https://observablehq.com/@d3/arc-diagram@265
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["arcData.json", new URL(`${window.location.origin}/arcAPI`, import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`## Arc Diagram`
    )
  });
  main.variable(observer("viewof order")).define("viewof order", ["d3", "html"], function (d3, html) {
    const options = [
      { name: "Order by name", value: (a, b) => d3.ascending(a.id, b.id) },
      { name: "Order by group", value: (a, b) => a.group - b.group || d3.ascending(a.id, b.id) },
      { name: "Order by degree", value: (a, b) => d3.sum(b.sourceLinks, l => l.value) + d3.sum(b.targetLinks, l => l.value) - d3.sum(a.sourceLinks, l => l.value) - d3.sum(a.targetLinks, l => l.value) || d3.ascending(a.id, b.id) }
    ];
    const form = html`<form style="display: flex; align-items: center; min-height: 33px;"><select name=i>${options.map(o => Object.assign(html`<option>`, { textContent: o.name }))}`;
    const timeout = setTimeout(() => {
      form.i.selectedIndex = 1;
      form.dispatchEvent(new CustomEvent("input"));
    }, 2000);
    form.onchange = () => {
      clearTimeout(timeout);
      form.value = options[form.i.selectedIndex].value;
      form.dispatchEvent(new CustomEvent("input")); // Safari
    };
    form.value = options[form.i.selectedIndex].value;
    return form;
  }
  );
  main.variable(observer("order")).define("order", ["Generators", "viewof order"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3", "DOM", "width", "height", "graph", "margin", "y", "color", "arc", "step", "viewof order", "invalidation"], function (d3, DOM, width, height, graph, margin, y, color, arc, step, $0, invalidation) {
    const svg = d3.select(DOM.svg(width, height));

    svg.append("style").text(`

      .hover path {
        stroke: #ccc;
      }

      .hover text {
        fill: #ccc;
      }

      .hover g.primary text {
        fill: black;
        font-weight: bold;
      }

      .hover g.secondary text {
        fill: #333;
      }

      .hover path.primary {
        stroke: #333;
        stroke-opacity: 1;
      }

    `);

    const label = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "beginning")
      .selectAll("g")
      .data(graph.nodes)
      .join("g")
      .attr("transform", d => `translate(${margin.left},${d.y = y(d.id)})`)
      .call(g => g.append("text")
        .attr("x", 6)
        .attr("dy", "0.35em")
        .attr("fill", d => d3.lab(color(d.group)).darker(2))
        .text(d => d.id))
      .call(g => g.append("circle")
        .attr("r", 3)
        .attr("fill", d => color(d.group)));

    const path = svg.insert("g", "*")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("stroke", d => d.source.group === d.target.group ? color(d.source.group) : "#aaa")
      .attr("d", arc);

    const overlay = svg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("width", margin.left + 40)
      .attr("height", step)
      .attr("y", d => y(d.id) - step / 2)
      .on("mouseover", d => {
        svg.classed("hover", true);
        label.classed("primary", n => n === d);
        label.classed("secondary", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
        path.classed("primary", l => l.source === d || l.target === d).filter(".primary").raise();
      })
      .on("mouseout", d => {
        svg.classed("hover", false);
        label.classed("primary", false);
        label.classed("secondary", false);
        path.classed("primary", false).order();
      });

    function update() {
      y.domain(graph.nodes.sort($0.value).map(d => d.id));

      const t = svg.transition()
        .duration(750);

      label.transition(t)
        .delay((d, i) => i * 20)
        .attrTween("transform", d => {
          const i = d3.interpolateNumber(d.y, y(d.id));
          return t => `translate(${margin.left},${d.y = i(t)})`;
        });

      path.transition(t)
        .duration(750 + graph.nodes.length * 20)
        .attrTween("d", d => () => arc(d));

      overlay.transition(t)
        .delay((d, i) => i * 20)
        .attr("y", d => y(d.id) - step / 2);
    }

    $0.addEventListener("input", update);
    invalidation.then(() => $0.removeEventListener("input", update));

    return svg.node();
  }
  );
  main.variable(observer("arc")).define("arc", ["margin"], function (margin) {
    return (
      function arc(d) {
        const y1 = d.source.y;
        const y2 = d.target.y;
        const r = Math.abs(y2 - y1) / 2;
        return `M${margin.left},${y1}A${r},${r} 0,0,${y1 < y2 ? 0 : 1} ${margin.left},${y2}`;
      }
    )
  });
  main.variable(observer("y")).define("y", ["d3", "graph", "margin", "height"], function (d3, graph, margin, height) {
    return (
      d3.scalePoint(graph.nodes.map(d => d.id).sort(d3.ascending), [margin.top, height - margin.bottom])
    )
  });
  main.variable(observer("margin")).define("margin", function () {
    return (
      { top: 20, right: 20, bottom: 20, left: 500 }
    )
  });
  main.variable(observer("height")).define("height", ["data", "step", "margin"], function (data, step, margin) {
    return (
      (data.nodes.length - 1) * step + margin.top + margin.bottom // !!! EDIT HERE FOR SPACE BETWEEN LINES "HEIGHT" !!! <-------------------
    )
  });
  main.variable(observer("step")).define("step", function () {
    return (
      14
    )
  });
  main.variable(observer("color")).define("color", ["d3", "graph"], function (d3, graph) {
    return (
      d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), d3.schemeCategory10)
    )
  });
  main.variable(observer("graph")).define("graph", ["data"], function (data) {
    const nodes = data.nodes.map(({ id, group }) => ({
      id,
      sourceLinks: [],
      targetLinks: [],
      group
    }));

    const nodeById = new Map(nodes.map(d => [d.id, d]));

    const links = data.links.map(({ source, target, value }) => ({
      source: nodeById.get(source),
      target: nodeById.get(target),
      value
    }));

    for (const link of links) {
      const { source, target, value } = link;
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    }

    return { nodes, links };
  }
  );
  main.variable(observer("data")).define("data", ["FileAttachment"], function (FileAttachment) {
    return (
      FileAttachment("arcData.json").json()
    )
  });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@5")
    )
  });
  return main;
}
