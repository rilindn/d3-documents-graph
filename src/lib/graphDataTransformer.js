function transformData(inputData) {
    let nodes = [];
    let links = [];
    let nodeId = 1;

    function extractNodesAndLinks(obj, parentId) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const nodeId = nodes.length + 1;
                nodes.push({ id: nodeId, name: key, value: obj[key]['@id'] || obj[key]['name'] || '', isNodeId: true });
                links.push({ source: parentId, target: nodeId });
                extractNodesAndLinks(obj[key], nodeId);
            } else {
                if (key === '@id' || key === 'name') continue;
                const nodeId = nodes.length + 1;
                nodes.push({ id: nodeId, name: key, value: obj[key] || '' });
                links.push({ source: parentId, target: nodeId });
            }
        }
    }

    inputData.forEach((item) => {
        const parentId = nodes.length + 1;
        nodes.push({ id: parentId, name: '@id', value: item['@id'], mainNode: true });
        // nodeId++;
        extractNodesAndLinks(item, parentId);
    });

    return { nodes, links };
}


export default transformData

