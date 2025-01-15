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

const createStyle = (baseColor: any) => ({
  fill: baseColor,
  stroke: baseColor,
  labelFill: '#fff',
  labelPadding: 2,
  labelBackgroundFill: baseColor,
  labelBackgroundRadius: 5,
});


const createGraph = (data: any, containerRef: any) => {
  const newGraph = new Graph({
    data: treeToGraphData(data),
    container: containerRef.current, // Use the ref as the container
    autoFit: 'view',
    node: {
      style: {
        size: 16,
        labelText: (d) => d.id,
        labelBackground: true,
        labelPlacement: function (d) {
          const side = getNodeSide(this, d);
          return side === 'center' ? 'right' : side;
        },
        labelCfg: {
          style: {
            fontSize: 10, // Smaller font size for labels
          },
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
      getHeight: () => 24, // Decrease node height
      getWidth: () => 24,  // Decrease node width
      getVGap: () => 2,    // Decrease vertical gap
      getHGap: () => 40,   // Decrease horizontal gap
      getSide: (d: NodeData) => {
        if (d.id === 'Classification') {
          return 'left';
        }
        return 'right';
      },
    },
    behaviors: ['collapse-expand', 'drag-canvas', 'zoom-canvas'],
    plugins: [
      {
        key: 'bubble-sets-a',
        type: 'bubble-sets',
        members: ["Classification", "Consensus1112"],
        labelText: 'cluster-a',
        ...createStyle('#1783FF'),
      }
    ]
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
      <div
        ref={containerRef} // Reference the container div
        style={{ width: '100%', height: '100%' }} // Style for the container
      />
  );
};

export default KnowledgeGraph;
