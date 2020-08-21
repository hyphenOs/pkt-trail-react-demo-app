import React, { useState } from "react";
import PktTrail from "pkt-trail-react";
import {
  Button,
  AppContainer,
  AppToolbar,
  AppContent,
  Header,
} from "./components/StyledComponents";
import defaultConfig from "./constants/config";
import Settings from "./components/Settings";

let socketClient;

function App() {
  const [clientConnected, setClientConnected] = useState(false);
  const [clientStarted, setClientStarted] = useState(false);
  const [config, setConfig] = useState(defaultConfig);
  const [openSettings, setOpenSettings] = useState(false);

  const [packets, setPackets] = useState([]);

  if (socketClient) {
    socketClient.onopen = (e) => {
      console.log("connection opened");
    };

    socketClient.onclose = (e) => {
      console.log("Connection closed");
    };
    socketClient.onerror = (e) => {
      console.log("Error in connection");
    };

    socketClient.onmessage = (e) => {
      console.log("e.data", e.data);
      setPackets(e.data);
    };
  }

  const toggleConnect = () => {
    if (clientConnected) {
      socketClient.close();
      setClientConnected(false);
    } else {
      socketClient = new WebSocket(config.appConfig.websocketServer);
      setClientConnected(true);
    }
  };
  const toggleStart = () => {
    if (clientStarted) {
      setClientStarted(false);
      stream("stop");
    } else {
      setClientStarted(true);
      stream("start");
    }
  };
  const stream = (message) => {
    socketClient.send(message);
  };

  const openFormSettings = () => {
    setOpenSettings((openSettings) => !openSettings);
  };
  return (
    <AppContainer>
      <AppToolbar>
        <Header>Pkt Trail React Demo App</Header>
        <Button disabled={clientStarted} onClick={toggleConnect}>
          {clientConnected ? "Disconnect" : "Connect"}
        </Button>
        <Button disabled={!clientConnected} onClick={toggleStart}>
          {clientStarted ? "Stop" : "Start"}
        </Button>
        <Button onClick={openFormSettings}>Settings</Button>
        {openSettings && (
          <Settings
            setOpenSettings={setOpenSettings}
            setConfigProps={setConfig}
            configProps={config}
          />
        )}
      </AppToolbar>
      <AppContent>
        <PktTrail packets={packets} config={config} />
      </AppContent>
    </AppContainer>
  );
}

export default App;
