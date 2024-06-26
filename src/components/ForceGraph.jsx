import React from "react";
import { runForceGraph } from "../lib/forceGraphGenerator";
import styles from "./ForceGraph.module.css";

export function ForceGraph({ linksData, nodesData, nodeHoverTooltip }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = runForceGraph(containerRef.current, linksData, nodesData, nodeHoverTooltip);
      destroyFn = destroy;
    }

    return destroyFn;
  }, [linksData, nodeHoverTooltip, nodesData]); 

  return <div ref={containerRef} className={styles.container} />;
}
