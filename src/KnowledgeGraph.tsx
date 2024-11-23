import React, { useEffect, useRef } from 'react';
import { Graph, treeToGraphData } from '@antv/g6';

import graphData from './GraphData.json'; // Import the local JSON file

// Define the function to determine node side
const getNodeSide = (graph: Graph, datum: any) => {
  const parentData = graph.getParentData(datum.id, 'tree');
  if (!parentData?.style?.x) return 'center'; // Ensure style.x is defined
  return datum.style.x > parentData.style.x ? 'right' : 'left';
};

type NodeData = {
  id: string;
  label: string;
  children?: NodeData[];
};

const KnowledgeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
  const graphRef = useRef<Graph | null>(null); // Ref for the graph instance

  useEffect(() => {
    const graph = graphRef.current;

    // Create the graph only if it doesn't exist yet
    if (!graph && containerRef.current != null) {
      const newGraph = new Graph({
        data: treeToGraphData(graphData),
        container: containerRef.current, // Use the ref as the container
        autoFit: 'view',
        node: {
          style: {
            labelText: (d) => d.id,
            labelBackground: true,
            labelPlacement: function (d) {
              const side = getNodeSide(this, d);
              return side === 'center' ? 'right' : side;
            },
            ports: [{ placement: 'right' }, { placement: 'left' }],
          },
          animation: {
            enter: false,
          },
        },
        edge: {
          type: 'cubic-horizontal',
          animation: {
            enter: false,
          },
        },
        layout: {
          type: 'mindmap',
          direction: 'H',
          getHeight: () => 32,
          getWidth: () => 32,
          getVGap: () => 4,
          getHGap: () => 64,
          getSide: (d: NodeData) => {
            if (d.id === 'Classification') {
              return 'left';
            }
            return 'right';
          },
        },
        behaviors: ['collapse-expand', 'drag-canvas', 'zoom-canvas'],
      });

      newGraph.render();
      graphRef.current = newGraph; // Store the new graph instance in the ref
    }

    // Cleanup function: destroy the graph before creating a new one
    return () => {
      if (graphRef.current) {
        graphRef.current.destroy(); // Destroy the graph when component unmounts or re-renders
        graphRef.current = null; // Clear the reference
      }
    };
  }, []); // Only run on mount and unmount

  return (
    <div>
      <h1>My AntV G6 Graph</h1>
      <div
        ref={containerRef} // Reference the container div
        style={{ width: '100%', height: '100%'}} // Style for the container
      />
    </div>
  );
};

export default KnowledgeGraph;
