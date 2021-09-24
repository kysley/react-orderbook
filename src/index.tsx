import { Provider as JotaiProvider } from 'jotai';
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <JotaiProvider>
      <App />
    </JotaiProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
