import React from "react";
import KnowledgeGraph from "./KnowledgeGraph";

const App: React.FC = () => {
  return (
    <div>
      <div id="navigation">
         <h1>Knowledge Graph</h1>
      </div>
          <div style={{ width: '100%', height: '100%' }} >
          <KnowledgeGraph />
        </div>
    </div>

  );
};

export default App;
