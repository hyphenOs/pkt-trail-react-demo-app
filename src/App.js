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
  const [clientConnectRequested, setClientConnectRequested] = useState(false);
  const [clientConnected, setClientConnected] = useState(false);
  const [clientStarted, setClientStarted] = useState(false);
  const [config, setConfig] = useState(defaultConfig);
  const [openSettings, setOpenSettings] = useState(false);

  const [packets, setPackets] = useState([]);

  if (socketClient) {
    socketClient.onopen = (e) => {
      console.log("connection opened");
      setClientConnected(true);
      setClientConnectRequested(false);
    };

    socketClient.onclose = (e) => {
      console.error(e);
      if (!e.wasClean) {
        ToastsStore.error("Connection Closed by Server! Check if Server is running!");
      }
      setClientConnected(false);
      setClientStarted(false);
    };

    socketClient.onerror = (e) => {
      console.log("Error in connection");
      setClientConnected(false);
      setClientConnectRequested(false);
    };

    socketClient.onmessage = (e) => {
      setPackets(e.data);
    };
  }

  const toggleConnect = () => {
    if (clientConnected) {
      socketClient.close();
    } else {
      setClientConnectRequested(true);
      try {
        socketClient = new WebSocket(config.appConfig.websocketServer);
      } catch (error) {
        console.log(error);
      }
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
        <Button disabled={clientStarted || clientConnectRequested} onClick={toggleConnect}>
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
