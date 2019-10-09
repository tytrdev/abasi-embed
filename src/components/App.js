import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Configurator from './Configurator';

// Styles
import '../styles/app.css';

const App = () => (
  <div id="app-container" className="flex columns">
    {/* Notification Container */}
    <ToastContainer
      className="toast-container"
      toastClassName="dark-toast"
      progressClassName="toast-progress"
      position="bottom-center"
    />

    <div id="app-body" className="flex app-body">
      <Configurator />
    </div>
  </div>
);

export default App;
