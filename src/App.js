import React, { useEffect, useState } from 'react';
import data from './data/data.json';
import jsonLdData from './data/jsonLd.json';
import { ForceGraph } from "./components/ForceGraph";
import './App.css';
import transformData from './lib/graphDataTransformer';
import { listDocuments } from './api/FlureeMethods';

function App() {
  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>     
      <b>${node.value}</b>
    </div>`;
  }, []);

  const [documents, setDocuments] = useState([])
  const [graphData, setGraphData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const docs = await listDocuments()
      setDocuments(docs)
      console.log("🚀 ~ useEffect ~ docs:", docs)

      const transformedData = transformData(docs)
      console.log("🚀 ~ App ~ transformedData:", transformedData)
      setGraphData(transformedData)
    }
    fetchData();
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        Documents Graph
      </header>
      <section className="Main">
        {!!graphData?.nodes?.length && < ForceGraph linksData={graphData.links || []} nodesData={graphData.nodes || []} nodeHoverTooltip={nodeHoverTooltip} />}
      </section>
      <div className='documents'>
        <pre className=''>{JSON.stringify(documents, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
