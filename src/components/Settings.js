import React from "react";
import "./Settings.css";
import { useState } from "react";

const Settings = ({ setOpenSettings, configProps, setConfigProps }) => {
  const [config, setConfig] = useState(configProps);
  const closeFormSettings = () => {
    setOpenSettings(false);
  };
  const saveSettings = (e) => {
    e.preventDefault();
    setConfigProps(config);
    closeFormSettings();
  };

  const onChangeHandler = (e, key, param, value = null) => {
    const newValue = e.target.value || value;

    setConfig((config) => ({
      ...config,
      [key]: {
        ...config[key],
        [param]: newValue,
      },
    }));
  };

  return (
    <div className="settings-modal">
      <div className="settings-container">
        <h2 className="settings-header">Settings</h2>
        <form className="settings-form" onSubmit={saveSettings}>
          <section>
            <h3>App Settings</h3>
            <label>Websocket server</label>
            <input
              value={config.appConfig.websocketServer}
              onChange={(e) =>
                onChangeHandler(e, "appConfig", "websocketServer")
              }
            />
          </section>
          <section>
            <h3>Dashboard Settings</h3>
            <label>Show Selected Details</label>
            <button
              type="button"
              onClick={(e) =>
                onChangeHandler(
                  e,
                  "dashboardConfig",
                  "showSelectedDetails",
                  !config.dashboardConfig.showSelectedDetails
                )
              }
            >
              {String(config.dashboardConfig.showSelectedDetails)}
            </button>
          </section>
          <section>
            <h3>Table Settings</h3>
            <label>Packet Window Size</label>
            <input
              value={config.tableConfig.packetWindowSize}
              onChange={(e) =>
                onChangeHandler(e, "tableConfig", "packetWindowSize")
              }
            />
            <br />
            <label>Jump Size</label>
            <input
              value={config.tableConfig.jumpSize}
              onChange={(e) => onChangeHandler(e, "tableConfig", "jumpSize")}
            />
          </section>
          <section>
            <h3>Packet Details Settings</h3>
            <label>Expanded</label>
            <button
              type="button"
              onClick={(e) => {
                onChangeHandler(
                  e,
                  "detailsConfig",
                  "expanded",
                  !config.detailsConfig.expanded
                );
              }}
            >
              {String(config.detailsConfig.expanded)}
            </button>
          </section>
          <div className="settings-form-action-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={closeFormSettings}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
