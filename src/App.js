import React, { useState } from "react";

import {ToastsStore, ToastsContainer, ToastsContainerPosition} from 'react-toasts';

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
      setClientConnected(true);
    };

    socketClient.onclose = (e) => {
      console.error(e.type, e.wasClean);
      if (!e.wasClean) {
        ToastsStore.error("Connection Closed by Server!");
      }
      setClientConnected(false);
      setClientStarted(false);
    };
    socketClient.onerror = (e) => {
      console.log("Error in connection");
      ToastsStore.error("Error in connection!");
      setClientConnected(false);
    };

    socketClient.onmessage = (e) => {
      setPackets(e.data);
    };
  }

  const toggleConnect = () => {
    if (clientConnected) {
      socketClient.close();
    } else {
      socketClient = new WebSocket(config.appConfig.websocketServer);
    }
  };
  const toggleStart = () => {
    if (clientStarted) {
      setClientStarted(false);
      controlMessage("stop");
    } else {
      setClientStarted(true);
      controlMessage("start");
    }
  };
  const controlMessage = (message) => {
    socketClient.send(message);
  };

  const openFormSettings = () => {
    setOpenSettings((openSettings) => !openSettings);
  };
  return (
    <>
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
    <ToastsContainer position={ToastsContainerPosition.TOP_CENTER} store={ToastsStore} />
    </>
  );
}

export default App;
