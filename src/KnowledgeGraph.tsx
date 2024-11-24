import React, { useEffect, useRef, useState } from 'react';
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


const createGraph = (data: any, containerRef: any) => {
  const newGraph = new Graph({
    data: treeToGraphData(data),
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
  return newGraph;
}

let graph_global: any = null

const KnowledgeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
  
  useEffect(() => {
    console.log('----------------------- useEffect');
    // Check if the graph is already created, if not, create it
    if (containerRef.current) {

      if (graph_global == null) {
        console.log('Creating new graph...');
        graph_global = createGraph(graphData, containerRef)
      } else {
        console.log('Updating graph...');
        graph_global.updateData(graphData)
      }

      // state is not immediatelly updated
    } else {

    }

    return () => {
      if (graph_global) {
        console.log('Destroy graph...');
        graph_global.destroy(); // Destroy the graph when component unmounts or re-renders
        graph_global = null; // Clear the reference
      }
    };

  }, []); // Dependencies on graph and graphData

  return (
    <div>
      <h1>My AntV G6 Graph</h1>
      <div
        ref={containerRef} // Reference the container div
        style={{ width: '100%', height: '100%' }} // Style for the container
      />
    </div>
  );
};

export default KnowledgeGraph;
