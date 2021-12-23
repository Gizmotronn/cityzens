import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Import ThirdWeb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// Include what chains will be supported
// 4 = Ethereum/Rinkeby
const supportedChainIds = [4];

// What type of wallet will be supported
// Metamask is supported (Mm is "injected wallet")
const connectors = {
  injected: {},
};

// Wrap app with ThirdwebWeb3Provider
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <div className="landing">
        <App />
      </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);