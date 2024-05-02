import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "../components/ForceGraph.module.css";

export function runForceGraph(
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height + 300;
  const width = containerRect.width + 300;

  const color = (d) => {
    return d.mainNode ? "#63d024" : "#9D00A0"
  };

  const getClass = (d) => {
    return styles.labels;
  };

  const drag = (simulation) => {
    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");

  const addTooltip = (hoverTooltip, d, x, y) => {
    div
      .transition()
      .duration(300)
      .style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 28}px`);
  };

  const removeTooltip = () => {
    div
      .transition()
      .duration(500)
      .style("opacity", 0);
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform);
    }))
    .append("g")

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", (d) => !!d.mainNode ? 25 : 15)
    .attr("fill", d => color(d))
    .call(drag(simulation));
  console.log("🚀 ~ node:", node)

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr("class", d => `fa ${getClass(d)} ${!!d.mainNode && styles.mainNode}`)
    .text(d => d.name)
    .call(drag(simulation));

  label.on("mouseover", (d) => {
    addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
  })
    .on("mouseout", () => {
      removeTooltip();
    });

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x * 2)
      .attr("y1", d => d.source.y * 2)
      .attr("x2", d => d.target.x * 2)
      .attr("y2", d => d.target.y * 2);

    node
      .attr("cx", d => d.x * 2)
      .attr("cy", d => d.y * 2);

    // update label positions
    label
      .attr("x", d => { return d.x * 2; })
      .attr("y", d => { return (d.y * 2) + (!!d.mainNode ? 35 : 25); })
  });

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    }
  };
}
