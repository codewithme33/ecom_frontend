import React from 'react';
import ReactDOM from 'react-dom/client';
// add our bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

import 'notyf/notyf.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



