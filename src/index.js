import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SaveTheDate from './SaveTheDate';
import reportWebVitals from './reportWebVitals';
import Footer from './footer/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SaveTheDate />
    <Footer />
  </React.StrictMode>
);

reportWebVitals(console.log);
