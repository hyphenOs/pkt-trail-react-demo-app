import React from "react";
import PktTrail from "pkt-trail-react";
import samplePackets5 from "./testdata/sample-packets-5.json";

function App() {
  return (
    <div className="App">
      <PktTrail
        packets={samplePackets5.map((packet, i) =>
          i === 3 ? packet : JSON.stringify(packet)
        )}
      />
    </div>
  );
}

export default App;
