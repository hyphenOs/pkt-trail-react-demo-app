import React, { useState, useEffect } from "react";

import {
  ToastsStore,
  ToastsContainer,
  ToastsContainerPosition,
} from "react-toasts";

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
import { useCallback } from "react";

import packets5 from './testdata/sample-packets-5.json'

let socketClient;

function App() {
  const [clientConnectRequested, setClientConnectRequested] = useState(false);
  const [clientConnected, setClientConnected] = useState(false);
  const [clientStarted, setClientStarted] = useState(false);
  const [config, setConfig] = useState(defaultConfig);
  const [openSettings, setOpenSettings] = useState(false);

  const [packets, setPackets] = useState([]);

  const [isPktTrailReady, setIsPktTrailReady] = useState(false);

  if (socketClient) {
    socketClient.onopen = (e) => {
      console.log("connection opened");
      setClientConnected(true);
      setClientConnectRequested(false);
    };

    socketClient.onclose = (e) => {
      console.error(e);
      if (!e.wasClean) {
        ToastsStore.error(
          "Connection Closed by Server! Check if Server is running!"
        );
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

  const getPktTrailReadyStatus = useCallback((readyStatus) => {
    setIsPktTrailReady(readyStatus);
  }, []);

  return (
    <>
      <AppContainer>
        <AppToolbar>
          <Header>Pkt Trail React Demo App</Header>
          <Button
            disabled={
              clientStarted || clientConnectRequested || !isPktTrailReady
            }
            onClick={toggleConnect}
          >
            {clientConnected ? "Disconnect" : "Connect"}
          </Button>
          <Button
            disabled={!clientConnected || !isPktTrailReady}
            onClick={toggleStart}
          >
            {clientStarted ? "Stop" : "Start"}
          </Button>
          <Button disabled={!isPktTrailReady} onClick={openFormSettings}>
            Settings
          </Button>
          {openSettings && (
            <Settings
              setOpenSettings={setOpenSettings}
              setConfigProps={setConfig}
              configProps={config}
            />
          )}
        </AppToolbar>
        <AppContent>
          <PktTrail
            packets={packets}
            config={config}
            getPktTrailReadyStatus={getPktTrailReadyStatus}
          />
        </AppContent>
      </AppContainer>
      <ToastsContainer
        position={ToastsContainerPosition.TOP_CENTER}
        store={ToastsStore}
      />
    </>
  );
}

export default App;
