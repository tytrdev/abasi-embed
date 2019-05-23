import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './styles/app.css';
import './firebase'; // initialize firebase
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
